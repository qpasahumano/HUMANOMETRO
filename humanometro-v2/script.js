/* ================= VOLUMEN 2 ================= */

const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?", "Empatía global"],
      ["Cuando alguien te habla, ¿dejás el celular?", "Presencia humana"],
      ["¿Sentís impulso de involucrarte ante injusticias?", "Compromiso"],
      ["¿Te afecta el sufrimiento ajeno?", "Sensibilidad"]
    ]
  },
  {
    title: "Vos y la tecnología",
    questions: [
      ["¿Podés soltar el celular al compartir?", "Uso consciente"],
      ["¿Controlás el tiempo en pantallas?", "Autocontrol"],
      ["¿Recordás que hay personas reales detrás de una pantalla?", "Empatía digital"],
      ["¿La tecnología acompaña sin absorberte?", "Equilibrio"]
    ]
  },
  {
    title: "Integración humana",
    questions: [
      ["¿Hay coherencia entre lo que pensás y hacés?", "Coherencia"],
      ["¿Podés observarte sin juzgarte?", "Autoconciencia"],
      ["¿Asumís tu impacto en otros?", "Responsabilidad"],
      ["¿Sentís evolución humana?", "Integración"]
    ]
  }
];

let week = 0, q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2() {
  week = 0; q = 0; weeklyScores = []; currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion() {
  const w = WEEKS[week];
  document.getElementById("weekTitle").innerText = w.title;
  document.getElementById("questionText").innerText = w.questions[q][0];
  document.getElementById("questionMeasure").innerText = w.questions[q][1];
  updateThermo();
}

function answer(v) {
  currentScore += v;
  q++;
  updateThermo();
  if (q >= 4) showWeeklyResult();
  else loadQuestion();
}

function showWeeklyResult() {
  show("weeklyResult");
  const avg = currentScore / 4;
  weeklyScores.push(avg);

  let symbol = "🐞", text = "", advice = "";

  if (avg < 0.8) {
    symbol = "🦇";
    text =
      "La semana mostró una desconexión entre lo que sentís y cómo reaccionás.\n" +
      "No implica falta de humanidad, sino dificultad para integrarla en el día a día.";
    advice =
      "Bajar el ritmo y observar sin juicio puede ayudarte a reordenar la experiencia.";
  } else if (avg < 1.5) {
    symbol = "🐞";
    text =
      "Tu humanidad se expresó de forma intermitente.\n" +
      "Hubo presencia, pero no siempre sostenida.";
    advice =
      "Pequeños gestos conscientes pueden convertir momentos aislados en continuidad.";
  } else {
    symbol = "🐦";
    text =
      "La semana mostró coherencia creciente entre emoción y acción.\n" +
      "La experiencia fue habitada con mayor presencia.";
    advice =
      "Sostener esta actitud fortalece la integración humana en el tiempo.";
  }

  document.getElementById("weeklySymbol").innerText = symbol;
  document.getElementById("weeklyText").innerText = text;
  document.getElementById("weeklyAdvice").innerText = advice;
}

function nextWeek() {
  week++; q = 0; currentScore = 0;
  if (week >= WEEKS.length) showMonthlyResult();
  else { show("test"); loadQuestion(); }
}

function showMonthlyResult() {
  show("monthlyResult");

  const avg = weeklyScores.reduce((a,b)=>a+b,0)/weeklyScores.length;

  setTimeout(()=>{
    document.getElementById("monthlyFill").style.height =
      Math.round((avg/2)*100)+"%";
  },300);

  setTimeout(()=>{
    let longText = "";
    let shortText = "";

    if (avg < 0.8) {
      longText =
        "El recorrido completo mostró una desconexión sostenida entre emoción, pensamiento y acción.\n\n" +
        "Las experiencias estuvieron presentes, pero no siempre fueron integradas de manera consciente.\n" +
        "Esto no habla de ausencia de humanidad, sino de una dificultad para habitarla en continuidad.\n\n" +
        "Este resultado invita a detenerse, observar y dar espacio a lo sentido antes de actuar.";
      shortText =
        "Este recorrido reflejó una humanidad en tensión, más reactiva que integrada.";
    } else if (avg < 1.5) {
      longText =
        "El recorrido mostró momentos claros de presencia combinados con automatismos.\n\n" +
        "La conciencia apareció, aunque no siempre se sostuvo en el tiempo.\n" +
        "La humanidad estuvo disponible, pero aún no terminó de consolidarse como hábito.\n\n" +
        "La integración crece cuando lo sentido encuentra espacio antes de convertirse en acción.";
      shortText =
        "Este recorrido reflejó una humanidad en proceso de integración.";
    } else {
      longText =
        "El recorrido mostró coherencia creciente entre lo que sentís, pensás y hacés.\n\n" +
        "Las experiencias fueron integradas con mayor conciencia y presencia.\n" +
        "No desde la perfección, sino desde una actitud atenta y responsable.\n\n" +
        "Este estado fortalece una humanidad vivida de forma consciente y sostenida.";
      shortText =
        "Este recorrido reflejó una humanidad integrada y en expansión.";
    }

    document.getElementById("monthlyLongText").innerText = longText;
    document.getElementById("monthlyText").innerText = shortText;
  },1500);
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  "En estos días, ¿sentiste enojo en algún momento que haya influido en tu forma de actuar?",
  "En estos días, ¿sentiste tristeza que haya condicionado tus decisiones o tu energía?",
  "¿Sentiste miedo (a perder, a equivocarte, a confrontar) que te haya limitado o frenado?",
  "¿Apareció culpa por algo dicho o hecho, que haya quedado sin resolver internamente?",
  "¿Sentiste ansiedad o inquietud que te haya llevado a reaccionar de forma automática?",
  "¿Percibiste momentos de indiferencia o desconexión emocional frente a personas o situaciones importantes?",
  "¿Experimentaste alegría o bienestar genuino que haya sido coherente con lo que estabas viviendo?",
  "Mirando estos días en conjunto, ¿hubo alguna emoción dominante que no supiste nombrar o preferiste evitar?"
];

let mq = 0;
let mirrorScore = 0;
let mirrorCount = 0;

function openMirror() {
  show("mirrorIntro");
}

function startMirror() {
  mq = 0; mirrorScore = 0; mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion() {
  document.getElementById("mirrorQuestion").innerText =
    MIRROR_QUESTIONS[mq];
}

function answerMirror(v) {
  if (v !== null) {
    mirrorScore += v;
    mirrorCount++;
  }
  mq++;
  if (mq >= MIRROR_QUESTIONS.length) showMirrorResult();
  else loadMirrorQuestion();
}

function showMirrorResult() {
  show("mirrorResult");

  const avg = mirrorCount === 0 ? 0 : mirrorScore / mirrorCount;

  let fullText = "";

  if (avg < 1.3) {
    fullText =
      "El manómetro refleja una humanidad atravesada por emociones que no terminaron de integrarse.\n\n" +
      "Las reacciones estuvieron presentes, pero la conciencia apareció de forma tardía o fragmentada.\n" +
      "Esto no implica pérdida de humanidad, sino una desconexión temporal entre sentir, pensar y actuar.\n\n" +
      "La integración comienza cuando se le da espacio a la emoción antes de que se transforme en respuesta automática.";
  } else if (avg < 2.3) {
    fullText =
      "El manómetro muestra una humanidad en estado intermedio de integración.\n\n" +
      "Hubo momentos claros de presencia y otros dominados por el automatismo.\n" +
      "La conciencia estuvo disponible, aunque no siempre se sostuvo en el tiempo.\n\n" +
      "Fortalecer la observación interna permite que la experiencia se convierta en aprendizaje.";
  } else {
    fullText =
      "El manómetro refleja una humanidad integrada de forma consciente.\n\n" +
      "Las emociones fueron reconocidas y dialogaron con el pensamiento y la acción.\n" +
      "La experiencia no fue evitada ni reprimida, sino habitada.\n\n" +
      "Este estado no es un punto final, sino una práctica que se fortalece con presencia sostenida.";
  }

  document.getElementById("mirrorFullText").innerText =
    fullText + "\n\nLa humanidad no se pierde, pero se apaga cuando no se la habita conscientemente.";

  setTimeout(()=>{
    document.getElementById("mirrorFill").style.height =
      Math.round((avg/2)*100)+"%";
  },300);
}

/* ================= UTILIDADES ================= */

function updateThermo() {
  document.getElementById("thermoFill").style.width =
    (q/4)*100+"%";
}

function show(id) {
  [
    "start","test","weeklyResult","monthlyResult",
    "mirrorIntro","mirrorTest","mirrorResult"
  ].forEach(s=>{
    const el=document.getElementById(s);
    if(el) el.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function restart() {
  show("start");
}
