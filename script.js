let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

/* ===============================
   TEST PRINCIPAL
================================ */

const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estás emocionalmente presente con tu familia?", n: "Se mide presencia." },
    { q: "¿Escuchás sin juzgar?", n: "Se mide apertura." },
    { q: "¿Expresás afecto sin que te lo pidan?", n: "Se mide intención." }
  ]},
  { name: "Social", questions: [
    { q: "¿Tratás a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchás opiniones distintas?", n: "Se mide tolerancia." },
    { q: "¿Actuás con empatía en lo público?", n: "Se mide conciencia social." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Actuás con coherencia entre lo que sentís y hacés?", n: "Se mide alineación interna." },
    { q: "¿Te responsabilizás de tu impacto en otros?", n: "Se mide madurez emocional." }
  ]}
];

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
  document.getElementById("questionText").innerText = mod.questions[currentQuestion].q;
  document.getElementById("questionNote").innerText = mod.questions[currentQuestion].n;
}

function answer(v){
  const mod = modules[currentModule];
  scores[mod.name] += v;
  currentQuestion++;

  if(currentQuestion >= mod.questions.length){
    currentQuestion = 0;
    currentModule++;
  }

  if(currentModule >= modules.length) showResults();
  else {
    showQuestion();
    updateThermometer();
  }
}

function updateThermometer(){
  const totalQ = modules.reduce((s,m)=>s+m.questions.length,0);
  const answered =
    modules.slice(0,currentModule).reduce((s,m)=>s+m.questions.length,0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered/totalQ)*100) + "%";
}

function showResults(){
  showSection("results");
  const circles = document.getElementById("circles");
  const tips = document.getElementById("tips");
  circles.innerHTML = "";
  tips.innerHTML = "";

  let total = 0;

  modules.forEach(m=>{
    const max = m.questions.length*2;
    const percent = Math.round((scores[m.name]/max)*100);
    total += percent;

    const div = document.createElement("div");
    div.className = "circle";
    div.style.background =
      percent<40 ? "#e74c3c" : percent<70 ? "#f1c40f" : "#2ecc71";
    div.innerHTML = `<strong>${percent}%</strong><small>${m.name}</small>`;
    circles.appendChild(div);
  });

  const avg = Math.round(total/modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  if(mode==="premium"){
    const btn = document.createElement("button");
    btn.className = "premium";
    btn.innerText = "Conteo semanal";
    btn.onclick = startWeekly;
    document.getElementById("results").appendChild(btn);
  }
}

/* ===============================
   CONTEO SEMANAL RESTAURADO
================================ */

let weeklyIndex = 0;
let weeklyScores = [];

const WEEKLY_QUESTIONS = [
  { q:"¿Estás reaccionando con calma ante tensiones con algún vínculo cercano?", n:"Se mide regulación emocional." },
  { q:"¿Expresás lo que sentís sin guardar rencor?", n:"Se mide coherencia emocional." },
  { q:"¿Actuás con empatía ante diferencias?", n:"Se mide humanidad." },
  { q:"¿Cuidás tu energía emocional en tus responsabilidades?", n:"Se mide conciencia personal." }
];

function startWeekly(){
  weeklyIndex = 0;
  weeklyScores = [];
  showSection("test");
  document.getElementById("areaTitle").innerText = "Conteo semanal";
  showWeeklyQuestion();
}

function showWeeklyQuestion(){
  const q = WEEKLY_QUESTIONS[weeklyIndex];
  document.getElementById("questionText").innerText = q.q;
  document.getElementById("questionNote").innerText = q.n;
}

function weeklyAnswer(v){
  weeklyScores.push(v);
  weeklyIndex++;
  if(weeklyIndex >= WEEKLY_QUESTIONS.length) finishWeekly();
  else showWeeklyQuestion();
}

function finishWeekly(){
  showSection("results");

  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;
  const face = avg<0.8?"🙁":avg<1.5?"😐":"🙂";

  document.getElementById("circles").innerHTML =
    `<div class="circle">${face}</div>`;

  const btn = document.createElement("button");
  btn.innerText = "Guardar conteo semanal";
  btn.onclick = ()=>alert("Conteo semanal guardado");

  document.getElementById("results").appendChild(btn);
}

function restart(){ showSection("start"); }
function showPrivacy(){ showSection("privacy"); }

function showSection(id){
  ["start","test","results","privacy"].forEach(s=>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
