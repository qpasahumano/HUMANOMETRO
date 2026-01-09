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

const WEEKLY_BANK = {
  familia: [
    "¿Estuviste realmente presente para tu familia esta semana?",
    "¿Escuchaste más de lo que hablaste en tu entorno familiar?"
  ],
  social: [
    "¿Tu trato social fue empático?",
    "¿Evitaste juzgar automáticamente?"
  ],
  laboral: [
    "¿Actuaste con coherencia laboral?"
  ],
  planeta: [
    "¿Tomaste decisiones conscientes respecto al consumo?"
  ]
};

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

function showResults() {
  showSection("results");

  const circles = document.getElementById("circles");
  circles.innerHTML = "";

  let total = 0;

  modules.forEach(m => {
    const max = m.questions.length * 2;
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle " + (percent < 40 ? "low" : percent < 70 ? "mid" : "high");
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  document.getElementById("globalResult").innerText =
    "Humanidad global: " + Math.round(total / modules.length) + "%";

  document.getElementById("coherenceResult").innerText = "";

  document.getElementById("premiumNote")
    .classList.toggle("hidden", mode !== "premium");
}

function updateThermometer() {
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered = modules
    .slice(0,currentModule)
    .reduce((s,m)=>s+m.questions.length,0) + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100) + "%";
}

function startWeeklyReview() {
  mode = "premium";
  showSection("results");

  weeklyScore = [];
  const entries = Object.entries(WEEKLY_BANK).flatMap(([area, qs]) =>
    qs.map(q => ({ area, text: q }))
  ).slice(0,3);

  let html = `<div id="weeklyBox"><h3>Revisión semanal de humanidad</h3>`;

  entries.forEach((q,i) => {
    html += `
      <p><strong>${q.area.toUpperCase()}</strong>: ${q.text}</p>
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
  weeklyScore[i]=v;
  if(weeklyScore.filter(x=>x!==undefined).length===3){
    document.getElementById("weeklyBox").innerHTML +=
      `<p><strong>Tendencia semanal registrada.</strong></p>`;
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
