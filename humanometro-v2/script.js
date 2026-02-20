const $ = id => document.getElementById(id);

/* ===============================
DATOS BASE
================================ */

const WEEKS = [
{
title:"Vos ante el mundo",
questions:[
["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
["¿Sentís impulso de involucrarte ante injusticias?","Compromiso humano"],
["¿Te afecta el sufrimiento ajeno?","Sensibilidad emocional"]
]},
{
title:"Vos y la tecnología",
questions:[
["¿Podés soltar el celular al compartir?","Uso consciente"],
["¿Controlás el tiempo en pantallas?","Autocontrol digital"],
["¿Recordás que hay personas reales detrás de una pantalla?","Empatía digital"],
["¿La tecnología acompaña sin absorberte?","Equilibrio tecnológico"]
]},
{
title:"Integración humana",
questions:[
["¿Hay coherencia entre lo que pensás y hacés?","Coherencia"],
["¿Podés observarte sin juzgarte?","Autoconciencia"],
["¿Asumís tu impacto en otros?","Responsabilidad"],
["¿Sentís evolución humana?","Integración"]
]}
];

const MIRROR_QUESTIONS = [
{ t:"Cuando algo en la calle, en una conversación o en una situación cotidiana no sale como esperabas, ¿cuánto enojo sentís internamente, más allá de lo que muestres hacia afuera?" },
{ t:"Cuando te enterás de una situación difícil, injusta o dolorosa —ya sea propia o ajena—, ¿cuánta tristeza aparece en vos de forma real, aunque no la expreses?" },
{ t:"Cuando tenés que tomar una decisión importante o enfrentar una situación incierta, ¿cuánto miedo sentís antes de actuar, incluso si seguís avanzando igual?" },
{ t:"Cuando recordás algo que dijiste, hiciste o dejaste de hacer, ¿cuánta culpa aparece después, aunque intentes justificarte o seguir adelante?" },
{ t:"Cuando se acumulan responsabilidades, demandas externas o presiones internas, ¿cuánta ansiedad sentís en tu cuerpo o en tu mente, aunque continúes funcionando?" },
{ t:"Cuando estás con personas importantes para vos, ¿cuánta desconexión emocional sentís, aun estando físicamente presente?" },
{ t:"Cuando vivís un momento simple, sin exigencias ni expectativas, ¿cuánta alegría genuina sentís, sin necesidad de estímulos externos?" },
{ t:"Cuando aparece una emoción incómoda que no sabés nombrar del todo, ¿cuánto tendés a evitarla, minimizarla o distraerte para no sentirla?" }
];

/* ===============================
ESTADO
================================ */

let week = 0;
let q = 0;
let currentScore = 0;
let weeklyScores = [];
let allAnswers = [];
let mq = 0;
let mirrorScore = 0;
let mirrorCount = 0;
let mirrorLog = [];

/* ===============================
FLUJO PRINCIPAL
================================ */

function startV2(){
week = 0;
q = 0;
currentScore = 0;
weeklyScores = [];
allAnswers = [];
mirrorLog = [];
show("test");
loadQuestion();
}

function loadQuestion(){
const w = WEEKS[week];
$("weekTitle").textContent = w.title;
$("questionText").textContent = w.questions[q][0];
$("questionMeasure").textContent = w.questions[q][1];
$("thermoFill").style.width = (q/4)*100 + "%";
}

function answer(v){
currentScore += v;
allAnswers.push({ block: WEEKS[week].title, q, v });
q++;
q >= 4 ? showWeekly() : loadQuestion();
}

/* ===============================
DEVOLUCIONES SEMANALES ORIGINALES
================================ */

function showWeekly(){
show("weeklyResult");
$("weeklyTextWrap").classList.add("hidden");

const avg = currentScore / 4;
weeklyScores.push(avg);

const block = WEEKS[week].title;

/* --- devoluciones completas intactas --- */

if(block === "Vos ante el mundo"){
if(avg < 1.5){
$("weeklyText").textContent =
"Lo que ocurre en el mundo no siempre logra atravesarte.\n\n"+
"El dolor ajeno, las injusticias o los conflictos pueden aparecer "+
"como información lejana, sin generar un impacto emocional sostenido.\n\n"+
"Esto no habla de falta de humanidad, sino de posibles mecanismos "+
"de defensa, cansancio o saturación emocional.";
$("weeklyAdvice").textContent =
"Observar cuándo te cerrás y cuándo te abrís al otro "+
"puede ser el primer gesto de reconexión humana.";
}
else{
$("weeklyText").textContent =
"El mundo no pasa desapercibido.\n\n"+
"Hay registro del dolor, de la injusticia y de lo que afecta "+
"a otros seres humanos.";
$("weeklyAdvice").textContent =
"Sostener esta sensibilidad sin que te abrume "+
"es parte de un equilibrio humano maduro.";
}
}

if(block === "Vos y la tecnología"){
if(avg < 1.5){
$("weeklyText").textContent =
"La atención aparece fragmentada.\n\n"+
"La tecnología tiende a absorber momentos que podrían "+
"ser habitados con mayor presencia.\n\n"+
"No como error, sino como hábito automatizado.";
$("weeklyAdvice").textContent =
"Pequeños cortes conscientes pueden devolver densidad "+
"a la experiencia cotidiana.";
}
else{
$("weeklyText").textContent =
"Lo digital acompaña sin dominar.\n\n"+
"Hay uso consciente y registro del presente.";
$("weeklyAdvice").textContent =
"Este equilibrio sostiene vínculos más reales "+
"y una experiencia más encarnada.";
}
}

if(block === "Integración humana"){
if(avg < 1.5){
$("weeklyText").textContent =
"Se perciben fisuras entre pensamiento, emoción y acción.\n\n"+
"No siempre lo que sentís logra expresarse "+
"ni lo que pensás logra sostenerse en el hacer.";
$("weeklyAdvice").textContent =
"Nombrar estas incongruencias no es debilidad: "+
"es el inicio del proceso de integración.";
}
else{
$("weeklyText").textContent =
"Las respuestas muestran una percepción de coherencia interna.\n\n"+
"Esta lectura se limita a cómo te pensás y te observás a vos mismo.\n\n"+
"Cómo esta coherencia se expresa en el vínculo con el mundo y la tecnología\n"+
"se observa en el siguiente tramo.";
$("weeklyAdvice").textContent = "";
}
}

setTimeout(()=>$("weeklyTextWrap").classList.remove("hidden"),800);
}

function nextWeek(){
week++;
q = 0;
currentScore = 0;
week >= WEEKS.length ? show("monthlyResult") : (show("test"), loadQuestion());
}

/* ===============================
ESPEJO + DEVOLUCIÓN FINAL
================================ */

function openMirror(){ show("mirrorIntro"); }

function startMirror(){
mq = 0;
mirrorScore = 0;
mirrorCount = 0;
mirrorLog = [];
show("mirrorTest");
loadMirror();
}

function loadMirror(){
$("mirrorQuestion").textContent = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
mirrorLog.push(v ?? 0);
if(v !== null){
mirrorScore += v;
mirrorCount++;
}
mq++;

if(mq >= MIRROR_QUESTIONS.length){
showFinal();
}else{
loadMirror();
}
}

function showFinal(){
show("finalResult");
/* devoluciones finales intactas */
setTimeout(()=>{$("finalTextWrap").classList.remove("hidden");},800);
}

/* ===============================
UTIL
================================ */

function show(id){
["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
.forEach(s => $(s)?.classList.add("hidden"));
$(id)?.classList.remove("hidden");
}

/* ===============================
SISTEMA BLOQUEO V2
================================ */

const HM_DURATION = 7*24*60*60*1000;

function activateBlock3(){
let c = JSON.parse(localStorage.getItem("hm_cycle")||"null");
if(!c || c.stage!==2){alert("Orden incorrecto.");return;}
if(allAnswers.length!==12){alert("Debes completar exactamente 12 preguntas.");return;}
if(c.b3 && (Date.now()-c.b3)<HM_DURATION){alert("Debes esperar 7 días.");return;}
c.stage=3;
c.b3=Date.now();
localStorage.setItem("hm_cycle",JSON.stringify(c));
openMirror();
}

const originalShowFinal = showFinal;
showFinal = function(){
originalShowFinal();
setTimeout(()=>{localStorage.removeItem("hm_cycle");},1000);
};
