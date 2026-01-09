let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let weeklyScore = [];

/* ======================
   MÓDULOS
====================== */

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente presente con tu familia?",
    "¿Escuchás sin juzgar?",
    "¿Expresás afecto sin que te lo pidan?"
  ]},
  { name: "Social", questions: [
    "¿Tratás a las personas con respeto?",
    "¿Escuchás opiniones distintas a la tuya?",
    "¿Actuás con empatía en espacios públicos?"
  ]},
  { name: "Amistad", questions: [
    "¿Estás presente para tus amistades?",
    "¿Sos leal incluso cuando no estás de acuerdo?",
    "¿Escuchás sin imponer tu visión?"
  ]},
  { name: "Laboral", questions: [
    "¿Actuás con ética en tu trabajo?",
    "¿Respetás a tus compañeros?",
    "¿Sos justo cuando nadie te observa?"
  ]},
  { name: "Planeta", questions: [
    "¿Respetás a los animales como seres vivos?",
    "¿Cuidás el entorno donde vivís?",
    "¿Reducís tu impacto ambiental cuando podés?"
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    "¿Vivís desde el amor o desde el miedo?",
    "¿Sos coherente entre lo que pensás y hacés?",
    "¿Te responsabilizás de tu impacto en otros?"
  ]}
];

const COUPLE_WEEKLY = [
  "¿Escuchás a tu pareja sin preparar tu respuesta?",
  "¿Sos coherente entre lo que decís y lo que hacés con tu pareja?",
  "¿Cuidás el vínculo incluso en momentos de tensión?"
];

/* ======================
   INICIO TEST
====================== */

function startTest(isPremium) {
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

function showQuestion() {
  const mod = modules[currentModule];
  document.getElementById("areaTitle").innerText = mod.name;
  document.getElementById("questionText").innerText = mod.questions[currentQuestion];
}

function answer(value) {
  const mod = modules[currentModule];
  scores[mod.name] += value;
  currentQuestion++;

  if (currentQuestion >= mod.questions.length) {
    currentQuestion = 0;
    currentModule++;
  }

  if (currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

/* ======================
   DEVOLUCIONES
====================== */

function generalCommonFeedback(avg){
  if(avg < 40){
    return {
      level: "Bajo",
      text:
        "Las respuestas muestran una desconexión frecuente entre lo que sentís, pensás y sostenés en tus acciones cotidianas."
    };
  }
  if(avg < 70){
    return {
      level: "Medio",
      text:
        "Existe conciencia humana, pero no siempre se mantiene cuando cambian las circunstancias o el estado emocional."
    };
  }
  return {
    level: "Alto",
    text:
      "Hay alineación clara entre intención, emoción y acción de forma sostenida."
  };
}

function intrapersonalPremium(area, percent){
  const variants = {
    low: [
      `En ${area}, estás actuando más desde la reacción que desde la presencia consciente.`,
      `En ${area}, hay una desconexión interna que impacta en tus decisiones.`,
      `En ${area}, el vínculo con vos mismo se encuentra debilitado en este momento.`
    ],
    mid: [
      `En ${area}, existe conciencia, pero no siempre se sostiene frente a la incomodidad.`,
      `En ${area}, la coherencia aparece de forma parcial según el contexto.`,
      `En ${area}, la intención es clara, aunque todavía inestable.`
    ],
    high: [
      `En ${area}, tus decisiones reflejan coherencia interna y presencia real.`,
      `En ${area}, se percibe alineación entre emoción, pensamiento y acción.`,
      `En ${area}, hay responsabilidad humana activa y sostenida.`
    ]
  };

  const group = percent < 40 ? "low" : percent < 70 ? "mid" : "high";
  const texts = variants[group];
  return texts[Math.floor(Math.random() * texts.length)];
}

/* ======================
   RESULTADOS
====================== */

function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  const tips = document.getElementById("tips");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);

    if(mode === "premium"){
      const li = document.createElement("li");
      li.innerText = intrapersonalPremium(m.name, percent);
      tips.appendChild(li);
    }
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  if(mode === "common"){
    const fb = generalCommonFeedback(avg);
    tips.innerHTML += `<li>Nivel de coherencia humana: ${fb.level}</li>`;
    tips.innerHTML += `<li>${fb.text}</li>`;
  }

  if(mode === "premium"){
    let levelText, explanationText;

    if(avg < 40){
      levelText = "Nivel de coherencia humana: Bajo";
      explanationText =
        "Las respuestas reflejan fragmentación emocional y dificultad para sostener coherencia entre distintas áreas de tu vida.";
    } else if(avg < 70){
      levelText = "Nivel de coherencia humana: Medio";
      explanationText =
        "Existe conciencia activa, pero aún depende del contexto emocional y del momento personal.";
    } else {
      levelText = "Nivel de coherencia humana: Alto";
      explanationText =
        "Se observa alineación interna entre pensamiento, emoción y acción de forma consistente.";
    }

    tips.innerHTML += `<li>${levelText}</li>`;
    tips.innerHTML += `<li>${explanationText}</li>`;

    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Desbloquear revisión semanal";
    btn.onclick = startWeeklyReview;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Descubrí tu grado real de evolución emocional en tus vínculos de pareja. Seguimiento semanal profundo y personalizado.";

    document.getElementById("results").appendChild(btn);
    document.getElementById("results").appendChild(note);
  }
}

/* ======================
   TERMÓMETRO
====================== */

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100) + "%";
}

/* ======================
   SEMANAL PAREJA
====================== */

function startWeeklyReview() {
  weeklyScore = [];
  let html = `<div id="weeklyBox"><h3>Revisión semanal de vínculo de pareja</h3>`;

  COUPLE_WEEKLY.forEach((q,i)=>{
    html += `
      <p>${q}</p>
      <div class="answers">
        <button onclick="weeklyAnswer(${i},2)">Sí</button>
        <button onclick="weeklyAnswer(${i},1)">A veces</button>
        <button onclick="weeklyAnswer(${i},0)">No</button>
      </div>
    `;
  });

  html += "</div>";
  document.getElementById("results").innerHTML += html;
}

function weeklyAnswer(i, v){
  weeklyScore[i] = v;

  const rows = document.querySelectorAll("#weeklyBox .answers");
  const buttons = rows[i].querySelectorAll("button");
  buttons.forEach(b => b.style.opacity = "0.35");
  buttons[v === 2 ? 0 : v === 1 ? 1 : 2].style.opacity = "1";

  if(weeklyScore.filter(x => x !== undefined).length === COUPLE_WEEKLY.length){
    const avg = weeklyScore.reduce((a,b)=>a+b,0)/COUPLE_WEEKLY.length;

    let level, message;

    if(avg < 0.8){
      level = "Nivel de humanidad en el vínculo: Bajo";
      message =
        "El vínculo atraviesa un momento de desconexión emocional. Falta escucha real, presencia afectiva y coherencia en el cuidado mutuo.";
    } else if(avg < 1.5){
      level = "Nivel de humanidad en el vínculo: Medio";
      message =
        "Existe intención de cuidado y conciencia parcial, pero no siempre se traduce en acciones sostenidas.";
    } else {
      level = "Nivel de humanidad en el vínculo: Alto";
      message =
        "El vínculo muestra presencia emocional, escucha activa y coherencia humana sostenida durante la semana.";
    }

    document.getElementById("weeklyBox").innerHTML +=
      `<p><strong>${level}</strong><br>${message}</p>`;
  }
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

/* ======================
   PWA INSTALL
====================== */

let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").style.display = "block";
});

document.getElementById("installBtn")?.addEventListener("click", () => {
  deferredPrompt.prompt();
  deferredPrompt = null;
});
