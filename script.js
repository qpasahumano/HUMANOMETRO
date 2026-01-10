let mode="common";
let currentModule=0,currentQuestion=0;
let modules=[],scores={};

let weeklyIndex=0;
let weeklyScores=[];
const WEEKLY_QUESTIONS=[
 "¿Tuviste algún conflicto con tu pareja esta semana?",
 "Si lo hubo, ¿intentaste comprender lo que sentía la otra persona?",
 "¿Pudiste soltar el enojo o quedó rencor?"
];

const BASE_MODULES=[
 {name:"Familia",questions:[
  {q:"¿Estuviste emocionalmente presente con tu familia?",n:"Se mide presencia, no perfección."},
  {q:"¿Escuchaste sin juzgar?",n:"Se mide apertura."},
  {q:"¿Expresaste afecto sin que te lo pidan?",n:"Se observa intención."}
 ]},
 {name:"Social",questions:[
  {q:"¿Trataste a las personas con respeto?",n:"Se mide trato humano."},
  {q:"¿Escuchaste opiniones distintas a la tuya?",n:"Se mide tolerancia."},
  {q:"¿Actuaste con empatía en espacios públicos?",n:"Se mide conciencia social."}
 ]},
 {name:"Amistad",questions:[
  {q:"¿Estuviste presente para tus amistades?",n:"Presencia real."},
  {q:"¿Cuidaste el vínculo incluso cuando pensaban distinto?",n:"Se mide cuidado del lazo."},
  {q:"¿Escuchaste sin imponer tu visión?",n:"Respeto mutuo."}
 ]},
 {name:"Laboral",questions:[
  {q:"¿Generaste buen clima laboral aun sin estar cómodo?",n:"Responsabilidad humana."},
  {q:"¿Respetaste a tus compañeros?",n:"Trato consciente."},
  {q:"¿Sobrecargaste a otros con tu función?",n:"Conciencia colectiva."}
 ]},
 {name:"Planeta",questions:[
  {q:"¿Reconociste a los animales como seres sensibles?",n:"Empatía."},
  {q:"¿Cuidaste el entorno inmediato donde vivís?",n:"Conciencia cotidiana."},
  {q:"¿Reduciste tu impacto ambiental cuando fue posible?",n:"Intención posible."}
 ]}
];

const PREMIUM_MODULES=[
 {name:"Conciencia Profunda",questions:[
  {q:"¿Tomaste decisiones con conciencia?",n:"Atención interna."},
  {q:"¿Fuiste coherente entre pensamiento y acción?",n:"Alineación."},
  {q:"¿Asumiste responsabilidad por tu impacto?",n:"Madurez emocional."}
 ]}
];

function startTest(p){
 mode=p?"premium":"common";
 modules=JSON.parse(JSON.stringify(BASE_MODULES));
 if(p)modules=modules.concat(PREMIUM_MODULES);
 scores={};modules.forEach(m=>scores[m.name]=0);
 currentModule=0;currentQuestion=0;
 showSection("test");showQuestion();updateThermometer();
}

function showQuestion(){
 const m=modules[currentModule];
 areaTitle.innerText=m.name;
 questionText.innerText=m.questions[currentQuestion].q;
 questionNote.innerText=m.questions[currentQuestion].n;
}

function answer(v){
 scores[modules[currentModule].name]+=v;
 currentQuestion++;
 if(currentQuestion>=modules[currentModule].questions.length){
  currentQuestion=0;currentModule++;
 }
 currentModule>=modules.length?showResults():showQuestion(),updateThermometer();
}

function showResults(){
 showSection("results");
 circles.innerHTML="";tips.innerHTML="";
 let total=0;

 modules.forEach(m=>{
  let max=m.questions.length*2;
  let p=Math.round(scores[m.name]/max*100);
  total+=p;
  circles.innerHTML+=`<div class="circle ${p<40?"low":p<70?"mid":"high"}"><strong>${p}%</strong><small>${m.name}</small></div>`;

  if(mode==="premium"){
   tips.innerHTML+=`<li><strong>${m.name}:</strong> ${
    p<40
     ?"Hay desconexión entre intención y acción. Observarte sin juzgar puede ser el primer paso para sanar este aspecto."
     :p<70
      ?"Hay intención, pero aún inestable. Prestar más atención consciente puede ayudarte a equilibrar este área."
      :"Hay coherencia y presencia. Sostener este nivel fortalece tu humanidad."
   }</li>`;
  }
 });

 let avg=Math.round(total/modules.length);
 globalResult.innerText="Humanidad global: "+avg+"%";

 if(mode==="common"){
  tips.innerHTML+=`<li>${
    avg<40
     ?"Se observa una carencia de coherencia general. Tal vez sea momento de revisar dónde se pierde la intención y volver a habitarte con más presencia."
     :avg<70
      ?"Tu humanidad está presente, aunque fluctúa. Podrías fortalecerla prestando más atención a tus reacciones cotidianas."
      :"Hay una coherencia humana estable. Continuar en este camino consciente puede profundizar tu equilibrio interno."
  }</li>`;
 }

 if(mode==="premium"){
  weeklyEntry.innerHTML=`<button class="premium" onclick="startWeekly()">Medidor semanal</button>
  <p class="legal">
    Con este medidor podés medir semana a semana tu nivel de conciencia humana,
    en el amor (pareja), en el trabajo, en lo social y en tu coherencia general.
    Actualizá tu consciencia.
  </p>`;
 }
}

function startWeekly(){
 weeklyIndex=0;weeklyScores=[];
 showSection("weekly");
 weeklyQuestion.innerText=WEEKLY_QUESTIONS[0];
}

function weeklyAnswer(v){
 weeklyScores.push(v);weeklyIndex++;
 if(weeklyIndex>=WEEKLY_QUESTIONS.length){
  let avg=weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  alert(
    avg<0.8
     ?"Tu nivel humano semanal muestra un descenso. Tal vez sea buen momento para observar qué situación te deshumanizó y darle atención."
     :avg<1.5
      ?"Tu nivel humano semanal es inestable. Podrías enfocarte en responder con más empatía ante las situaciones vividas."
      :"Tu nivel humano semanal está en ascenso. Seguí cultivando la conciencia en tus vínculos."
  );
  restart();
 } else {
  weeklyQuestion.innerText=WEEKLY_QUESTIONS[weeklyIndex];
 }
}

function updateThermometer(){
 let t=modules.reduce((s,m)=>s+m.questions.length,0);
 let a=modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
 thermoFill.style.width=Math.round(a/t*100)+"%";
}

function showSection(id){
 ["start","test","results","weekly","privacy"].forEach(s=>document.getElementById(s).classList.add("hidden"));
 document.getElementById(id).classList.remove("hidden");
}

function restart(){showSection("start");}
function showPrivacy(){showSection("privacy");}
