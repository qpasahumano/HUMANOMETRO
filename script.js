let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

const BASE_MODULES = [
  { name:"Familia", questions:[
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name:"Social", questions:[
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas a la tuya?",
    "¿Actuás con empatía en espacios públicos?"
  ]},
  { name:"Amistad", questions:[
    "¿Estás presente para tus amistades?",
    "¿Sos leal incluso cuando no estás de acuerdo?",
    "¿Escuchás sin imponer tu visión?"
  ]},
  { name:"Laboral", questions:[
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name:"Planeta", questions:[
    "¿Respetás a los animales como seres vivos?",
    "¿Cuidás el entorno donde vivís?",
    "¿Reducís tu impacto ambiental cuando podés?"
  ]}
];

const PREMIUM_MODULES = [
  { name:"Conciencia", questions:[
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

function startTest(isPremium){
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if(mode === "premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m => scores[m.name] = 0);
  currentModule = 0;
  currentQuestion = 0;

  showSection("test");
  showQuestion();
  updateThermometer();
}

function showQuestion(){
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(val){
  const mod = modules[currentModule];
  scores[mod.name] += val;
  currentQuestion++;

  if(currentQuestion >= mod.questions.length){
    currentQuestion = 0;
    currentModule++;
  }

  if(currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

function showResults(){
  showSection("results");
  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let percents = [];
  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    percents.push({ area:m.name, value:percent });
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + global + "%";

  const coherence = 100 - (Math.max(...percents.map(p=>p.value)) - Math.min(...percents.map(p=>p.value)));
  document.getElementById("coherenceResult").innerText = "Coherencia humana: " + coherence + "%";

  renderTips(global, percents);
}

function renderTips(global, percents){
  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  if(mode === "common"){
    tips.innerHTML = `<li>Este resultado refleja una visión general de tu humanidad actual.
    Usalo como referencia simbólica para observar tu coherencia cotidiana.</li>`;
    return;
  }

  if(global >= 99){
    tips.innerHTML = `<li>Estás transitando un estado de coherencia humana elevada.
    Tu presencia, tus vínculos y tus decisiones muestran alineación consciente.</li>`;
    return;
  }

  percents.filter(p => p.value < 100).forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `En <strong>${p.area}</strong>, tus respuestas indican un espacio de evolución.
    Revisar cómo habitás ese ámbito puede ayudarte a crecer en coherencia y presencia.`;
    tips.appendChild(li);
  });
}

function updateThermometer(){
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  document.getElementById("thermoFill").style.width = Math.round((answered/totalQ)*100) + "%";
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
