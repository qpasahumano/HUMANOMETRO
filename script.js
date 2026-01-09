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
   DEVOLUCIONES
====================== */

function commonFeedback(avg){
  if(avg < 40){
    return "Las respuestas indican una baja coherencia entre conciencia, empatía y acción. Predominan reacciones automáticas y desconexión emocional.";
  }
  if(avg < 70){
    return "Existe conciencia humana, aunque aparece de manera intermitente. En algunos contextos se sostiene y en otros se diluye.";
  }
  return "La coherencia humana se encuentra activa. Hay presencia, empatía y responsabilidad emocional sostenida.";
}

function premiumFeedback(area, percent){
  const variants = {
    low: [
      `En ${area}, se observa una desconexión interna entre lo que sentís y cómo actuás.`,
      `En ${area}, predomina la reacción por sobre la conciencia.`,
      `En ${area}, hay dificultad para sostener empatía y coherencia.`
    ],
    mid: [
      `En ${area}, la conciencia aparece, pero no siempre se mantiene.`,
      `En ${area}, la coherencia depende del contexto emocional.`,
      `En ${area}, hay intención de cambio, aún inestable.`
    ],
    high: [
      `En ${area}, hay coherencia interna y presencia consciente.`,
      `En ${area}, las acciones reflejan empatía y responsabilidad.`,
      `En ${area}, la humanidad se expresa de forma sostenida.`
    ]
  };
  const g = percent < 40 ? "low" : percent < 70 ? "mid" : "high";
  return variants[g][Math.floor(Math.random() * variants[g].length)];
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

    if(mode === "premium"){
      tips.innerHTML += `<li>${premiumFeedback(m.name, pct)}</li>`;
    }
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  if(mode === "common"){
    tips.innerHTML += `<li>${commonFeedback(avg)}</li>`;
  }

  if(mode === "premium"){
    const results = document.getElementById("results");

    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Activar medidor semanal";
    btn.onclick = startWeekly;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Con esta versión podés medir semana a semana tu nivel de conciencia humana. " +
      "El medidor semanal te permite observar tu estado actual y cómo evoluciona con el tiempo.";

    results.appendChild(btn);
    results.appendChild(note);
  }
}

/* ======================
   SEMANAL
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

  weeklyIndex < WEEKLY_QUESTIONS.length
    ? showWeeklyQuestion()
    : showWeeklyResult();
}

function showWeeklyResult(){
  const avg = weeklyScore.reduce((a,b)=>a+b,0) / weeklyScore.length;

  let color = avg < 0.8 ? "red" : avg < 1.5 ? "yellow" : "green";
  let height = color === "red" ? "30%" : color === "yellow" ? "60%" : "100%";

  let msg =
    color === "green"
      ? "Estado humano en ascenso. Conciencia y empatía presentes."
      : color === "yellow"
      ? "Estado humano intermedio. Conciencia fluctuante."
      : "Estado humano bajo. Desconexión emocional y reactividad.";

  document.getElementById("results").innerHTML = `
    <h3>Resultado semanal</h3>
    <p>${msg}</p>

    <div style="margin:20px auto;height:140px;width:24px;background:#111;border-radius:12px;overflow:hidden;">
      <div style="height:${height};background:${color};box-shadow:0 0 14px ${color};"></div>
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
