let mode="common", currentModule=0, currentQuestion=0;
let modules=[], scores={}, weeklyScore=[], weeklyIndex=0;

const BASE_MODULES = [
 {name:"Familia",questions:[
  {q:"¿Estuviste emocionalmente presente con tu familia?",n:"Aquí se mide presencia, no cantidad de tiempo."},
  {q:"¿Escuchaste sin juzgar?",n:"No se evalúa acuerdo, se evalúa apertura."},
  {q:"¿Expresaste afecto de forma genuina?",n:"Se observa intención, no intensidad."}
 ]},
 {name:"Amistad",questions:[
  {q:"¿Estuviste disponible cuando alguien te necesitó?",n:"Se mide disponibilidad real."},
  {q:"¿Respetaste el vínculo aun pensando distinto?",n:"Aquí no se mide coincidencia, se mide cuidado del lazo."},
  {q:"¿Escuchaste sin imponer tu mirada?",n:"Se mide coherencia en la escucha."}
 ]},
 {name:"Laboral",questions:[
  {q:"¿Generaste un buen clima laboral incluso cuando no estabas cómodo?",n:"Se observa coherencia en situaciones reales."},
  {q:"¿Sobrecargaste con tu función a tus compañeros?",n:"Aquí se mide responsabilidad compartida."},
  {q:"¿Fuiste consciente del impacto de tus acciones en otros?",n:"No se juzga, se observa conciencia."}
 ]},
 {name:"Planeta",questions:[
  {q:"Ante una situación S.O.S con un animal, ¿accionarías?",n:"Se mide sensibilidad, no heroísmo."},
  {q:"¿Tomaste decisiones que cuidaron tu entorno inmediato?",n:"Aquí se mide intención concreta."},
  {q:"¿Reduciste tu impacto ambiental cuando estuvo a tu alcance?",n:"No se mide perfección."}
 ]}
];

const PREMIUM_MODULES=[{
 name:"Conciencia Profunda",questions:[
  {q:"¿Observaste tus reacciones antes de actuar?",n:"Se mide conciencia previa."},
  {q:"¿Pudiste alinear lo que sentías con lo que hiciste?",n:"Aquí se observa coherencia interna."},
  {q:"¿Asumiste responsabilidad emocional en tus vínculos?",n:"No se juzga, se observa madurez."}
 ]
}];

function startTest(p){
 mode=p?"premium":"common";
 modules=JSON.parse(JSON.stringify(BASE_MODULES));
 if(mode==="premium") modules=modules.concat(PREMIUM_MODULES);
 scores={}; modules.forEach(m=>scores[m.name]=0);
 currentModule=0; currentQuestion=0;
 showSection("test"); showQuestion(); updateThermometer();
}

function showQuestion(){
 const m=modules[currentModule];
 document.getElementById("areaTitle").innerText=m.name;
 document.getElementById("questionText").innerText=m.questions[currentQuestion].q;
 document.getElementById("questionNote").innerText=m.questions[currentQuestion].n;
}

function answer(v){
 scores[modules[currentModule].name]+=v;
 currentQuestion++;
 if(currentQuestion>=modules[currentModule].questions.length){
  currentQuestion=0; currentModule++;
 }
 currentModule>=modules.length?showResults():(showQuestion(),updateThermometer());
}

function showResults(){
 showSection("results");
 const tips=document.getElementById("tips");
 tips.innerHTML="";
 let total=0;

 modules.forEach(m=>{
  const max=m.questions.length*2;
  const pct=Math.round(scores[m.name]/max*100);
  total+=pct;
  if(mode==="premium"){
   tips.innerHTML+=`<li>En ${m.name}, ${pct<40?"hay desconexión. Prestá más atención a tus reacciones.":pct<70?"hay fluctuaciones. Podrías sostener más intención.":"hay coherencia activa. Continuá cultivándola."}</li>`;
  }
 });

 const avg=Math.round(total/modules.length);
 document.getElementById("globalResult").innerText="Humanidad global: "+avg+"%";

 if(mode==="common"){
  tips.innerHTML+=`<li>${avg<40?"Predomina la reacción automática. Observarte es el primer paso.":avg<70?"Hay conciencia intermitente. Podés fortalecerla con intención.":"Hay coherencia sostenida. Seguí así."}</li>`;
 }

 if(mode==="premium"){
  tips.innerHTML+=`<li class="legal">Con este medidor podés medir semana a semana tu nivel de conciencia humana, en el amor (pareja), en el trabajo, en lo social y en general. Actualizá tu consciencia.</li>`;
 }
}

function updateThermometer(){
 const totalQ=modules.reduce((s,m)=>s+m.questions.length,0);
 const answered=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
 document.getElementById("thermoFill").style.width=Math.round(answered/totalQ*100)+"%";
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
 ["start","test","results","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
 document.getElementById(id).classList.remove("hidden");
}
