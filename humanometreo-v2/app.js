let v2Index = 0;
let v2Scores = [];

const V2_QUESTIONS = [
  {
    q: "Cuando ves noticias de guerras o sufrimiento humano en el mundo, ¿te generan una emoción real?",
    n: "Mide empatía global y sensibilidad humana."
  },
  {
    q: "Cuando una persona te habla o te cuenta algo importante, ¿dejás el celular de lado?",
    n: "Mide presencia consciente y respeto interpersonal."
  },
  {
    q: "Cuando ves una situación de riesgo o maltrato hacia un animal, ¿sentís impulso de involucrarte?",
    n: "Mide empatía activa y coherencia ética."
  },
  {
    q: "Cuando presenciás una injusticia cotidiana, ¿te cuestionás tu rol en ese entorno?",
    n: "Mide conciencia social y responsabilidad personal."
  }
];

function updateV2() {
  document.getElementById("v2Question").innerText = V2_QUESTIONS[v2Index].q;
  document.getElementById("v2Note").innerText = V2_QUESTIONS[v2Index].n;
  document.getElementById("v2ThermoFill").style.width =
    Math.round((v2Scores.length / V2_QUESTIONS.length) * 100) + "%";
}

function v2Answer(val) {
  v2Scores.push(val);
  v2Index++;

  if (v2Index >= V2_QUESTIONS.length) {
    showV2Result();
  } else {
    updateV2();
  }
}

function showV2Result() {
  const avg = v2Scores.reduce((a,b)=>a+b,0) / v2Scores.length;

  let animal, text, advice;

  if (avg < .8) {
    animal = "🦇";
    text = "Se percibe una desconexión emocional con el entorno.";
    advice = "Recuperar sensibilidad comienza por permitirte sentir sin huir.";
  } else if (avg < 1.5) {
    animal = "🐞";
    text = "Tu humanidad se mantiene estable.";
    advice = "Pequeños gestos conscientes pueden reactivar tu impacto humano.";
  } else {
    animal = "🐦";
    text = "Tu humanidad está despierta y en expansión.";
    advice = "Sostener esta coherencia amplifica tu vínculo con el mundo.";
  }

  document.getElementById("v2Animal").innerText = animal;
  document.getElementById("v2Text").innerText = text;
  document.getElementById("v2Advice").innerText = advice;
  document.getElementById("v2Result").classList.remove("hidden");
}

updateV2();
