/* ================= VOLUMEN 2 ================= */

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Empatía global"],
      ["Cuando alguien te habla, ¿dejás el celular?", "Presencia humana"],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Compromiso humano"],
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad emocional"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Uso consciente"],
      ["¿Controlás el tiempo en pantallas?", "Autocontrol digital"],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Empatía digital"],
      ["¿La tecnología acompaña sin absorberte?", "Equilibrio tecnológico"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Coherencia"],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"],
      ["¿Sentís evolución humana?", "Integración"]
    ]
  }
];

let week = 0, q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2() {
  week = 0; q = 0; weeklyScores = []; currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  weekTitle.innerText = w.title;
  questionText.innerText = w.questions[q][0];
  questionMeasure.innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();
  q >= 4 ? showWeeklyResult() : loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = currentScore / 4;
  weeklyScores.push(avg);

  if (avg < 0.8) {
    weeklySymbol.innerText = "🦇";
    weeklyText.innerText =
      "La semana mostró una desconexión entre emoción y acción.\n" +
      "Las experiencias ocurrieron, pero no terminaron de integrarse.";
    weeklyAdvice.innerText =
      "Detenerte y observar sin juicio puede ayudarte a reordenar lo vivido.";
  } else if (avg < 1.5) {
    weeklySymbol.innerText = "🐞";
    weeklyText.innerText =
      "La humanidad estuvo presente de forma intermitente.\n" +
      "Hubo conciencia, pero no siempre sostenida.";
    weeklyAdvice.innerText =
      "Pequeños gestos conscientes pueden transformar momentos aislados en continuidad.";
  } else {
    weeklySymbol.innerText = "🐦";
    weeklyText.innerText =
      "La semana mostró coherencia creciente entre emoción y acción.\n" +
      "La experiencia fue habitada con mayor presencia.";
    weeklyAdvice.innerText =
      "Sostener esta actitud fortalece tu proceso humano en el tiempo.";
  }
}

function nextWeek() {
  week++; q = 0; currentScore = 0;
  week >= WEEKS.length ? showMonthlyResult() : (show("test"), loadQuestion());
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  monthlyLongText.innerText =
    "Este recorrido integra tus respuestas semanales como un proceso continuo. " +
    "No mide hechos aislados, sino la forma en que fuiste habitando tus emociones, " +
    "tus decisiones y tu impacto en el entorno.";

  animateFill(monthlyFill, Math.round((avg/2)*100));

  setTimeout(()=>{
    monthlyText.innerText =
      "El resultado refleja un estado dinámico de tu humanidad: " +
      "la conciencia aparece cuando emoción, pensamiento y acción comienzan a alinearse.";
  },1200);
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  { t:"En estos días, ¿sentiste enojo en algún momento que haya influido en tu forma de actuar?", e:"😠" },
  { t:"En estos días, ¿sentiste tristeza que haya condicionado tus decisiones o tu energía?", e:"😢" },
  { t:"¿Sentiste miedo (a perder, a equivocarte, a confrontar) que te haya limitado o frenado?", e:"😨" },
  { t:"¿Apareció culpa por algo dicho o hecho, que haya quedado sin resolver internamente?", e:"😔" },
  { t:"¿Sentiste ansiedad o inquietud que te haya llevado a reaccionar de forma automática?", e:"😵‍💫" },
  { t:"¿Percibiste momentos de indiferencia o desconexión emocional frente a personas o situaciones importantes?", e:"😐" },
  { t:"¿Experimentaste alegría o bienestar genuino que haya sido coherente con lo que estabas viviendo?", e:"😊" },
  { t:"Mirando estos días en conjunto, ¿hubo alguna emoción dominante que no supiste nombrar o preferiste evitar?", e:"❓" }
];

let mq = 0, mirrorScore = 0, mirrorCount = 0;

function openMirror() { show("mirrorIntro"); }

function startMirror() {
  mq = 0; mirrorScore = 0; mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  mirrorEmoji.innerText = MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v) {
  if (v !== null) { mirrorScore += v; mirrorCount++; }
  mq++;
  mq >= MIRROR_QUESTIONS.length ? showMirrorResult() : loadMirrorQuestion();
}

function showMirrorResult() {
  show("mirrorResult");

  const avg = mirrorCount ? mirrorScore/mirrorCount : 0;

  animateFill(mirrorFill, Math.round((avg/2)*100));

  mirrorFullText.innerText =
    "El resultado de un humanómetro no es un veredicto, sino un reflejo integrador.\n\n" +
    "A lo largo del recorrido, tus respuestas mostraron cómo las emociones fueron reconocidas, " +
    "sostenidas o evitadas, y de qué manera influyeron en tus decisiones y acciones.\n\n" +
    "La humanidad no se pierde, pero se apaga cuando no se la habita conscientemente. " +
    "Volver a medir tu humanidad cuando quieras: Humanómetro está para eso.";
}

/* ================= UTILIDADES ================= */

function updateThermo() {
  thermoFill.style.width = (q/4)*100+"%";
}

function animateFill(el, target) {
  el.style.height = "0%";
  let h = 0;
  const i = setInterval(()=>{
    h++;
    el.style.height = h+"%";
    if(h>=target) clearInterval(i);
  },15);
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","mirrorResult"]
    .forEach(s => document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() { show("start"); }
