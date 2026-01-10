let mode = "common";
let currentModule = 0;
let currentQuestion = 0;
let modules = [];
let scores = {};

const BASE_MODULES = [
  { name: "Familia", questions: [
    { q: "¿Estuviste emocionalmente presente con tu familia?", n: "Aquí se mide presencia, no perfección." },
    { q: "¿Escuchaste sin juzgar?", n: "No se mide acuerdo, se mide apertura." },
    { q: "¿Expresaste afecto sin que te lo pidan?", n: "Se observa intención genuina." }
  ]},
  { name: "Social", questions: [
    { q: "¿Trataste a las personas con respeto?", n: "Se mide trato humano." },
    { q: "¿Escuchaste opiniones distintas a la tuya?", n: "No se juzga la idea, se mide tolerancia." },
    { q: "¿Actuaste con empatía en espacios públicos?", n: "Se observa conciencia social." }
  ]},
  { name: "Amistad", questions: [
    { q: "¿Estuviste presente para tus amistades?", n: "Presencia real, no disponibilidad constante." },
    { q: "¿Cuidaste el vínculo aun cuando pensaban distinto?", n: "Se mide cuidado del lazo, no coincidencia." },
    { q: "¿Escuchaste sin imponer tu visión?", n: "Se mide respeto mutuo." }
  ]},
  { name: "Laboral", questions: [
    { q: "¿Generaste buen clima laboral aun cuando no estabas cómodo?", n: "Se observa responsabilidad humana." },
    { q: "¿Respetaste a tus compañeros?", n: "No se mide simpatía, se mide trato." },
    { q: "¿Evitaste sobrecargar a otros con tu función?", n: "Se mide equidad y conciencia colectiva." }
  ]},
  { name: "Planeta", questions: [
    { q: "¿Reconociste a los animales como seres sensibles?", n: "Se mide empatía, no acción perfecta." },
    { q: "¿Cuidaste el entorno inmediato donde vivís?", n: "Se observa conciencia cotidiana." },
    { q: "¿Reduciste tu impacto ambiental cuando estuvo a tu alcance?", n: "Se mide intención posible." }
  ]}
];

const PREMIUM_MODULES = [
  { name: "Conciencia Profunda", questions: [
    { q: "¿Tomaste decisiones desde la conciencia y no desde el impulso?", n: "Se mide atención interna." },
    { q: "¿Fuiste coherente entre lo que pensaste y lo que hiciste?", n: "No se juzga error, se mide alineación." },
    { q: "¿Asumiste responsabilidad por tu impacto en otros?", n: "Se observa madurez emocional." }
  ]}
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
  document.getElementById("questionText").innerText = mod.questions[currentQuestion].q;
  document.getElementById("questionNote").innerText = mod.questions[currentQuestion].n;
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

    if (mode === "premium") {
      const li = document.createElement("li");
      if (percent < 40) {
        li.innerText = `En ${m.name}, hay desconexión interna. Observar sin juzgar es el primer paso para recuperar coherencia.`;
      } else if (percent < 70) {
        li.innerText = `En ${m.name}, existe intención consciente, pero aún es inestable. Sostener la atención puede fortalecerla.`;
      } else {
        li.innerText = `En ${m.name}, hay coherencia y presencia humana. Continuar así refuerza tu equilibrio interno.`;
      }
      tips.appendChild(li);
    }
  });

  const avg = Math.round(total / modules.length);
  document.getElementById("globalResult").innerText =
    "Humanidad global: " + avg + "%";

  if (mode === "common") {
    const li = document.createElement("li");
    if (avg < 40) {
      li.innerText = "Predomina una desconexión entre intención y acción. La conciencia comienza al reconocerlo.";
    } else if (avg < 70) {
      li.innerText = "Existe sensibilidad humana, pero aún fluctúa. Observar tus reacciones puede ayudarte a estabilizarla.";
    } else {
      li.innerText = "Tu nivel de humanidad es coherente. Hay presencia entre lo que sentís, pensás y hacés.";
    }
    tips.appendChild(li);
  }
}

function updateThermometer() {
  const totalQ = modules.reduce((s, m) => s + m.questions.length, 0);
  const answered =
    modules.slice(0, currentModule).reduce((s, m) => s + m.questions.length, 0)
    + currentQuestion;

  document.getElementById("thermoFill").style.width =
    Math.round((answered / totalQ) * 100) + "%";
}

function restart() { showSection("start"); }
function showPrivacy() { showSection("privacy"); }

function showSection(id) {
  ["start", "test", "results", "privacy"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
}
