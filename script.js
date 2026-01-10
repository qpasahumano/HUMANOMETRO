let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* CONTEO SEMANAL */
let weeklyIndex = 0;
let weeklyScores = [];
const WEEKLY_QUESTIONS = [
  "¿Tuviste algún conflicto emocional significativo esta semana?",
  "Si lo tuviste, ¿intentaste comprender al otro más allá de tu reacción?",
  "¿Pudiste soltar la carga emocional generada por esa situación?"
];

const BASE_MODULES = [ /* (idéntico al que ya tenías, sin cambios) */ 
  { name:"Familia", questions:[
    { q:"¿Estuviste emocionalmente presente con tu familia?", n:"Aquí se mide presencia, no perfección." },
    { q:"¿Escuchaste sin juzgar?", n:"No se mide acuerdo, se mide apertura." },
    { q:"¿Expresaste afecto sin que te lo pidan?", n:"Se observa intención genuina." }
  ]},
  { name:"Social", questions:[
    { q:"¿Trataste a las personas con respeto?", n:"Se mide trato humano." },
    { q:"¿Escuchaste opiniones distintas a la tuya?", n:"No se juzga la idea, se mide tolerancia." },
    { q:"¿Actuaste con empatía en espacios públicos?", n:"Se observa conciencia social." }
  ]},
  { name:"Amistad", questions:[
    { q:"¿Estuviste presente para tus amistades?", n:"Presencia real, no disponibilidad constante." },
    { q:"¿Cuidaste el vínculo aun cuando pensaban distinto?", n:"Se mide cuidado del lazo." },
    { q:"¿Escuchaste sin imponer tu visión?", n:"Respeto mutuo." }
  ]},
  { name:"Laboral", questions:[
    { q:"¿Generaste buen clima laboral aun cuando no estabas cómodo?", n:"Responsabilidad humana." },
    { q:"¿Respetaste a tus compañeros?", n:"Trato consciente." },
    { q:"¿Evitaste sobrecargar a otros con tu función?", n:"Conciencia colectiva." }
  ]},
  { name:"Planeta", questions:[
    { q:"¿Reconociste a los animales como seres sensibles?", n:"Empatía." },
    { q:"¿Cuidaste el entorno inmediato donde vivís?", n:"Conciencia cotidiana." },
    { q:"¿Reduciste tu impacto ambiental cuando estuvo a tu alcance?", n:"Intención posible." }
  ]}
];

const PREMIUM_MODULES = [
  { name:"Conciencia Profunda", questions:[
    { q:"¿Tomaste decisiones desde la conciencia?", n:"Atención interna." },
    { q:"¿Fuiste coherente entre pensamiento y acción?", n:"Alineación." },
    { q:"¿Asumiste responsabilidad por tu impacto?", n:"Madurez emocional." }
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
  const m = modules[currentModule];
  areaTitle.innerText = m.name;
  questionText.innerText = m.questions[currentQuestion].q;
  questionNote.innerText = m.questions[currentQuestion].n;
}

function answer(v){
  scores[modules[currentModule].name]+=v;
  currentQuestion++;
  if(currentQuestion>=modules[currentModule].questions.length){
    currentQuestion=0;
    currentModule++;
  }
  currentModule>=modules.length ? showResults() : showQuestion(), updateThermometer();
}

function showResults(){
  showSection("results");
  circles.innerHTML="";
  tips.innerHTML="";
  weeklyAccess.innerHTML="";
  let total=0;

  modules.forEach(m=>{
    const max=m.questions.length*2;
    const p=Math.round(scores[m.name]/max*100);
    total+=p;
    circles.innerHTML+=`<div class="circle ${p<40?"low":p<70?"mid":"high"}"><strong>${p}%</strong><small>${m.name}</small></div>`;
    if(mode==="premium"){
      tips.innerHTML+=`<li>${p<40?"Desconexión interna.":p<70?"Intención inestable.":"Coherencia presente."} En ${m.name}.</li>`;
    }
  });

  globalResult.innerText="Humanidad global: "+Math.round(total/modules.length)+"%";

  if(mode==="premium"){
    weeklyAccess.innerHTML=`
      <button class="premium" onclick="startWeekly()">Conteo semanal</button>
      <p class="legal">Medí tu conciencia humana semana a semana a partir de tus vivencias reales.</p>`;
  }
}

function startWeekly(){
  weeklyIndex=0;
  weeklyScores=[];
  showSection("weekly");
  weeklyQuestion.innerText=WEEKLY_QUESTIONS[0];
}

function weeklyAnswer(v){
  weeklyScores.push(v);
  weeklyIndex++;
  if(weeklyIndex>=WEEKLY_QUESTIONS.length){
    showSection("results");
    tips.innerHTML+=`<li><strong>Conteo semanal registrado.</strong></li>`;
    tips.innerHTML+=`<button class="premium" onclick="restart()">Guardar conteo semanal</button>`;
  } else {
    weeklyQuestion.innerText=WEEKLY_QUESTIONS[weeklyIndex];
  }
}

function updateThermometer(){
  const totalQ=modules.reduce((s,m)=>s+m.questions.length,0);
  const answered=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
  thermoFill.style.width=Math.round((answered/totalQ)*100)+"%";
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","weekly","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
    }
