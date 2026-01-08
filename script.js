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
  { name:"Laboral", questions:[
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name:"Planeta", questions:[
    "¿Cuidás el entorno?",
    "¿Respetás a los animales?",
    "¿Reducís tu impacto ambiental?"
  ]}
];

const PREMIUM_MODULES = [
  { name:"Conciencia", questions:[
    "¿Vivís desde el amor o el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Asumís el impacto de tus actos?"
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
  scores[mod.name]+=val;
  currentQuestion++;

  if(currentQuestion>=mod.questions.length){
    currentQuestion=0;
    currentModule++;
  }

  if(currentModule>=modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

function showResults(){
  showSection("results");

  const circles=document.getElementById("circles");
  circles.innerHTML="";
  const tips=document.getElementById("tips");
  tips.innerHTML="";

  let total=0;
  let details=[];

  modules.forEach(m=>{
    const max=m.questions.length*2;
    const percent=Math.round((scores[m.name]/max)*100);
    total+=percent;

    const div=document.createElement("div");
    div.className="circle "+(percent<40?"low":percent<70?"mid":"high");
    div.innerHTML=`<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if(percent<100){
      details.push(`${m.name}: podrías revisar cómo estás habitando este aspecto de tu vida.`);
    }
  });

  document.getElementById("globalResult").innerText =
    "Humanidad global: "+Math.round(total/modules.length)+"%";

  document.getElementById("coherenceResult").innerText =
    "Coherencia humana: "+(100-(Math.max(...Object.values(scores))-Math.min(...Object.values(scores))))+"%";

  if(details.length===0){
    tips.innerHTML="<li>Estás en un camino humano sólido y consciente.</li>";
  } else {
    details.forEach(d=>{
      const li=document.createElement("li");
      li.innerText=d;
      tips.appendChild(li);
    });
  }

  if(mode==="premium"){
    document.getElementById("weeklyBox").classList.remove("hidden");
  }
}

function weeklyAnswer(val){
  alert("Chequeo semanal registrado. Evolución observada.");
}

function updateThermometer(){
  const totalQ=modules.reduce((s,m)=>s+m.questions.length,0);
  const answered=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100)+"%";
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","privacy"].forEach(s=>{
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}
