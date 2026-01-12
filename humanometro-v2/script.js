const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Mide empatía global."],
      ["Cuando alguien te habla, ¿dejás el celular?", "Mide presencia humana."],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Mide compromiso humano."],
      ["¿Te afecta el sufrimiento ajeno?", "Mide sensibilidad emocional."]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Mide uso consciente."],
      ["¿Controlás el tiempo en pantallas?", "Mide autocontrol digital."],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Mide empatía digital."],
      ["¿La tecnología acompaña sin absorberte?", "Mide equilibrio tecnológico."]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Mide alineación interna."],
      ["¿Podés observarte sin juzgarte?", "Mide autoconciencia."],
      ["¿Asumís tu impacto en otros?", "Mide responsabilidad."],
      ["¿Sentís que tu humanidad evolucionó?", "Mide integración global."]
    ]
  }
];

let week = 0, q = 0, scores = [], current = [];

function startV2() {
  q = 0;
  current = [];
  show("week");
  loadQuestion();
}

function loadQuestion() {
  const data = WEEKS[week].questions[q];
  document.getElementById("weekTitle").innerText = WEEKS[week].title;
  document.getElementById("questionText").innerText = data[0];
  document.getElementById("questionMeasure").innerText = data[1];
}

function answer(v) {
  current.push(v);
  q++;
  document.getElementById("thermoFill").style.width = (q / 4) * 100 + "%";

  if (q >= 4) return showWeekly();
  loadQuestion();
}

function showWeekly() {
  const avg = current.reduce((a,b)=>a+b,0)/4;
  scores.push(avg);

  let animal="🐞", text="", advice="";

  if (avg < .8) { animal="🦇"; text="Humanidad retraída."; advice="Detenerte y observar puede reactivar sensibilidad."; }
  else if (avg < 1.5) { animal="🐞"; text="Humanidad estable."; advice="Pequeños gestos pueden impulsarte."; }
  else { animal="🐦"; text="Humanidad en crecimiento."; advice="Sostener esta coherencia fortalece tu camino."; }

  document.getElementById("animal").innerText = animal;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;

  show("weeklyResult");
}

function continueFlow() {
  week++;
  q = 0;
  if (week >= WEEKS.length) return showMonthly();
  startV2();
}

function showMonthly() {
  show("monthlyResult");
  const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
  setTimeout(()=> {
    document.getElementById("monthlyFill").style.height = (avg/2)*100 + "%";
  }, 500);

  setTimeout(()=> {
    document.getElementById("monthlyText").innerText =
      avg < .8 ? "Humanidad dormida." :
      avg < 1.5 ? "Humanidad estable." :
      "Humanidad en expansión.";
    document.getElementById("monthlyAdvice").innerText =
      "Tomá conciencia de un gesto concreto para elevar tu humanidad.";
  }, 3500);
}

function show(id) {
  ["start","week","weeklyResult","monthlyResult"].forEach(s =>
    document.getElementById(s).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");
    }
