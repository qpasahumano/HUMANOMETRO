Const $ = id => document.getElementById(id);

/* ===============================
   BLOQUEO SEMANAL — CONFIG
================================ */
const DEV_MODE = false;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const V2_BLOCK_KEY = "hm_v2_last_week";
const V2_STATE_KEY = "hm_v2_progress_state";

/* ===============================
   BLOQUEO Y PERSISTENCIA — UTILIDADES
================================ */
function now(){ return Date.now(); }

// 1. EL GUARDADO SOLO GUARDA (Registra la marca de tiempo sin alterar ni bloquear)
function registrarMarcaFinCiclo(){
  if (!localStorage.getItem(V2_BLOCK_KEY)) {
    localStorage.setItem(V2_BLOCK_KEY, now());
  }
}

function saveV2State(extra = {}) {
  Const state = {
    Week,
    Q,
    CurrentScore,
    WeeklyScores,
    AllAnswers,
    MirrorLog,
    LastSection: document.querySelector("section:not(.hidden)")?.id || "start",
    Timestamp: now(),
    ...extra
  };
  LocalStorage.setItem(V2_STATE_KEY, JSON.stringify(state));
}

function loadV2State() {
  Const raw = localStorage.getItem(V2_STATE_KEY);
  If (!raw) return null;
  Try { return JSON.parse(raw); } catch { return null; }
}

/* ===============================
   BLOQUEO VISUAL UNIFICADO
================================ */
function showWeeklyBlockFlash(){
  Const d = document.createElement("div");
  D.innerHTML = "No seas ansioso.<br>Todavía no pasó la semana.";
  D.style.cssText = `
    Position:fixed;
    Inset:0;
    Display:flex;
    Align-items:center;
    Justify-content:center;
    Text-align:center;
    Pointer-events:none;
    Font-size:1.35rem;
    Color:#eaffff;
    Background:
      Radial-gradient(circle, rgba(180,255,255,.28), transparent 60%),
      Rgba(6,18,40,.45);
    Text-shadow:
      0 0 12px rgba(140,255,240,1),
      0 0 26px rgba(140,255,240,.85);
    Z-index:9999;
    Animation: blockFade 1.3s ease-out forwards;
  `;
  Document.body.appendChild(d);
  SetTimeout(()=>d.remove(),1300);
}

/* CACHE DOM */
const weekTitle = $("weekTitle");
const questionText = $("questionText");
const questionMeasure = $("questionMeasure");

const weeklySymbol = $("weeklySymbol");
const weeklyText = $("weeklyText");
const weeklyAdvice = $("weeklyAdvice");
const weeklyTextWrap = $("weeklyTextWrap");

const mirrorEmoji = $("mirrorEmoji");
const mirrorQuestion = $("mirrorQuestion");

const finalFill = $("finalFill");
const finalTextWrap = $("finalTextWrap");
const finalHumanText = $("finalHumanText");
const finalState = $("finalState");

/* EMOJIS ESPEJO */
const MIRROR_EMOJIS = ["😡","😢","😨","😔","😰","😶‍osú","😊","🫥"];

/* DATOS BASE */
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

/* REGISTRO */
let week = 0, q = 0, currentScore = 0;
let weeklyScores = [], allAnswers = [], mirrorLog = [];

/* REANUDACIÓN AUTOMÁTICA EN V2 */
(function resumeV2() {
  Const saved = loadV2State();
  If (!saved) return;

  Week = saved.week || 0;
  Q = saved.q || 0;
  CurrentScore = saved.currentScore || 0;
  WeeklyScores = saved.weeklyScores || [];
  AllAnswers = saved.allAnswers || [];
  MirrorLog = saved.mirrorLog || [];

  If (saved.lastSection) {
    Show(saved.lastSection);
    If (saved.lastSection === "test") {
      LoadQuestion();
    } else if (saved.lastSection === "weeklyResult") {
      UpdateThermometer(calculateCurrentPercentage());
    } else if (saved.lastSection === "monthlyResult" || saved.lastSection === "mirrorIntro") {
      UpdateThermometer(calculateHistoricalPercentage());
    } else if (saved.lastSection === "mirrorTest") {
      LoadMirror();
    } else if (saved.lastSection === "finalResult") {
      UpdateThermometer(calculateFinalPercentage());
    }
  }
})();

/* FLUJO */
function startV2(){
  Const saved = loadV2State();
  If (saved && (saved.week > 0 || saved.lastSection && saved.lastSection !== "start")) {
    Show(saved.lastSection || "test"); 
    If (saved.lastSection === "test" || !saved.lastSection) loadQuestion();
    Return;
  }

  Document.body.classList.remove("mirror-bg");
  Week = 0; q = 0; currentScore = 0;
  WeeklyScores = []; allAnswers = []; mirrorLog = [];
  SaveV2State({ lastSection: "test" });
  Show("test"); loadQuestion();
}

function loadQuestion(){
  Const w = WEEKS[week];
  If (!w) return;
  WeekTitle.textContent = w.title;
  QuestionText.textContent = w.questions[q][0];
  QuestionMeasure.textContent = w.questions[q][1];
  
  UpdateThermometer();
}

function answer(v){
  CurrentScore += v;
  AllAnswers.push({ block: WEEKS[week].title, q, v });
  Q++;
  SaveV2State({ q, currentScore, allAnswers });
  Q >= 4 ? ShowWeekly() : loadQuestion();
}

/* ===============================
   DEVOLUCIONES SEMANALES
================================ */
function showWeekly(){
  Show("weeklyResult");
  WeeklyTextWrap.classList.add("hidden");
  
  Const avg = currentScore / 4;
  WeeklyScores.push(avg);
  
  UpdateThermometer();

  Const range =
    Avg <= 0.6 ? "low" :
    Avg <= 0.9 ? "midLow" :
    Avg <= 1.4 ? "mid" : "high";

  WeeklySymbol.textContent =
    Range === "low" ? "🦇" :
    Range === "midLow" ? "🦇" :
    Range === "mid" ? "🐞" : "🐦";

  Const block = WEEKS[week].title;

  If(block === "Vos ante el mundo"){
    If(avg < 1.5){
      WeeklyText.textContent =
        "Lo que ocurre en el mundo no siempre logra atravesarte.\n\n"+
        "El dolor ajeno, las injusticias o los conflictos pueden aparecer "+
        "como información lejana, sin generar un impacto emocional sustained.\n\n"+
        "Esto no habla de falta de humanidad, sino de posibles mecanismos "+
        "de defensa, cansancio o saturación emocional.";
      WeeklyAdvice.textContent =
        "Observar cuándo te cerrás y cuándo te abrís al otro "+
        "puede ser el primer gesto de reconexión humana.";
    } else {
      WeeklyText.textContent =
        "El mundo no pasa desapercibido.\n\n"+
        "Hay registro del dolor, de la injusticia y de lo que afecta "+
        "a otros seres humanos.";
      WeeklyAdvice.textContent =
        "Sostener esta sensibilidad sin que te abrume "+
        "es parte de un equilibrio humano maduro.";
    }
  }

  If(block === "Vos y la tecnología"){
    If(avg < 1.5){
      WeeklyText.textContent =
        "La atención aparece fragmentada.\n\n"+
        "La tecnología tiende a absorber momentos que podrían "+
        "ser habitados con mayor presencia.\n\n"+
        "No como error, sino como hábito automatizado.";
      WeeklyAdvice.textContent =
        "Pequeños cortes conscientes pueden devolver densidad "+
        "a la experiencia cotidiana.";
    } else {
      WeeklyText.textContent =
        "Lo digital acompaña sin dominar.\n\n"+
        "Hay uso consciente y registro del presente.";
      WeeklyAdvice.textContent =
        "Este equilibrio sostiene vínculos más reales "+
        "y una experiencia más encarnada.";
    }
  }

  If(block === "Integración humana"){
    If(avg < 1.5){
      WeeklyText.textContent =
        "Se perciben fisuras entre pensamiento, emoción y acción.\n\n"+
        "No siempre lo que sentís logra expresarse "+
        "ni lo que pensás logra sostenerse en el hacer.";
      WeeklyAdvice.textContent =
        "Nombrar estas incongruencias no es debilidad: "+
        "es el inicio del proceso de integración.";
    } else {
      WeeklyText.textContent =
        "Las respuestas muestran una percepción de coherencia interna.\n\n"+
        "Esta lectura se limita a cómo te pensás y te observás a vos mismo.\n\n"+
        "Cómo esta coherencia se expresa en el vínculo con el mundo y la tecnología\n"+
        "se observa en el siguiente tramo.";
      WeeklyAdvice.textContent = "";
    }
  }

  SaveV2State({ lastSection: "weeklyResult", weeklyScores });
  SetTimeout(()=>weeklyTextWrap.classList.remove("hidden"),900);
}

Function nextWeek(){
  Week++; 
  Q = 0; 
  CurrentScore = 0;
  
  Const isFinished = week >= WEEKS.length;

  If (isFinished) {
    RegistrarMarcaFinCiclo(); // EL GUARDADO SOLO REGISTRA EL TIEMPO SIN BLOQUEAR
    SaveV2State({ week, q, currentScore, lastSection: "monthlyResult" });
    ShowMonthly();
  } else {
    SaveV2State({ week, q, currentScore, lastSection: "test" });
    Show("test"); 
    LoadQuestion();
  }
}

/* ===============================
   CIERRE DE CICLO VOLUMEN 2
================================ */
function showMonthly(){
  Show("monthlyResult");
  UpdateThermometer();
  SaveV2State({ lastSection: "monthlyResult" });
}

/* ===============================
   TU REFLEJO — PREGUNTAS COMPLETAS
================================ */
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

Let mq = 0, mirrorScore = 0, mirrorCount = 0;

// 2. EL BLOQUEO Y DESBLOQUEO ESTÁN CONCENTRADOS EXCLUSIVAMENTE EN ESTE BOTÓN
Function gateMirrorIntro(){
  If (DEV_MODE) {
    OpenMirror();
    Return;
  }

  Const lastTime = localStorage.getItem(V2_BLOCK_KEY);
  
  // Si no hay fecha guardada por alguna razón, deja pasar o registra.
  If (!lastTime || isNaN(Number(lastTime))) {
    OpenMirror();
    Return;
  }

  Const transcurrido = now() - Number(lastTime);

  // ECUACIÓN MATEMÁTICA: ¿Transcurrieron los 7 días (WEEK_MS)?
  If (transcurrido < WEEK_MS) {
    ShowWeeklyBlockFlash(); // BLOQUEO
  } else {
    OpenMirror();           // DESBLOQUEO
  }
}

Function openMirror(){
  Show("mirrorIntro");
  UpdateThermometer();
  SaveV2State({ lastSection: "mirrorIntro" });
}

Function startMirror(){
  // El botón de iniciar refleja la misma validación unificada de gateMirrorIntro
  If (!DEV_MODE) {
    Const lastTime = localStorage.getItem(V2_BLOCK_KEY);
    If (lastTime && !isNaN(Number(lastTime))) {
      If ((now() - Number(lastTime)) < WEEK_MS) {
        ShowWeeklyBlockFlash();
        Return;
      }
    }
  }

  Document.body.classList.add("mirror-bg");
  Mq = 0; mirrorScore = 0; mirrorCount = 0; mirrorLog = [];
  SaveV2State({ lastSection: "mirrorTest" });
  Show("mirrorTest"); loadMirror();
}

Function loadMirror(){
  MirrorEmoji.textContent = MIRROR_EMOJIS[mq] || "⬤";
  MirrorQuestion.textContent = MIRROR_QUESTIONS[mq].t;
  UpdateThermometer();
}

Function answerMirror(v){
  MirrorLog.push(v ?? 0);
  If(v !== null){ mirrorScore += v; mirrorCount++; }
  Mq++;

  If(mq === MIRROR_QUESTIONS.length){
    Let semanticDelta = 0;
    Const evitacion = mirrorLog[7] ?? 0;
    Const desconexion = mirrorLog[5] ?? 0;
    Const alegria = mirrorLog[6] ?? 0;
    SemanticDelta -= (evitacion + desconexion) * 0.1;
    SemanticDelta += alegria * 0.1;
    MirrorScore += semanticDelta;
  }

  SaveV2State({ mq, mirrorScore, mirrorCount, mirrorLog });
  Mq >= MIRROR_QUESTIONS.length ? ShowFinal() : loadMirror();
}

/* ===============================
   DEVOLUCIÓN FINAL INTEGRATIVA Y CIERRE
================================ */
function showFinal(){
  Show("finalResult");
  FinalTextWrap.classList.add("hidden");
  UpdateThermometer();
  SaveV2State({ lastSection: "finalResult" });

  Const avg = mirrorCount ? MirrorScore / mirrorCount : 0;

  Const tristezaAjena = mirrorLog[1] ?? 0;
  Const desconexion = mirrorLog[5] ?? 0;
  Const evitacion = mirrorLog[7] ?? 0;

  Const bajaEmpatia = tristezaAjena <= 0.5;
  Const desconexionActiva = desconexion >= 1;
  Const evitacionActiva = evitacion >= 1;

  Let semanticPenalty = 0;
  If(bajaEmpatia) semanticPenalty++;
  If(desconexionActiva) semanticPenalty++;
  If(evitacionActiva) semanticPenalty++;

  Let range =
    Avg <= 0.6 ? 0 :
    Avg <= 0.9 ? 1 :
    Avg <= 1.4 ? 2 : 3;

  If(range >= 2 && semanticPenalty >= 2){
    Range -= 1;
  }

  AnimateGauge(finalFill, (avg / 2) * 100, ()=>{
    FinalTextWrap.classList.remove("hidden");

    If(range === 0){
      FinalState.textContent = "Predominio de NO";
      FinalHumanText.textContent =
        "Analizando el ciclo completo, aparece un patrón claro:\n"+
        "muchas situaciones que implican dolor ajeno, conflicto o malestar externo\n"+
        "no generan en vos una respuesta emocional significativa.\n\n"+
        "No como falta moral,\n"+
        "sino como señal de distancia.\n\n"+
        "Esta distancia no habla de frialdad consciente,\n"+
        "habla de un mecanismo de protección:\n"+
        "una forma de no involucrarse para no sentir.\n\n"+
        "El problema no es no sentir,\n"+
        "sino normalizar ese apagamiento como estado estable.\n\n"+
        "Cuando el dolor del otro no resuena,\n"+
        "la humanidad se vuelve funcional,\n"+
        "pero pierde profundidad.\n\n"+
        "Este resultado no acusa,\n"+
        "señala un punto ciego:\n"+
        "allí donde la empatía podría desarrollarse\n"+
        "y hoy no está ocurriendo.";
    }
    Else if(range === 1){
      FinalState.textContent = "Ambivalencia emocional";
      FinalHumanText.textContent =
        "Tus respuestas muestran una humanidad que aparece y se retira.\n\n"+
        "Hay momentos de registro, sensibilidad y presencia,\n"+
        "seguidos por momentos de automatismo, duda o repliegue.\n\n"+
        "El “tal vez” no es indecisión superficial:\n"+
        "es señal de una tensión interna\n"+
        "entre lo que sentís\n"+
        "y lo que te permitís sentir.\n\n"+
        "La integración no llega forzando respuestas,\n"+
        "llega cuando dejás de pelearte\n"+
        "con lo que aparece a medias.";
    }
    Else if(range === 2){
      FinalState.textContent = "Incongruencia marcada";
      FinalHumanText.textContent =
        "Al medir el recorrido completo,\n"+
        "aparece una incompatibilidad marcada entre tus respuestas.\n\n"+
        "Hay registros de conciencia en ciertos planos,\n"+
        "pero neutralidad o ausencia emocional\n"+
        "frente a situaciones donde la empatía humana es clave.\n\n"+
        "Esto no es incoherencia intelectual.\n"+
        "Es incongruencia emocional.\n\n"+
        "Distintas partes tuyas responden desde lugares opuestos:\n"+
        "una se muestra consciente,\n"+
        "otra evita implicarse,\n"+
        "otra racionaliza.\n\n"+
        "El resultado es una humanidad fragmentada:\n"+
        "funcional, adaptada,\n"+
        "pero no integrada.\n\n"+
        "La evolución no comienza corrigiendo respuestas,\n"+
        "comienza reconociendo\n"+
        "dónde no estás siendo el mismo\n"+
        "en todos los planos.";
    }
    Else{
      FinalState.textContent = "Congruencia humana";
      FinalHumanText.textContent =
        "A lo largo de todo el recorrido aparece una misma línea:\n"+
        "coherencia entre lo que sentís, lo que pensás y lo que hacés.\n\n"+
        "No hay fisuras marcadas\n"+
        "ni contradicciones defensivas,\n"+
        "sino una humanidad que registra, procesa\n"+
        "y responde con presencia.\n\n"+
        "Esto no habla de perfección,\n"+
        "habla de conciencia.\n\n"+
        "Integrar no es llegar a un punto final,\n"+
        "es mantener abierta la posibilidad\n"+
        "de seguir siendo humano.";
    }
  });
}

/* ===============================
   CIERRE Y LIMPIEZA DE CICLO
================================ */
function finalizarYReiniciar() {
  Const overlay = document.getElementById("cubeOverlay");
  If (overlay) overlay.classList.add("active");

  SetTimeout(() => {
    LocalStorage.removeItem(V2_STATE_KEY);
    LocalStorage.removeItem(V2_BLOCK_KEY);

    If (overlay) overlay.classList.remove("active");
    Document.body.classList.remove("mirror-bg");
    
    Show("start");
  }, 3000);
}

/* ===============================
   CÁLCULOS DE PORCENTAJE DE TERMÓMETRO ACUMULATIVO (1-100)
================================ */
function calculateCurrentPercentage() {
  Let totalQuestionsCount = 0;
  WEEKS.forEach(w => { totalQuestionsCount += w.questions.length; });

  Let answeredCount = 0;
  If (week < WEEKS.length) {
    AnsweredCount = (week * 4) + q;
  } else {
    AnsweredCount = totalQuestionsCount;
  }

  Const activeSec = document.querySelector("section:not(.hidden)")?.id;
  If (activeSec === "mirrorTest") {
    AnsweredCount = totalQuestionsCount + (mq > 0 ? Mq : 0);
    TotalQuestionsCount += MIRROR_QUESTIONS.length;
  }

  If (totalQuestionsCount === 0 || answeredCount === 0) {
    Return 5;
  }

  Let totalEarned = 0;
  Let maxPossibleSoFar = 0;

  For (let i = 0; i < weeklyScores.length; i++) {
    MaxPossibleSoFar += 4 * 2;
    TotalEarned += weeklyScores[i] * 4;
  }

  If (activeSec === "test" && week < WEEKS.length) {
    MaxPossibleSoFar += q * 2;
    TotalEarned += currentScore;
  } else if (activeSec === "mirrorTest") {
    MaxPossibleSoFar += mirrorScore;
    TotalEarned += mirrorScore;
  }

  Const qualityRatio = maxPossibleSoFar > 0 ? (totalEarned / maxPossibleSoFar) : 0;
  Const progressFraction = answeredCount / totalQuestionsCount;
  Const baseProgress = Math.max(5, Math.round(progressFraction * 100));
  
  Let targetPct = Math.round(baseProgress * (0.3 + (qualityRatio * 0.7)));
  Return Math.min(100, Math.max(5, Math.round(targetPct)));
}

Function calculateHistoricalPercentage() {
  If (weeklyScores.length === 0) return 30;
  Let sum = weeklyScores.reduce((a, b) => a + b, 0);
  Let avg = sum / weeklyScores.length;
  Return Math.min(100, Math.max(5, Math.round((avg / 2) * 100)));
}

Function calculateFinalPercentage() {
  Const hist = calculateHistoricalPercentage();
  Const mirrorAvg = mirrorCount ? (mirrorScore / mirrorCount) : 1;
  Const mirrorPct = (mirrorAvg / 2) * 100;
  Return Math.min(100, Math.max(5, Math.round((hist * 0.4) + (mirrorPct * 0.6))));
}

/* ===============================
   TERMÓMETRO GLOBAL INTEGRADO V2
================================ */
function updateThermometer(explicitPercent) {
  Let targetPercent = explicitPercent;
  
  If (targetPercent === undefined) {
    Const activeSec = document.querySelector("section:not(.hidden)")?.id;
    If (activeSec === "monthlyResult" || activeSec === "mirrorIntro") {
      TargetPercent = calculateHistoricalPercentage();
    } else if (activeSec === "finalResult") {
      TargetPercent = calculateFinalPercentage();
    } else {
      TargetPercent = calculateCurrentPercentage();
    }
  }

  Const fills = document.querySelectorAll('.thermo-fill');
  Fills.forEach(fill => {
    If (fill) {
      Fill.style.width = targetPercent + '%';
      
      If (targetPercent <= 50) {
        Fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 100%)";
      } else if (targetPercent <= 75) {
        Fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 50%, #ffc107 100%)";
      } else {
        Fill.style.background = "linear-gradient(90deg, #3b0000 0%, #ff2a47 33%, #ffc107 66%, #10b981 100%)";
      }
    }
  });

  Const valSpans = document.querySelectorAll('.thermo-percentage-val');
  ValSpans.forEach(span => {
    Span.textContent = targetPercent + '%';
  });
}

/* UTIL */
function animateGauge(el, target, done){
  If (!el) {
    Done && done();
    Return;
  }
  El.style.height="0%";
  Const start = performance.now(), dur = 1800;
  
  Function step(t){
    Const p = Math.min(1,(t-start)/dur);
    El.style.height = p * target + "%";
    P < 1 ? RequestAnimationFrame(step) : done && done();
  }
  RequestAnimationFrame(step);
}

Function show(id){
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","finalResult"]
    .forEach(s => {
      Const el = $(s);
      If (el) el.classList.toggle("hidden", s !== id);
    });
}
