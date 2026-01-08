let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

const BASE_MODULES = [
  { name: "Familia", key:"familia", questions:[
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name: "Social", key:"social", questions:[
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas a la tuya?",
    "¿Actuás con empatía en espacios públicos?"
  ]},
  { name: "Amistad", key:"amistad", questions:[
    "¿Estás presente para tus amistades?",
    "¿Sos leal incluso cuando no estás de acuerdo?",
    "¿Escuchás sin imponer tu visión?"
  ]},
  { name: "Laboral", key:"laboral", questions:[
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name: "Planeta", key:"planeta", questions:[
    "¿Respetás a los animales como seres vivos?",
    "¿Cuidás el entorno donde vivís?",
    "¿Reducís tu impacto ambiental cuando podés?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", key:"conciencia", questions:[
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

function startTest(isPremium){
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if(mode==="premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m=>scores[m.name]=0);

  currentModule=0;
  currentQuestion=0;

  setBackground();
  showSection("test");
  showQuestion();
  updateThermometer();
}

function setBackground(){
  document.body.className = modules[currentModule]?.key || "start-bg";
}

function showQuestion(){
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
  setBackground();
}

function answer(value){
  const mod = modules[currentModule];
  scores[mod.name]+=value;
  currentQuestion++;

  if(currentQuestion>=mod.questions.length){
    currentQuestion=0;
    currentModule++;
  }

  if(currentModule>=modules.length) showResults();
  else{
    showQuestion();
    updateThermometer();
  }
}

function showResults(){
  document.body.className="start-bg";
  showSection("results");

  const circles=document.getElementById("circles");
  circles.innerHTML="";
  let total=0;
  let percents=[];

  modules.forEach(m=>{
    const max=m.questions.length*2;
    const percent=Math.round((scores[m.name]/max)*100);
    percents.push(percent);
    total+=percent;

    const div=document.createElement("div");
    div.className="circle "+(percent<40?"low":percent<70?"mid":"high");
    div.innerHTML=`<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const global=Math.round(total/modules.length);
  document.getElementById("globalResult").innerText=`Humanidad global: ${global}%`;

  const coherence=100-(Math.max(...percents)-Math.min(...percents));
  document.getElementById("coherenceResult").innerText=`Coherencia humana: ${coherence}%`;

  renderTips(global, percents);
}

function renderTips(global, percents){
  const tips=document.getElementById("tips");
  tips.innerHTML="";

  if(global>=99){
    tips.innerHTML="<li>Estás en el buen camino. Continuá sosteniendo esta coherencia humana.</li>";
    return;
  }

  const affected=[];
  percents.forEach((p,i)=>{ if(p<100) affected.push(modules[i].name); });

  tips.innerHTML=`<li>Prestá mayor atención a las áreas: <strong>${affected.join(", ")}</strong>.</li>`;
}

function updateThermometer(){
  const totalQ=modules.reduce((s,m)=>s+m.questions.length,0);
  const answered=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  document.getElementById("thermoFill").style.width=Math.round((answered/totalQ)*100)+"%";
}

function restart(){
  document.body.className="start-bg";
  showSection("start");
}

function showPrivacy(){
  document.body.className="start-bg";
  showSection("privacy");
}

function showSection(id){
  ["start","test","results","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
      }
