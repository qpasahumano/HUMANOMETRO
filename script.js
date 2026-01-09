let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let weeklyScore = [];

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

/* === DEVOLUCIONES === */

function generalCommonFeedback(avg){
  if(avg < 40) return "Hay una desconexión general entre intención y acción. Tomar conciencia es el primer paso.";
  if(avg < 70) return "Hay humanidad presente, pero aún falta coherencia sostenida.";
  return "Tu humanidad está activa. Sostené este nivel con conciencia diaria.";
}

function intrapersonalPremium(area, percent){
  if(percent < 40) return `En ${area}, estás actuando en automático. Falta presencia real.`;
  if(percent < 70) return `En ${area}, hay intención consciente, pero aún no es constante.`;
  return `En ${area}, hay coherencia interna y acción alineada.`;
}

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
    const li = document.createElement("li");
    li.innerText = generalCommonFeedback(avg);
    tips.appendChild(li);
  }

  if(mode === "premium"){
    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Desbloquear revisión semanal";
    btn.onclick = startWeeklyReview;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Descubrí tu grado real de evolución emocional en tus vínculos de pareja. " +
      "Seguimiento semanal profundo y personalizado. Servicio preferencial con costo.";

    document.getElementById("results").appendChild(btn);
    document.getElementById("results").appendChild(note);
  }
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100) + "%";
}

/* === SEMANAL PAREJA === */

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

function weeklyAnswer(i,v){
  weeklyScore[i] = v;

  if(weeklyScore.filter(x=>x!==undefined).length === COUPLE_WEEKLY.length){
    const avg = weeklyScore.reduce((a,b)=>a+b,0)/COUPLE_WEEKLY.length;

    let msg = avg < 0.8
      ? "Vínculo en estado de desconexión emocional."
      : avg < 1.5
      ? "Vínculo inestable: conciencia parcial sin sostén."
      : "Vínculo consciente con base emocional sólida.";

    document.getElementById("weeklyBox").innerHTML +=
      `<p><strong>Lectura de vínculo:</strong><br>${msg}</p>`;
  }
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
