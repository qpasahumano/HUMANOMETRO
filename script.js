let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

const BASE_MODULES = [
 {name:"Familia",questions:[
  "¿Estás emocionalmente presente con tu familia?",
  "¿Escuchás sin juzgar?",
  "¿Expresás afecto sin que te lo pidan?"
 ]},
 {name:"Social",questions:[
  "¿Tratás a las personas con respeto?",
  "¿Escuchás opiniones distintas a la tuya?",
  "¿Actuás con empatía en espacios públicos?"
 ]},
 {name:"Amistad",questions:[
  "¿Estás presente para tus amistades?",
  "¿Sos leal incluso cuando no estás de acuerdo?",
  "¿Escuchás sin imponer tu visión?"
 ]},
 {name:"Laboral",questions:[
  "¿Actuás con ética en tu trabajo?",
  "¿Respetás a tus compañeros?",
  "¿Sos justo cuando nadie te observa?"
 ]},
 {name:"Planeta",questions:[
  "¿Respetás a los animales como seres vivos?",
  "¿Cuidás el entorno donde vivís?",
  "¿Reducís tu impacto ambiental cuando podés?"
 ]}
];

const PREMIUM_MODULES = [
 {name:"Conciencia",questions:[
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
 document.body.className = mod.name.toLowerCase();
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
 document.body.className = "";

 const circles = document.getElementById("circles");
 circles.innerHTML = "";

 let total = 0;
 let details = [];

 modules.forEach(m=>{
  const max = m.questions.length * 2;
  const percent = Math.round((scores[m.name] / max) * 100);
  total += percent;

  const div = document.createElement("div");
  div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
  div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
  circles.appendChild(div);

  if(percent < 100) details.push({area:m.name, percent});
 });

 const global = Math.round(total / modules.length);
 document.getElementById("globalResult").innerText =
  "Humanidad global: " + global + "%";

 renderTips(global, details);
}

function renderTips(global, details){
 const tips = document.getElementById("tips");
 tips.innerHTML = "";

 if(details.length === 0){
  tips.innerHTML =
   "<li>Estás en un proceso humano coherente y consciente. Seguí por este camino.</li>";
  return;
 }

 const messages = {
  Familia: "tu resultado sugiere que podrías fortalecer la presencia emocional y la escucha en los vínculos familiares.",
  Social: "aparece la oportunidad de revisar cómo te vinculás con el entorno y con personas fuera de tu círculo cercano.",
  Amistad: "tal vez sea buen momento para observar cuánto espacio real le das a la lealtad y a la presencia con tus amistades.",
  Laboral: "los resultados indican que podrías reflexionar sobre coherencia, ética y trato cotidiano en el ámbito laboral.",
  Planeta: "surge la posibilidad de revisar tu relación con el entorno, el consumo y el respeto por otras formas de vida.",
  Conciencia: "este aspecto invita a profundizar la coherencia interna entre lo que sentís, pensás y hacés."
 };

 details.forEach(d=>{
  const li = document.createElement("li");
  li.innerHTML = `<strong>${d.area}:</strong> ${messages[d.area]}`;
  tips.appendChild(li);
 });
}

function updateThermometer(){
 const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
 const answered =
  modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
  + currentQuestion;

 document.getElementById("thermoFill").style.width =
  Math.round((answered / totalQ) * 100) + "%";
}

function restart(){
 document.body.className = "";
 showSection("start");
}

function showPrivacy(){
 showSection("privacy");
}

function showSection(id){
 ["start","test","results","privacy"].forEach(s =>
  document.getElementById(s).classList.add("hidden")
 );
 document.getElementById(id).classList.remove("hidden");
}
