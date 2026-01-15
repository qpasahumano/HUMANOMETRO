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
      ["¿Hay coherencia entre lo que pensás y hacés?", "Alineación interna"],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"],
      ["¿Sentís que tu humanidad evolucionó?", "Integración global"]
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
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  document.getElementById("questionMeasure").innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();
  if (q >= 4) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = currentScore / 4;
  weeklyScores.push(avg);

  let symbol = "🐞", text = "", advice = "";
  if (avg < 0.8) {
    symbol = "🦇";
    text = "Esta semana mostró una desconexión humana.";
    advice = "Detenerte y observar puede ayudarte a reconectar.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text = "Tu humanidad se mantuvo estable.";
    advice = "Pequeños gestos conscientes pueden impulsarte.";
  } else {
    symbol = "🐦";
    text = "Tu humanidad está en crecimiento.";
    advice = "Sostener esta coherencia fortalece tu camino.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

function nextWeek() {
  week++; q = 0; currentScore = 0;
  if (week >= WEEKS.length) showMonthlyResult();
  else { show("test"); loadQuestion(); }
}

function showMonthlyResult() {
  show("monthlyResult");
  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  setTimeout(() => {
    document.getElementById("monthlyFill").style.height =
      Math.round((avg / 2) * 100) + "%";
  }, 300);

  setTimeout(() => {
    let text = "";
    if (avg < 0.8) {
      text =
        "El recorrido mostró una desconexión entre emoción, pensamiento y acción.\n\n" +
        "No implica ausencia de humanidad, sino falta de integración consciente.\n" +
        "Las experiencias ocurrieron, pero no terminaron de ser habitadas.\n\n" +
        "Este estado invita a detenerse y observar sin juicio.";
    } else if (avg < 1.5) {
      text =
        "El recorrido reflejó momentos de presencia alternados con automatismos.\n\n" +
        "Hay conciencia parcial, pero no siempre sostenida en el tiempo.\n" +
        "La humanidad aparece, aunque aún no se consolida.\n\n" +
        "La clave está en habitar lo que sentís con mayor continuidad.";
    } else {
      text =
        "El recorrido mostró coherencia creciente entre lo que sentís y lo que hacés.\n\n" +
        "La experiencia fue integrada de forma consciente.\n" +
        "No desde la perfección, sino desde la presencia.\n\n" +
        "Este estado fortalece la evolución humana sostenida.";
    }
    document.getElementById("monthlyText").innerText = text;
  }, 1200);
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  "En estos días, ¿sentiste enojo en algún momento que haya influido en tu forma de actuar?",
  "En estos días, ¿sentiste tristeza que haya condicionado tus decisiones o tu energía?",
  "¿Sentiste miedo (a perder, a equivocarte, a confrontar) que te haya limitado o frenado?",
  "¿Apareció culpa por algo dicho o hecho, que haya quedado sin resolver internamente?",
  "¿Sentiste ansiedad o inquietud que te haya llevado a reaccionar de forma automática?",
  "¿Percibiste momentos de indiferencia o desconexión emocional frente a personas o situaciones importantes?",
  "¿Experimentaste alegría o bienestar genuino que haya sido coherente con lo que estabas viviendo?",
  "Mirando estos días en conjunto, ¿hubo alguna emoción dominante que no supiste nombrar o preferiste evitar?"
];

let mq = 0;
let mirrorScore = 0;
let mirrorCount = 0;

function openMirror() {
  show("mirrorIntro");
}

function startMirror() {
  mq = 0; mirrorScore = 0; mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  const el = document.getElementById("mirrorQuestion");
  el.classList.remove("fade");
  void el.offsetWidth;
  el.innerText = MIRROR_QUESTIONS[mq];
  el.classList.add("fade");
}

function answerMirror(v) {
  if (v !== null) {
    mirrorScore += v;
    mirrorCount++;
  }
  mq++;
  if (mq >= MIRROR_QUESTIONS.length) showMirrorResult();
  else loadMirrorQuestion();
}

function showMirrorResult() {
  show("mirrorResult");

  const avg = mirrorCount === 0 ? 0 : mirrorScore / mirrorCount;

  let state="", shortText="", fullText="";
  if (avg < 1.3) {
    state = "Opaco";
    shortText = "El reflejo aparece distorsionado.";
    fullText = "No porque falte humanidad, sino porque las emociones no están siendo integradas en el tiempo.";
  } else if (avg < 2.3) {
    state = "Intermedio";
    shortText = "El reflejo es inestable.";
    fullText = "Hay conciencia parcial, pero no siempre sostenida. La experiencia todavía no termina de integrarse.";
  } else {
    state = "Lúcido";
    shortText = "El reflejo es claro.";
    fullText = "Lo que sentís, pensás y hacés empieza a alinearse de forma consciente.";
  }

  document.getElementById("mirrorState").innerText = state;
  document.getElementById("mirrorShortText").innerText = shortText;
  document.getElementById("mirrorFullText").innerText =
    fullText + "\n\nLa humanidad no se pierde, pero se apaga cuando no se la habita conscientemente.";

  setTimeout(() => {
    document.getElementById("mirrorFill").style.height =
      Math.round((avg / 3) * 100) + "%";
  }, 300);
}

/* ================= UTIL ================= */

function updateThermo() {
  document.getElementById("thermoFill").style.width = (q / 4) * 100 + "%";
}

function show(id) {
  ["start","test","weeklyResult","monthlyResult","mirrorIntro","mirrorTest","mirrorResult"]
    .forEach(s => document.getElementById(s)?.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
