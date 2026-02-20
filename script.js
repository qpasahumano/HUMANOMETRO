/* ===============================
REFERENCIAS DOM
================================ */

const areaTitle = document.getElementById("areaTitle");
const questionText = document.getElementById("questionText");
const questionNote = document.getElementById("questionNote");
const thermoFill = document.getElementById("thermoFill");
const circles = document.getElementById("circles");
const tips = document.getElementById("tips");
const globalResult = document.getElementById("globalResult");
const weeklyAccess = document.getElementById("weeklyAccess");
const weeklyQuestion = document.getElementById("weeklyQuestion");
const weeklyThermoFill = document.getElementById("weeklyThermoFill");
const weeklyText = document.getElementById("weeklyText");
const weeklyAdvice = document.getElementById("weeklyAdvice");

/* ===============================
VARIABLES PRINCIPALES
================================ */

let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

let weeklyIndex = 0;
let weeklyScores = [];

/* ===============================
PREGUNTAS SEMANALES (3)
================================ */

const WEEKLY_QUESTIONS = [
"Cuando viviste alguna incomodidad o tensión emocional esta semana con algún vínculo cercano, ¿pudiste observar tu reacción antes de actuar?",
"Ante diferencias o tensiones con alguna persona esta semana, ¿intentaste comprender lo que el otro podía estar sintiendo?",
"Frente a emociones densas surgidas en la semana con algún vínculo, ¿lograste soltarlas sin quedarte atrapado en ellas?"
];

/* ===============================
MÓDULOS BASE (SIN PREMIUM)
================================ */

const BASE_MODULES = [
{ name: "Familia", questions: [
{ q: "¿Estuviste emocionalmente presente con tu familia?", n: "Aquí se mide presencia, no perfección." },
{ q: "¿Escuchaste sin juzgar?", n: "Se mide apertura." },
{ q: "¿Expresaste afecto sin que te lo pidan?", n: "Se mide intención." }
]},
{ name: "Social", questions: [
{ q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
{ q: "¿Escuchaste opiniones distintas a la tuya?", n: "Se mide tolerancia." },
{ q: "¿Actuaste con empatía en espacios públicos?", n: "Conciencia social." }
]},
{ name: "Amistad", questions: [
{ q: "¿Estuviste presente para tus amistades?", n: "Presencia real." },
{ q: "¿Cuidaste el vínculo aun sin coincidir?", n: "Cuidado del lazo." },
{ q: "¿Escuchaste sin imponer tu visión?", n: "Respeto mutuo." }
]},
{ name: "Laboral", questions: [
{ q: "¿Generaste buen clima laboral aun sin estar cómodo?", n: "Responsabilidad humana." },
{ q: "¿Respetaste a tus compañeros?", n: "Trato consciente." },
{ q: "¿Evitaste sobrecargar a otros?", n: "Conciencia colectiva." }
]},
{ name: "Planeta", questions: [
{ q: "¿Reconociste a los animales como seres sensibles?", n: "Empatía." },
{ q: "¿Cuidaste el entorno donde vivís?", n: "Conciencia cotidiana." },
{ q: "¿Reduciste tu impacto cuando estuvo a tu alcance?", n: "Intención posible." }
]}
];

/* ===============================
INICIO TEST
================================ */

function startTest(){
modules = JSON.parse(JSON.stringify(BASE_MODULES));
scores = {};
modules.forEach(m => scores[m.name] = 0);
currentModule = 0;
currentQuestion = 0;
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
scores[modules[currentModule].name] += v;
currentQuestion++;
if(currentQuestion >= modules[currentModule].questions.length){
currentQuestion = 0;
currentModule++;
}
currentModule >= modules.length ? showResults() : showQuestion();
updateThermometer();
}

/* ===============================
RESULTADOS %
================================ */

function showResults(){
showSection("results");
circles.innerHTML = "";
tips.innerHTML = "";
weeklyAccess.innerHTML = "";

let total = 0;

modules.forEach(m=>{
const max = m.questions.length * 2;
const p = Math.round(scores[m.name] / max * 100);
total += p;

circles.innerHTML += `
<div class="circle ${p < 40 ? "low" : p < 70 ? "mid" : "high"}">
<strong>${p}%</strong>
<small>${m.name}</small>
</div>`;
});

const avg = Math.round(total / modules.length);
globalResult.innerText = "Humanidad global: " + avg + "%";
tips.innerHTML = `<li>${commonFeedback(avg)}</li>`;

weeklyAccess.innerHTML = `<button onclick="startWeekly()">Recorrido mensual</button>`;
}

function commonFeedback(avg){
if(avg < 40) return "Se observa una desconexión entre intención y acción. Reconocerlo abre un proceso de conciencia.";
if(avg < 70) return "Tu humanidad está presente, aunque con fluctuaciones. La observación consciente puede estabilizarla.";
return "Existe coherencia entre lo que sentís, pensás y hacés. Tu humanidad se expresa con claridad.";
}

/* ===============================
SEMANA (3 PREGUNTAS)
================================ */

function startWeekly(){
weeklyIndex = 0;
weeklyScores = [];
weeklyThermoFill.style.width = "0%";
showSection("weekly");
weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
}

function weeklyAnswer(value){
weeklyScores.push(value);
weeklyIndex++;
weeklyThermoFill.style.width = Math.round((weeklyScores.length/3)*100)+"%";
if(weeklyIndex >= 3){
showWeeklyResultScreen();
}else{
weeklyQuestion.innerText = WEEKLY_QUESTIONS[weeklyIndex];
}
}

function showWeeklyResultScreen(){
const avg = weeklyScores.reduce((a,b)=>a+b,0)/3;

if(avg < 0.8){
weeklyText.innerText = "Esta semana mostró una desconexión entre intención y acción.";
weeklyAdvice.innerText = "Observar tus reacciones sin juzgar puede ayudarte a recuperar coherencia.";
}else if(avg < 1.5){
weeklyText.innerText = "Tu humanidad estuvo presente, pero de forma fluctuante.";
weeklyAdvice.innerText = "Sostener la atención consciente puede estabilizar tu respuesta emocional.";
}else{
weeklyText.innerText = "Mostraste coherencia humana y presencia consciente esta semana.";
weeklyAdvice.innerText = "Continuar actuando desde la empatía refuerza tu equilibrio interno.";
}

showSection("weeklyResultScreen");
}

/* ===============================
NAVEGACIÓN
================================ */

function showPrivacy(){ showSection("privacy"); }

function restart(){ showSection("start"); }

function showSection(id){
["start","test","results","weekly","weeklyResultScreen","privacy"]
.forEach(s=>document.getElementById(s)?.classList.add("hidden"));
document.getElementById(id)?.classList.remove("hidden");
}

function updateThermometer(){
const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
const answered = modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)+currentQuestion;
thermoFill.style.width = Math.round((answered/totalQ)*100)+"%";
}
