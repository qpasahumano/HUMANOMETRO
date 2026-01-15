/* ================= ESPEJO ================= */

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
  mq = 0;
  mirrorScore = 0;
  mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  const q = document.getElementById("mirrorQuestion");
  q.classList.remove("fade");
  void q.offsetWidth;
  q.innerText = MIRROR_QUESTIONS[mq];
  q.classList.add("fade");
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

  let state = "", shortText = "", fullText = "";

  if (avg < 1.3) {
    state = "Opaco";
    shortText = "El reflejo aparece distorsionado.";
    fullText =
      "No porque falte humanidad, sino porque las emociones no están siendo integradas en el tiempo.";
  } else if (avg < 2.3) {
    state = "Intermedio";
    shortText = "El reflejo es inestable.";
    fullText =
      "Hay conciencia parcial, pero no siempre sostenida. La experiencia todavía no termina de integrarse.";
  } else {
    state = "Lúcido";
    shortText = "El reflejo es claro.";
    fullText =
      "Lo que sentís, pensás y hacés empieza a alinearse de forma consciente.";
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

function show(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
