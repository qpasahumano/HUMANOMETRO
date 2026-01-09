let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ======================
   PWA – INSTALAR APP
====================== */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("installBtn");
  if (btn) {
    btn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.classList.add("hidden");
    });
  }
});

/* ======================
   MÓDULOS
====================== */

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente disponible para tu familia?",
    "¿Escuchás sin juzgar ni corregir?",
    "¿Expresás afecto de manera espontánea?"
  ]},
  { name: "Social", questions: [
    "¿Tratás a las personas con respeto incluso cuando no coincidís?",
    "¿Podés escuchar opiniones distintas sin cerrarte?",
    "¿Tenés en cuenta cómo tus acciones afectan a otros?"
  ]},
  { name: "Amistad", questions: [
    "¿Estás presente para tus amistades cuando lo necesitan?",
    "¿Cuidás el vínculo aunque no compartas la misma opinión?",
    "¿Sabés escuchar sin imponer tu punto de vista?"
  ]},
  { name: "Laboral", questions: [
    "¿Tomás decisiones justas en tu trabajo incluso sin control?",
    "¿Mantenés coherencia entre valores y acciones laborales?",
    "¿Evitás beneficiarte a costa de otros en el trabajo?"
  ]},
  { name: "Planeta", questions: [
    "Si te encontraras con un animal en una situación S.O.S, ¿accionarías?",
    "¿Realizás acciones concretas para cuidar tu entorno?",
    "¿Intentás reducir tu impacto ambiental cotidiano?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Sos consciente de tus reacciones emocionales antes de actuar?",
    "¿Lográs coherencia entre lo que pensás y hacés?",
    "¿Te responsabilizás del impacto emocional que generás?"
  ]}
];

/* ======================
   SEMANAL – FLUJO TIPO TEST
====================== */

const WEEKLY_QUESTIONS = [
  "Esta semana, ¿escuchaste a tu pareja sin preparar tu respuesta?",
  "En un conflicto, ¿evitaste guardar rencor?",
  "¿Intentaste comprender lo que le pasaba a tu pareja?",
  "¿Cuidaste el vínculo incluso en momentos de tensión?"
];

let weeklyIndex = 0;
let weeklyScore = [];

/* ======================
   TEST GENERAL
====================== */

function startTest(isPremium){
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if (mode === "premium") modules = modules.concat(PREMIUM_MODULES);

  scores = {};
  modules.forEach(m => scores[m.name] = 0);

  currentModule = 0;
  currentQuestion = 0;

  showSection("test");
  showQuestion();
  updateThermometer();
}

function showQuestion(){
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(val){
  const mod = modules[currentModule];
  scores[mod.name] += val;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length){
    currentQuestion = 0;
    currentModule++;
  }

  currentModule >= modules.length ? showResults() : (showQuestion(), updateThermometer());
}

/* ======================
   RESULTADOS + SEMANAL
====================== */

function showResults(){
  showSection("results");

  const tips = document.getElementById("tips");
  tips.innerHTML = "";

  let total = 0;
  modules.forEach(m => {
    const max = m.questions.length * 2;
    const pct = Math.round((scores[m.name] / max) * 100);
    total += pct;
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText = "Humanidad global: " + avg + "%";

  if (mode === "premium") {
    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Iniciar revisión semanal";
    btn.onclick = startWeekly;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Semana a semana caminaremos juntos observando tu conciencia humana en los vínculos emocionales. " +
      "No se trata de juzgar, sino de mirar con honestidad lo vivido y transformarlo.";

    document.getElementById("results").appendChild(btn);
    document.getElementById("results").appendChild(note);
  }
}

/* ======================
   SEMANAL – UNA PREGUNTA
====================== */

function startWeekly(){
  weeklyIndex = 0;
  weeklyScore = [];
  showWeeklyQuestion();
}

function showWeeklyQuestion(){
  const results = document.getElementById("results");
  results.innerHTML = `
    <h3>Revisión semanal</h3>
    <p>${WEEKLY_QUESTIONS[weeklyIndex]}</p>
    <div class="answers">
      <button onclick="weeklyAnswer(2)">Sí</button>
      <button onclick="weeklyAnswer(1)">Tal vez / A veces</button>
      <button onclick="weeklyAnswer(0)">No</button>
    </div>
  `;
}

function weeklyAnswer(v){
  weeklyScore.push(v);
  weeklyIndex++;

  if (weeklyIndex < WEEKLY_QUESTIONS.length){
    showWeeklyQuestion();
  } else {
    showWeeklyResult();
  }
}

function showWeeklyResult(){
  const avg = weeklyScore.reduce((a,b)=>a+b,0) / weeklyScore.length;

  let color = avg < 0.8 ? "red" : avg < 1.5 ? "yellow" : "green";
  let msg =
    color === "green"
      ? "Semana de crecimiento humano y apertura emocional."
      : color === "yellow"
      ? "Semana intermedia: hubo conciencia, pero también reacción."
      : "Semana de cierre emocional y desconexión. Es momento de observar sin culpa.";

  document.getElementById("results").innerHTML = `
    <h3>Lectura semanal</h3>
    <p>${msg}</p>
    <div style="margin-top:20px;height:120px;width:20px;background:#111;border-radius:10px;overflow:hidden;">
      <div style="height:${avg*40}%;background:${color};box-shadow:0 0 12px ${color};"></div>
    </div>
  `;
}

/* ======================
   TERMÓMETRO GENERAL
====================== */

function updateThermometer(){
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0) + currentQuestion;
  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100) + "%";
}

/* ======================
   UTILIDADES
====================== */

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
