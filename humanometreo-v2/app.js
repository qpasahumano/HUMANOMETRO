/* CONFIG */
const LOCK_DAYS = 7;
const STATE_KEY = "humanometro_v2_state";

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
      { q:"¿Sentís que tu vida tiene sentido?", m:"Propósito vital." }
    ]
  }
];

let state = JSON.parse(localStorage.getItem(STATE_KEY)) || {
  currentWeek: 0,
  lastDate: null,
  scores: []
};

let qIndex = 0;

/* DOM */
const intro = document.getElementById("intro");
const weekBox = document.getElementById("week");
const weekTitle = document.getElementById("weekTitle");
const question = document.getElementById("question");
const measure = document.getElementById("measure");
const thermo = document.getElementById("thermoFill");
const micro = document.getElementById("micro");
const microText = document.getElementById("microText");
const microAdvice = document.getElementById("microAdvice");

/* START */
function startV2(){
  intro.classList.add("hidden");
  checkWeek();
}

function checkWeek(){
  if(state.currentWeek > 0 && state.lastDate){
    const days = (Date.now() - state.lastDate) / (1000*60*60*24);
    if(days < LOCK_DAYS){
      alert("El próximo bloque se habilita cuando se complete el ciclo semanal.");
      return;
    }
  }
  startWeek();
}

function startWeek(){
  qIndex = 0;
  weekTitle.innerText = WEEKS[state.currentWeek].title;
  showQuestion();
  weekBox.classList.remove("hidden");
}

function showQuestion(){
  const q = WEEKS[state.currentWeek].questions[qIndex];
  question.innerText = q.q;
  measure.innerText = "Mide: " + q.m;
  micro.classList.add("hidden");
}

function answer(v){
  state.scores.push(v);
  thermo.style.width = Math.round((state.scores.length / 12) * 100) + "%";

  microText.innerText = "Registrar esto ya es un movimiento de conciencia.";
  microAdvice.innerText = "Observar este aspecto puede ayudarte a crecer.";
  micro.classList.remove("hidden");
}

function next(){
  qIndex++;
  if(qIndex >= WEEKS[state.currentWeek].questions.length){
    state.currentWeek++;
    state.lastDate = Date.now();
    localStorage.setItem(STATE_KEY, JSON.stringify(state));

    if(state.currentWeek >= WEEKS.length){
      showMonthly();
      return;
    }
    checkWeek();
  } else {
    showQuestion();
  }
}

function showMonthly(){
  weekBox.classList.add("hidden");
  const monthly = document.getElementById("monthly");
  const fill = document.getElementById("verticalFill");
  const text = document.getElementById("monthlyText");

  monthly.classList.remove("hidden");

  const avg = state.scores.reduce((a,b)=>a+b,0)/state.scores.length;
  fill.style.height = Math.round((avg/2)*100) + "%";

  setTimeout(()=>{
    text.innerText =
      avg > 1.5 ? "Tu humanidad mostró integración y presencia."
      : avg > .8 ? "Tu humanidad estuvo activa, aunque inestable."
      : "Tu humanidad necesita pausa y revisión.";
    text.classList.remove("hidden");
  }, 3200);
    }
