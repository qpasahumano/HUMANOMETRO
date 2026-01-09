let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};
let weeklyScore = [];

/* ======================
   MÓDULOS (PREGUNTAS REFORMULADAS)
====================== */

const BASE_MODULES = [
  { name: "Familia", questions: [
    "¿Estás emocionalmente disponible para tu familia?",
    "¿Escuchás a tu familia sin juzgar ni corregir?",
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
    "¿Tomás decisiones justas en tu trabajo incluso cuando nadie controla?",
    "¿Mantenés coherencia entre tus valores y tus acciones laborales?",
    "¿Evitás beneficiarte a costa de otros en tu trabajo?"
  ]},
  { name: "Planeta", questions: [
    "Si te encontraras con un animal en una situación S.O.S (urgencia), ¿accionarías?",
    "¿Realizás acciones concretas para cuidar el entorno donde vivís?",
    "¿Intentás reducir tu impacto ambiental en lo cotidiano?"
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
   REVISIÓN SEMANAL (PAREJA)
====================== */

const COUPLE_WEEKLY = [
  "Esta semana, ¿escuchaste a tu pareja sin preparar tu respuesta?",
  "Durante un conflicto, ¿pudiste evitar guardar rencor?",
  "¿Intentaste empatizar con lo que le estaba pasando a tu pareja?",
  "¿Cuidaste el vínculo incluso cuando hubo tensión o desacuerdo?"
];

/* ======================
   FLUJO DEL TEST
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
  document.getElementById("questionText").innerText =
    mod.questions[currentQuestion];
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
   DEVOLUCIONES HUMANAS
====================== */

function commonFeedback(avg){
  if(avg < 40){
    return "Las respuestas reflejan una distancia entre valores internos y acciones sostenidas. Hay conciencia, pero cuesta mantenerla presente en lo cotidiano.";
  }
  if(avg < 70){
    return "Existe sensibilidad humana y reflexión, aunque la coherencia fluctúa según el contexto emocional y las circunstancias.";
  }
  return "Las decisiones muestran una conciencia humana activa, con una alineación creciente entre pensamiento, emoción y acción.";
}

function premiumFeedback(area, percent){
  const texts = {
    low: [
      `En ${area}, aparece un conflicto interno entre intención y acción.`,
      `En ${area}, el automatismo emocional suele imponerse.`,
      `En ${area}, hay valores claros pero dificultad para sostenerlos.`
    ],
    mid: [
      `En ${area}, la conciencia está presente pero es inestable.`,
      `En ${area}, la coherencia depende del estado emocional.`,
      `En ${area}, hay intención genuina, aunque fluctuante.`
    ],
    high: [
      `En ${area}, existe alineación interna y presencia consciente.`,
      `En ${area}, las decisiones reflejan responsabilidad emocional.`,
      `En ${area}, la coherencia se sostiene incluso en la incomodidad.`
    ]
  };

  const group = percent < 40 ? "low" : percent < 70 ? "mid" : "high";
  return texts[group][Math.floor(Math.random() * texts[group].length)];
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
    const percent = Math.round((scores[m.name] / max) * 100);
    total += percent;

    circles.innerHTML += `
      <div class="circle ${percent < 40 ? "low" : percent < 70 ? "mid" : "high"}">
        <strong>${percent}%</strong><small>${m.name}</small>
      </div>`;

    if(mode === "premium"){
      tips.innerHTML += `<li>${premiumFeedback(m.name, percent)}</li>`;
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

    tips.innerHTML +=
      `<li><strong>Lectura integral:</strong> La coherencia se expresa como un proceso interno sostenido, no como una respuesta aislada.</li>`;

    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Desbloquear revisión semanal";
    btn.onclick = startWeeklyReview;

    const note = document.createElement("p");
    note.className = "legal";
    note.innerText =
      "Semana a semana mediremos juntos tu nivel de conciencia humana en los vínculos emocionales de pareja y en otras situaciones vividas. " +
      "Yo te haré preguntas y vos responderás en base a lo que realmente experimentaste.";

    const box = document.createElement("div");
    box.id = "weeklyBox";

    results.appendChild(btn);
    results.appendChild(note);
    results.appendChild(box);
  }
}

/* ======================
   TERMÓMETRO
====================== */

function updateThermometer(){
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

/* ======================
   SEMANAL (FUNCIONAL)
====================== */

function startWeeklyReview(){
  weeklyScore = [];
  const box = document.getElementById("weeklyBox");
  box.innerHTML = "<h3>Revisión semanal de vínculo de pareja</h3>";

  COUPLE_WEEKLY.forEach((q,i)=>{
    box.innerHTML += `
      <p>${q}</p>
      <div class="answers">
        <button onclick="weeklyAnswer(${i},2)">Sí</button>
        <button onclick="weeklyAnswer(${i},1)">Tal vez / A veces</button>
        <button onclick="weeklyAnswer(${i},0)">No</button>
      </div>`;
  });
}

function weeklyAnswer(i,v){
  weeklyScore[i] = v;

  if(weeklyScore.filter(x => x !== undefined).length === COUPLE_WEEKLY.length){
    const avg = weeklyScore.reduce((a,b)=>a+b,0)/COUPLE_WEEKLY.length;

    const msg =
      avg < 0.8
        ? "El vínculo atraviesa una semana de desconexión emocional. Predominan reacciones defensivas."
        : avg < 1.5
        ? "Hay intención de cuidado, aunque la coherencia emocional fue intermitente."
        : "El vínculo mostró presencia, empatía y cuidado mutuo durante la semana.";

    document.getElementById("weeklyBox").innerHTML +=
      `<p><strong>Nivel de humanidad en el vínculo:</strong><br>${msg}</p>`;
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
