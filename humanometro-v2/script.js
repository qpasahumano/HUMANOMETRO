const $ = id => document.getElementById(id);

/* CACHE */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");
const thermoFill = $("thermoFill");
const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const monthlyFill = $("monthlyFill");
const monthlyText = $("monthlyText");
const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");
const finalFill = $("finalFill");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

/* DATOS */
const WEEKS = [
{ title:"Vos ante el mundo", questions:[
["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
["¿Sentís impulso de involucrarte ante injusticias?","Compromiso humano"],
["¿Te afecta el sufrimiento ajeno?","Sensibilidad emocional"]
]},
{ title:"Vos y la tecnología", questions:[
["¿Podés soltar el celular al compartir?","Uso consciente"],
["¿Controlás el tiempo en pantallas?","Autocontrol digital"],
["¿Recordás que hay personas reales detrás de una pantalla?","Empatía digital"],
["¿La tecnología acompaña sin absorberte?","Equilibrio tecnológico"]
]},
{ title:"Integración humana", questions:[
["¿Hay coherencia entre lo que pensás y hacés?","Coherencia"],
["¿Podés observarte sin juzgarte?","Autoconciencia"],
["¿Asumís tu impacto en otros?","Responsabilidad"],
["¿Sentís evolución humana?","Integración"]
]}
];

const MIRROR_QUESTIONS = [
"¿Cuánto enojo sentís internamente?",
"¿Cuánta tristeza aparece en vos?",
"¿Cuánto miedo sentís antes de actuar?",
"¿Cuánta culpa aparece después?",
"¿Cuánta ansiedad sentís?",
"¿Cuánta desconexión emocional sentís?",
"¿Cuánta alegría genuina sentís?",
"¿Cuánto evitás sentir emociones incómodas?"
];

const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍🌫️","😊","🫥"];

let week = 0, q = 0, score = 0;
let mirrorIndex = 0, mirrorScore = 0, mirrorCount = 0;

/* FLUJO */

function startV2(){
week = 0; q = 0; score = 0;
show("test");
loadQuestion();
}

function loadQuestion(){
const w = WEEKS[week];
weekTitle.textContent = w.title;
questionText.textContent = w.questions[q][0];
questionMeasure.textContent = w.questions[q][1];
thermoFill.style.width = (q/4)*100 + "%";
}

function answer(v){
score += v;
q++;
q >= 4 ? showWeekly() : loadQuestion();
}

function showWeekly(){
show("weeklyResult");
const avg = score / 4;
weeklySymbol.textContent = avg < 1.5 ? "🦇" : "🐦";
weeklyText.textContent = avg < 1.5 ? "Humanidad inestable." : "Humanidad presente.";
weeklyAdvice.textContent = "";
}

function nextWeek(){
week++;
q = 0;
score = 0;
week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

function showMonthly(){
show("monthlyResult");
monthlyText.textContent = "Recorrido mensual completado.";
}

function openMirror(){
show("mirrorIntro");
}

function startMirror(){
mirrorIndex = 0;
mirrorScore = 0;
mirrorCount = 0;
show("mirrorTest");
loadMirror();
}

function loadMirror(){
mirrorEmoji.textContent = MIRROR_EMOJIS[mirrorIndex];
mirrorQuestion.textContent = MIRROR_QUESTIONS[mirrorIndex];
}

function answerMirror(v){
if(v !== null){ mirrorScore += v; mirrorCount++; }
mirrorIndex++;
mirrorIndex >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

function showFinal(){
show("finalResult");
const avg = mirrorCount ? mirrorScore / mirrorCount : 0;
finalState.textContent = avg < 1 ? "Baja implicación" : "Alta implicación";
finalHumanText.textContent = "Resultado mensual reflejado.";
}

/* UTIL */

function show(id){
["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
.forEach(s => $(s)?.classList.add("hidden"));
$(id)?.classList.remove("hidden");
}
