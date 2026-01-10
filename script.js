let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let weeklyScore = [];
let weeklyIndex = 0;

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
  if(btn){
    btn.addEventListener("click", async () => {
      if(!deferredPrompt) return;
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
    "¿Tomás decisiones justas en tu trabajo incluso sin supervisión?",
    "¿Mantenés coherencia entre valores y acciones laborales?",
    "¿Evitás beneficiarte a costa de otros en tu trabajo?"
  ]},
  { name: "Planeta", questions: [
    "Si te encontraras con un animal en una situación S.O.S, ¿accionarías?",
    "¿Realizás acciones concretas para cuidar el entorno donde vivís?",
    "¿Intentás reducir tu impacto ambiental cotidiano?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Sos consciente de tus reacciones emocionales antes de actuar?",
    "¿Lográs coherencia entre lo que pensás y lo que hacés?",
    "¿Te responsabilizás del impacto emocional que generás en otros?"
  ]}
];

/* ======================
   TEST GENERAL
====================== */

function startTest(isPremium){
  mode = isPremium ? "premium" : "common";
  modules = JSON.parse(JSON.stringify(BASE_MODULES));
  if(mode === "premium") modules = modules.concat(PREMIUM_MODULES);

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

function answer(value){
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if(currentQuestion >= mod.questions.length){
    currentQuestion = 0;
    currentModule++;
  }

  currentModule >= modules.length
    ? showResults()
    : (showQuestion(), updateThermometer());
}

/* ======================
   DEVOLUCIONES GENERALES
====================== */

function commonFeedback(avg){
  if(avg < 40){
    return "La coherencia humana se encuentra baja. Predominan respuestas reactivas y una desconexión entre empatía, conciencia y acción.";
  }
  if(avg < 70){
    return "Existe conciencia humana, aunque de forma intermitente. Hay momentos de presencia y otros donde se pierde el eje interno.";
  }
  return "La coherencia y congruencia humana están activas. Pensar, sentir y actuar tienden a alinearse de manera sostenida.";
}

/* ======================
   RESULTADOS
====================== */

function showResults(){
  showSection("results");

  const circles = document.getElementById("circles");
  const tips = document.getElementById("tips");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const pct = Math.round((scores[m.name] / max) * 100);
    total += pct;

    circles.innerHTML += `
      <div class="circle ${pct < 40 ? "low" : pct < 70 ? "mid" : "high"}">
        <strong>${pct}%</strong><small>${m.name}</small>
      </div>`;
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  tips.innerHTML += `<li>${commonFeedback(avg)}</li>`;

  if(mode === "premium"){
    const results = document.getElementById("results");

    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Activar medidor semanal";
    btn.onclick = startWeekly;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Con este medidor podés medir semana a semana tu nivel de conciencia humana, " +
      "en el amor (pareja), en el trabajo, en lo social y en general. " +
      "Actualizá tu consciencia.";

    results.appendChild(btn);
    results.appendChild(note);
  }
}

/* ======================
   MEDIDOR SEMANAL
====================== */

const WEEKLY_QUESTIONS = [
  "Esta semana, ¿escuchaste a tu pareja sin preparar tu respuesta?",
  "¿Durante un conflicto lograste no guardar rencor?",
  "¿Intentaste empatizar con lo que le estaba pasando a tu pareja?",
  "¿Cuidaste el vínculo incluso en momentos de tensión?"
];

function startWeekly(){
  weeklyIndex = 0;
  weeklyScore = [];
  showWeeklyQuestion();
}

function showWeeklyQuestion(){
  document.getElementById("results").innerHTML = `
    <h3>Medición semanal</h3>
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
  weeklyIndex < WEEKLY_QUESTIONS.length ? showWeeklyQuestion() : showWeeklyResult();
}

function showWeeklyResult(){
  const avg = weeklyScore.reduce((a,b)=>a+b,0) / weeklyScore.length;

  let state, color, icon, advice;

  if(avg >= 1.5){
    state = "Estado humano en ascenso";
    color = "#2ecc71";
    icon = "🙂";
    advice = "Seguí cultivando la escucha y la empatía. Estás construyendo coherencia interna.";
  } else if(avg >= 0.8){
    state = "Estado humano intermedio";
    color = "#f1c40f";
    icon = "😐";
    advice = "Observá en qué momentos reaccionás y dónde podrías responder con más conciencia.";
  } else {
    state = "Estado humano bajo";
    color = "#e74c3c";
    icon = "☹️";
    advice = "Poné foco en detenerte antes de reaccionar. Escuchar y sentir sin defenderte es un primer paso.";
  }

  document.getElementById("results").innerHTML = `
    <h3>Resultado semanal ${icon}</h3>
    <p><strong>${state}</strong></p>
    <p>${advice}</p>

    <div style="margin:20px auto;height:140px;width:24px;background:#111;border-radius:12px;overflow:hidden;">
      <div style="height:${avg*50}%;background:${color};box-shadow:0 0 18px ${color};"></div>
    </div>

    <button onclick="restart()">Cerrar / Grabar nivel actual</button>
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
