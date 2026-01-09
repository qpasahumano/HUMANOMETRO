let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let weeklyScore = [];

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
  { name:"Conciencia Profunda", questions:[
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

const COUPLE_WEEKLY = [
  "¿Escuchás a tu pareja sin preparar tu respuesta?",
  "¿Sos coherente entre lo que decís y hacés con tu pareja?",
  "¿Cuidás el vínculo incluso en momentos de tensión?"
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
  areaTitle.innerText = mod.name;
  questionText.innerText = mod.questions[currentQuestion];
}

function answer(v){
  const mod = modules[currentModule];
  scores[mod.name]+=v;
  currentQuestion++;
  if(currentQuestion>=mod.questions.length){
    currentQuestion=0;
    currentModule++;
  }
  currentModule>=modules.length ? showResults() : (showQuestion(),updateThermometer());
}

function showResults(){
  showSection("results");
  circles.innerHTML="";
  tips.innerHTML="";
  let total=0;

  modules.forEach(m=>{
    const max=m.questions.length*2;
    const pct=Math.round((scores[m.name]/max)*100);
    total+=pct;
    circles.innerHTML+=
      `<div class="circle ${pct<40?"low":pct<70?"mid":"high"}">
        <strong>${pct}%</strong><small>${m.name}</small>
      </div>`;
    if(mode==="premium"){
      tips.innerHTML+=`<li>${premiumText(m.name,pct)}</li>`;
    }
  });

  const avg=Math.round(total/modules.length);
  globalResult.innerText="Humanidad global: "+avg+"%";

  if(mode==="common"){
    tips.innerHTML+=`<li>Nivel de coherencia humana: ${avg<40?"Bajo":avg<70?"Medio":"Alto"}</li>`;
  }

  if(mode==="premium"){
    tips.innerHTML+=`<li>Evaluación integral basada en coherencia sostenida.</li>`;
    results.innerHTML+=
      `<button class="premium" onclick="startWeeklyReview()">Desbloquear revisión semanal</button>`;
  }
}

function premiumText(area,p){
  const t={
    low:[`En ${area}, hay desconexión interna.`],
    mid:[`En ${area}, la coherencia es parcial.`],
    high:[`En ${area}, hay presencia y coherencia.`]
  };
  return (p<40?t.low:p<70?t.mid:t.high)[0];
}

function updateThermometer(){
  const totalQ=modules.reduce((s,m)=>s+m.questions.length,0);
  const answered=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  thermoFill.style.width=Math.round((answered/totalQ)*100)+"%";
}

function startWeeklyReview(){
  weeklyScore=[];
  weeklyBox.innerHTML="<h3>Revisión semanal de pareja</h3>";
  COUPLE_WEEKLY.forEach((q,i)=>{
    weeklyBox.innerHTML+=`
      <p>${q}</p>
      <div class="answers">
        <button onclick="weeklyAnswer(${i},2)">Sí</button>
        <button onclick="weeklyAnswer(${i},1)">A veces</button>
        <button onclick="weeklyAnswer(${i},0)">No</button>
      </div>`;
  });
}

function weeklyAnswer(i,v){
  weeklyScore[i]=v;
  if(weeklyScore.filter(x=>x!==undefined).length===COUPLE_WEEKLY.length){
    const avg=weeklyScore.reduce((a,b)=>a+b,0)/COUPLE_WEEKLY.length;
    weeklyBox.innerHTML+=`<p>Nivel de humanidad en pareja: ${avg<0.8?"Bajo":avg<1.5?"Medio":"Alto"}</p>`;
  }
}

function restart(){showSection("start")}
function showPrivacy(){showSection("privacy")}
function showSection(id){
  ["start","test","results","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* PWA */
let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  installBtn.style.display="block";
});
installBtn?.addEventListener("click",()=>deferredPrompt?.prompt());
