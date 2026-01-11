/* CONFIG */
const WEEK_LOCK_DAYS = 7;
const LOCK_KEY = "humanometro_v2_week";

/* DATA */
const WEEKS = [
  {
    title: "Vos ante el mundo",
    questions: [
      { q:"¿Una noticia de sufrimiento global te genera empatía?", m:"Empatía global." },
      { q:"¿Te involucrás emocionalmente ante injusticias?", m:"Sensibilidad humana." },
      { q:"¿Sentís tristeza ante el dolor ajeno?", m:"Conexión emocional." },
      { q:"¿Creés que tus acciones influyen en el mundo?", m:"Responsabilidad colectiva." }
    ]
  },
  {
    title: "Vos y el mundo digital",
    questions: [
      { q:"¿Podés soltar el celular cuando estás con otros?", m:"Presencia consciente." },
      { q:"¿Controlás el tiempo en pantalla?", m:"Autonomía digital." },
      { q:"¿Recordás que hay personas detrás de una pantalla?", m:"Empatía digital." },
      { q:"¿La tecnología te sirve más de lo que te absorbe?", m:"Equilibrio tecnológico." }
    ]
  },
  {
    title: "Vos con vos mismo",
    questions: [
      { q:"¿Te sentís cómodo en silencio con vos?", m:"Autoobservación." },
      { q:"¿Hay coherencia entre pensar, sentir y hacer?", m:"Integración interna." },
      { q:"¿Podés equivocarte sin castigarte?", m:"Madurez emocional." },
      { q:"¿Tu vida tiene sentido para vos?", m:"Propósito vital." }
    ]
  }
];

let week = 0, qIndex = 0, score = [];

/* DOM */
const weekBox = document.getElementById("week");
const title = document.getElementById("weekTitle");
const question = document.getElementById("questionText");
const measure = document.getElementById("questionMeasure");
const thermo = document.getElementById("thermoFill");
const feedbackBox = document.getElementById("microFeedback");
const feedback = document.querySelector(".feedback");
const advice = document.querySelector(".advice");

/* INIT */
startWeek();

function startWeek(){
  title.innerText = WEEKS[week].title;
  showQuestion();
  weekBox.classList.remove("hidden");
}

function showQuestion(){
  const q = WEEKS[week].questions[qIndex];
  question.innerText = q.q;
  measure.innerText = "Mide: " + q.m;
  feedbackBox.classList.add("hidden");
}

function answer(v){
  score.push(v);
  thermo.style.width = Math.round((score.length / 12) * 100) + "%";

  feedback.innerText = "Registrar esto ya es un movimiento de conciencia.";
  advice.innerText = "Observar este aspecto puede ayudarte a crecer.";
  feedbackBox.classList.remove("hidden");
}

function next(){
  qIndex++;
  if(qIndex >= WEEKS[week].questions.length){
    week++;
    qIndex = 0;
    saveLock();
    if(week >= WEEKS.length){
      showMonthly();
      return;
    }
  }
  showQuestion();
}

function saveLock(){
  localStorage.setItem(LOCK_KEY, Date.now());
}

function showMonthly(){
  document.getElementById("week").classList.add("hidden");
  document.getElementById("monthly").classList.remove("hidden");

  const avg = score.reduce((a,b)=>a+b,0) / score.length;
  const fill = document.getElementById("verticalFill");
  fill.style.height = Math.round((avg/2)*100) + "%";

  setTimeout(()=>{
    document.getElementById("monthlyText").innerText =
      avg > 1.5 ? "Tu humanidad mostró integración y presencia."
      : avg > .8 ? "Tu humanidad estuvo activa, aunque inestable."
      : "Tu humanidad necesita pausa y revisión.";
    document.getElementById("monthlyText").classList.remove("hidden");
  }, 3200);
}
