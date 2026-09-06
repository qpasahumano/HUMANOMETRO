const $ = id => document.getElementById(id);

/* ==========================================================================
   1. CONFIGURACIÓN Y TIEMPOS DE BLOQUEO
   ========================================================================== */
const DEV_MODE = false; // Cambiar a true si quieres probar todo el flujo sin esperar 7 días
const WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

function now(){ 
  return Date.now(); 
}

/* 
   Evalúa si transcurrieron 7 días desde que se completó una semana específica.
   Utiliza claves independientes por semana en localStorage.
*/
function pasoUnaSemana(semanaNum){
  if (DEV_MODE) return true;
  const last = localStorage.getItem(`hm_v2_semana_${semanaNum}_time`);
  if (!last) return true; 
  return (now() - Number(last)) >= WEEK_MS;
}

/* Guardado explícito de la fecha de cierre de cada bloque semanal */
function marcarSemanaCompletada(semanaNum){
  localStorage.setItem(`hm_v2_semana_${semanaNum}_time`, now());
}

/* ==========================================================================
   2. INTERFAZ Y EFECTOS DE BLOQUEO
   ========================================================================== */
function showWeeklyBlockFlash(){
  const d = document.createElement("div");
  d.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    pointer-events:none;
    font-size:1.35rem;
    color:#eaffff;
    background:
      radial-gradient(circle, rgba(180,255,255,.28), transparent 60%),
      rgba(6,18,40,.45);
    text-shadow:
      0 0 12px rgba(140,255,240,1),
      0 0 26px rgba(140,255,240,.85);
    z-index:9999;
    animation: blockFade 1.3s ease-out forwards;
  `;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 1300);
}

function show(sectionId){
  const sections = document.querySelectorAll("main > section");
  sections.forEach(s => s.classList.add("hidden"));
  if($(sectionId)) $(sectionId).classList.remove("hidden");
}

/* ==========================================================================
   3. REFERENCIAS A ELEMENTOS DEL DOM
   ========================================================================== */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");
const thermoFill = $("thermoFill");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const weeklyTextWrap = $("weeklyTextWrap");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");

const finalTextWrap = $("finalTextWrap");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

/* ==========================================================================
   4. ESTRUCTURA DE CUESTIONARIOS Y PREGUNTAS
   ========================================================================== */
const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍🌫️","😊","🫥"];

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
  { t:"Cuando algo en la calle, en una conversación o en una situación cotidiana no sale como esperabas, ¿cuánto enojo sentís internamente, más allá de lo que muestres hacia afuera?" },
  { t:"Cuando te enterás de una situación difícil, injusta o dolorosa —ya sea propia o ajena—, ¿cuánta tristeza aparece en vos de forma real, aunque no la expreses?" },
  { t:"Cuando tenés que tomar una decisión importante o enfrentar una situación incierta, ¿cuánto miedo sentís antes de actuar, incluso si seguís avanzando igual?" },
  { t:"Cuando recordás algo que dijiste, hiciste o dejaste de hacer, ¿cuánta culpa aparece después, aunque intentes justificarte o seguir adelante?" },
  { t:"Cuando se acumulan responsabilidades, demandas externas o presiones internas, ¿cuánta ansiedad sentís en tu cuerpo o en tu mente, aunque continúes funcionando?" },
  { t:"Cuando estás con personas importantes para vos, ¿cuánta desconexión emocional sentís, aun estando físicamente presente?" },
  { t:"Cuando vivís un momento simple, sin exigencias ni expectativas, ¿cuánta alegría genuina sentís, sin necesidad de estímulos externos?" },
  { t:"Cuando aparece una emoción incómoda que no sabés nombrar del todo, ¿cuánto tendés a evitarla, minimizarla o distraerte para no sentirla?" }
];

/* ==========================================================================
   5. VARIABLES DE ESTADO LOCAL
   ========================================================================== */
let week = 0, q = 0, currentScore = 0;
let weeklyScores = [], allAnswers = [], mirrorLog = [];
let mq = 0, mirrorScore = 0, mirrorCount = 0;

/* ==========================================================================
   6. FLUJO DEL TEST PRINCIPAL (SEMANAS 1 A 3)
   ========================================================================== */
function startV2(){
  document.body.classList.remove("mirror-bg");
  week = 0; q = 0; currentScore = 0;
  weeklyScores = []; allAnswers = []; mirrorLog = [];
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
  currentScore += v;
  allAnswers.push({ block: WEEKS[week].title, q, v });
  q++;
  q >= 4 ? showWeekly() : loadQuestion();
}

function showWeekly(){
  show("weeklyResult");
  weeklyTextWrap.classList.add("hidden");

  const avg = currentScore / 4;
  weeklyScores.push(avg);

  // Guardar la fecha en que se finalizó este bloque semanal
  marcarSemanaCompletada(week + 1);

  const range = avg <= 0.6 ? "low" : avg <= 0.9 ? "midLow" : avg <= 1.4 ? "mid" : "high";
  weeklySymbol.textContent = (range === "low" || range === "midLow") ? "🦇" : range === "mid" ? "🐞" : "🐦";

  const block = WEEKS[week].title;

  if(block === "Vos ante el mundo"){
    if(avg < 1.5){
      weeklyText.textContent = "Lo que ocurre en el mundo no siempre logra atravesarte.\n\nEl dolor ajeno, las injusticias o los conflictos pueden aparecer como información lejana, sin generar un impacto emocional sostenido.\n\nEsto no habla de falta de humanidad, sino de posibles mecanismos de defensa, cansancio o saturación emocional.";
      weeklyAdvice.textContent = "Observar cuándo te cerrás y cuándo te abrís al otro puede ser el primer gesto de reconexión humana.";
    } else {
      weeklyText.textContent = "El mundo no pasa desapercibido.\n\nHay registro del dolor, de la injusticia y de lo que afecta a otros seres humanos.";
      weeklyAdvice.textContent = "Sostener esta sensibilidad sin que te abrume es parte de un equilibrio humano maduro.";
    }
  }

  if(block === "Vos y la tecnología"){
    if(avg < 1.5){
      weeklyText.textContent = "La atención aparece fragmentada.\n\nLa tecnología tiende a absorber momentos que podrían ser habitados con mayor presencia.\n\nNo como error, sino como hábito automatizado.";
      weeklyAdvice.textContent = "Pequeños cortes conscientes pueden devolver densidad a la experiencia cotidiana.";
    } else {
      weeklyText.textContent = "Lo digital acompaña sin dominar.\n\nHay uso consciente y registro del presente.";
      weeklyAdvice.textContent = "Este equilibrio sostiene vínculos más reales y una experiencia más encarnada.";
    }
  }

  if(block === "Integración humana"){
    if(avg < 1.5){
      weeklyText.textContent = "Se perciben fisuras entre pensamiento, emoción y acción.\n\nNo siempre lo que sentís logra expresarse ni lo que pensás logra sostenerse en el hacer.";
      weeklyAdvice.textContent = "Nombrar estas incongruencias no es debilidad: es el inicio del proceso de integración.";
    } else {
      weeklyText.textContent = "Las respuestas muestran una percepción de coherencia interna.\n\nEsta lectura se limita a cómo te pensás y te observás a vos mismo.\n\nCómo esta coherencia se expresa en el vínculo con el mundo y la tecnología se observa en el siguiente tramo.";
      weeklyAdvice.textContent = "";
    }
  }

  setTimeout(() => weeklyTextWrap.classList.remove("hidden"), 900);
}

/* 🔒 PUNTO DE BLOQUEO EN BOTÓN: AVANZAR A SIGUIENTE SEMANA */
function nextWeek(){
  if (!pasoUnaSemana(week + 1)) {
    showWeeklyBlockFlash();
    return;
  }
  
  week++; 
  q = 0; 
  currentScore = 0;
  week >= WEEKS.length ? showMonthly() : (show("test"), loadQuestion());
}

function showMonthly(){
  show("monthlyResult");
}

/* ==========================================================================
   7. FLUJO DEL MÓDULO "EL ESPEJO"
   ========================================================================== */

/* 🔒 PUNTO DE BLOQUEO EN BOTÓN: ACCEDER A INTRODUCCIÓN DEL ESPEJO */
function gateMirrorIntro(){
  if (!pasoUnaSemana(3)) {
    showWeeklyBlockFlash();
    return;
  }
  show("mirrorIntro");
}

/* 🔒 PUNTO DE BLOQUEO EN BOTÓN: INICIAR CUESTIONARIO DEL ESPEJO */
function startMirror(){
  if (!pasoUnaSemana(3)) {
    showWeeklyBlockFlash();
    return;
  }
  document.body.classList.add("mirror-bg");
  mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  show("mirrorTest"); 
  loadMirror();
}

function loadMirror(){
  mirrorEmoji.textContent = MIRROR_EMOJIS[mq] || "⬤";
  mirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  mirrorLog.push(v ?? 0);
  if(v !== null){ mirrorScore += v; mirrorCount++; }
  mq++;

  if(mq === MIRROR_QUESTIONS.length){
    let semanticDelta = 0;
    const evitacion = mirrorLog[7] ?? 0;
    const desconexion = mirrorLog[5] ?? 0;
    const alegria = mirrorLog[6] ?? 0;
    semanticDelta -= (evitacion + desconexion) * 0.1;
    semanticDelta += alegria * 0.1;
    mirrorScore += semanticDelta;
  }

  mq >= MIRROR_QUESTIONS.length ? showFinal() : loadMirror();
}

/* ==========================================================================
   8. PANTALLA FINAL DE DEVOLUCIÓN INTEGRAL
   ========================================================================== */
function showFinal(){
  show("finalResult");
  finalTextWrap.classList.add("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;
  const desconexion = mirrorLog[5] ?? 0;
  const evitacion = mirrorLog[7] ?? 0;

  let estadoTexto = "ESTADO: REGISTRO EN PROCESO";
  let humanoTexto = "";

  if(avg < 1.2 || (desconexion >= 2 && evitacion >= 2)){
    estadoTexto = "ESTADO: RETRACTILIDAD / AUTOPROTECCIÓN";
    humanoTexto = "Durante este período se observan respuestas orientadas a la distancia o la atenuación del impacto emocional.\n\nEsto no implica ausencia de sensibilidad, sino una modalidad de funcionamiento donde la emoción es regulada mediante el repliegue o la desconexión rápida.";
  } else if(avg < 2.1){
    estadoTexto = "ESTADO: TRANSITABILIDAD CONSCIENTE";
    humanoTexto = "Las respuestas reflejan permeabilidad ante las situaciones vividas, con registro activo de emociones tanto placenteras como incómodas.\n\nHay capacidad de sostener la presencia sin recurrir sistemáticamente a la evitación.";
  } else {
    estadoTexto = "ESTADO: ALTA IMPLICACIÓN HUMANA";
    humanoTexto = "Se percibe un alto nivel de resonancia ante la experiencia propia y ajena.\n\nLa sensibilidad se mantiene disponible y expuesta, permitiendo un contacto profundo con lo que ocurre alrededor.";
  }

  if(finalState) finalState.textContent = estadoTexto;
  if(finalHumanText) finalHumanText.textContent = humanoTexto;

  setTimeout(() => finalTextWrap.classList.remove("hidden"), 800);
}
