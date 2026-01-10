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
   MÓDULOS BASE
====================== */

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estuviste emocionalmente presente con tu familia?",
    "¿Escuchaste sin juzgar ni corregir?",
    "¿Expresaste afecto de forma genuina?"
  ]},
  { name: "Social", questions: [
    "¿Trataste a otros con respeto aun en desacuerdo?",
    "¿Escuchaste opiniones distintas sin cerrarte?",
    "¿Tuviste en cuenta el impacto de tus actos?"
  ]},
  { name: "Amistad", questions: [
    "¿Estuviste disponible cuando alguien te necesitó?",
    "¿Cuidaste el vínculo aun sin coincidir?",
    "¿Escuchaste sin imponer tu mirada?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuaste con justicia aun sin supervisión?",
    /* REFORMULACIÓN 1 */
    "¿Generaste un buen clima laboral incluso cuando no te sentías cómodo?",
    /* REFORMULACIÓN 2 */
    "¿Sobrecargaste con tu función a tus compañeros?"
  ]},
  { name: "Planeta", questions: [
    "Ante una situación S.O.S con un animal, ¿accionarías?",
    "¿Cuidaste activamente el entorno donde vivís?",
    "¿Reduciste tu impacto ambiental cuando pudiste?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Fuiste consciente de tus reacciones antes de actuar?",
    "¿Lograste coherencia entre lo que sentís y hacés?",
    "¿Asumiste responsabilidad emocional en tus vínculos?"
  ]}
];

/* ======================
   TEST
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

function answer(val){
  const mod = modules[currentModule];
  scores[mod.name] += val;
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
    return "Las respuestas reflejan una desconexión entre conciencia, empatía y acción. Predominan reacciones automáticas.";
  }
  if(avg < 70){
    return "Hay conciencia presente, aunque de forma inestable. En algunas vivencias se sostiene y en otras se diluye.";
  }
  return "La coherencia humana está activa. Pensar, sentir y actuar tienden a alinearse.";
}

function premiumFeedback(area, percent){
  const low = [
    `En ${area} se percibe desconexión interna y reacción automática.`,
    `En ${area} cuesta sostener empatía en situaciones reales.`
  ];
  const mid = [
    `En ${area} la conciencia aparece, pero no siempre se mantiene.`,
    `En ${area} hay intención de coherencia aún fluctuante.`
  ];
  const high = [
    `En ${area} hay presencia consciente y coherencia interna.`,
    `En ${area} tus acciones reflejan humanidad sostenida.`
  ];
  const pool = percent < 40 ? low : percent < 70 ? mid : high;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ======================
   RESULTADOS GENERALES
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
      "Con este medidor podés medir semana a semana tu nivel de conciencia humana, " +
      "en el amor (pareja), en el trabajo, en lo social y en general. " +
      "Actualizá tu consciencia.";

    results.appendChild(btn);
    results.appendChild(note);
  }
}

/* ======================
   MEDIDOR SEMANAL (VIVENCIAL)
====================== */

const WEEKLY_QUESTIONS = [
  "¿Tuviste un conflicto con tu pareja esta semana?",
  "Si lo hubo, ¿guardaste bronca por lo sucedido?",
  "¿Escuchaste a tu pareja con presencia real?",
  "¿Intentaste comprender lo que le pasaba al otro?"
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
    state = "Conciencia humana en ascenso";
    color = "#2ecc71";
    icon = "🙂";
    advice = "Sostené esta presencia. Estás humanizando tus vínculos.";
  } else if(avg >= 0.8){
    state = "Conciencia humana intermedia";
    color = "#f1c40f";
    icon = "😐";
    advice = "Observá dónde reaccionás y dónde podés responder con más empatía.";
  } else {
    state = "Conciencia humana baja";
    color = "#e74c3c";
    icon = "☹️";
    advice = "Poné foco en frenar la reacción y abrir la escucha consciente.";
  }

  document.getElementById("results").innerHTML = `
    <h3>Resultado semanal</h3>

    <div style="
      font-size:48px;
      text-align:center;
      margin:10px 0;
      filter: drop-shadow(0 0 8px ${color});
    ">
      ${icon}
    </div>

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
