/* ===============================
   REVISIÓN SEMANAL PREMIUM
   =============================== */

const WEEKLY_QUESTIONS = [
  { area: "Familia", text: "¿Estuviste presente emocionalmente para tu familia esta semana?" },
  { area: "Familia", text: "¿Escuchaste sin reaccionar automáticamente?" },

  { area: "Social", text: "¿Fuiste respetuoso incluso cuando no coincidías?" },
  { area: "Social", text: "¿Te expresaste con honestidad y empatía?" },

  { area: "Laboral", text: "¿Actuaste con coherencia entre lo que pensás y hacés?" },
  { area: "Laboral", text: "¿Respetaste tus propios límites laborales?" },

  { area: "Planeta", text: "¿Tomaste decisiones conscientes respecto al entorno?" },
  { area: "Planeta", text: "¿Mostraste respeto por otras formas de vida?" },

  { area: "Pareja", text: "¿Fuiste claro y honesto con tus emociones?" },
  { area: "Pareja", text: "¿Escuchaste sin intentar corregir?" },

  { area: "Conciencia", text: "¿Actuaste desde el amor más que desde el miedo?" },
  { area: "Conciencia", text: "¿Asumiste responsabilidad por tus acciones?" },

  { area: "Coherencia", text: "¿Hubo coherencia entre tus valores y tus actos?" },
  { area: "Coherencia", text: "¿Fuiste fiel a vos mismo?" },

  { area: "Integración", text: "¿Sentís que creciste humanamente esta semana?" }
];

function getWeeklyQuestions() {
  const now = new Date();
  const weekKey = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;

  const saved = JSON.parse(localStorage.getItem("weeklyProgress")) || {};

  if (saved.week === weekKey) {
    return saved.questions;
  }

  const shuffled = [...WEEKLY_QUESTIONS].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  localStorage.setItem("weeklyProgress", JSON.stringify({
    week: weekKey,
    questions: selected,
    answers: []
  }));

  return selected;
}

function saveWeeklyAnswer(value) {
  const data = JSON.parse(localStorage.getItem("weeklyProgress"));
  data.answers.push(value);
  localStorage.setItem("weeklyProgress", JSON.stringify(data));
}

function getWeeklyResult() {
  const data = JSON.parse(localStorage.getItem("weeklyProgress"));
  if (!data || data.answers.length === 0) return null;

  const avg = data.answers.reduce((a,b)=>a+b,0) / data.answers.length;

  if (avg >= 1.6) return "Tu humanidad esta semana se mantuvo en equilibrio.";
  if (avg >= 1) return "Hubo tensiones humanas esta semana. Hay conciencia.";
  return "Esta semana fue desafiante. Hay aprendizaje en curso.";
}
