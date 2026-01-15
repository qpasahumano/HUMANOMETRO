/* ================= VOLUMEN 2 ================= */

const WEEKS = [
  { title:"Vos ante el mundo", questions:[
    ["Cuando ves noticias de guerras o conflictos, ¿te genera tristeza?","Empatía global"],
    ["Cuando alguien te habla, ¿dejás el celular?","Presencia humana"],
    ["¿Sentís impulso de involucrarte ante injusticias?","Compromiso humano"],
    ["¿Te afecta el sufrimiento ajeno?","Sensibilidad emocional"]
  ]},
  { title:"Vos y la tecnología", questions:[
    ["¿Podés soltar el celular al compartir?","Uso consciente"],
    ["¿Controlás el tiempo en pantallas?","Autocontrol digital"],
    ["¿Recordás que hay personas reales detrás de una pantalla?","Empatía digital"],
    ["¿La tecnología acompaña sin absorberte?","Equilibrio tecnológico"]
  ]},
  { title:"Integración humana", questions:[
    ["¿Hay coherencia entre lo que pensás y hacés?","Coherencia"],
    ["¿Podés observarte sin juzgarte?","Autoconciencia"],
    ["¿Asumís tu impacto en otros?","Responsabilidad"],
    ["¿Sentís evolución humana?","Integración"]
  ]}
];

let week = 0;
let q = 0;
let weeklyScores = [];
let currentScore = 0;

function startV2(){
  week = 0; q = 0; weeklyScores = []; currentScore = 0;
  show("test");
  loadQuestion();
}

function loadQuestion(){
  const w = WEEKS[week];
  weekTitle.innerText = w.title;
  questionText.innerText = w.questions[q][0];
  questionMeasure.innerText = w.questions[q][1];
  updateThermo();
}

function answer(v){
  currentScore += v;
  q++;
  updateThermo();
  q >= 4 ? showWeeklyResult() : loadQuestion();
}

function showWeeklyResult(){
  show("weeklyResult");
  const avg = currentScore / 4;
  weeklyScores.push(avg);

  if(avg < 0.8){
    weeklySymbol.innerText = "🦇";
    weeklyText.innerText = "Desconexión entre emoción y acción.";
    weeklyAdvice.innerText = "Observar sin juicio ayuda a integrar.";
  } else if(avg < 1.5){
    weeklySymbol.innerText = "🐞";
    weeklyText.innerText = "Presencia intermitente.";
    weeklyAdvice.innerText = "Sostener pequeños gestos consolida coherencia.";
  } else {
    weeklySymbol.innerText = "🐦";
    weeklyText.innerText = "Crecimiento sostenido.";
    weeklyAdvice.innerText = "La coherencia fortalece el proceso humano.";
  }
}

function nextWeek(){
  week++;
  q = 0;
  currentScore = 0;
  week >= WEEKS.length ? showMonthlyResult() : (show("test"), loadQuestion());
}

/* ===== TERMÓMETRO MENSUAL ===== */

function showMonthlyResult(){
  show("monthlyResult");
  monthTextWrap.classList.add("hidden");
  monthGaugeWrap.classList.remove("hidden");

  const avg = weeklyScores.reduce((a,b)=>a+b,0) / weeklyScores.length;

  animateGauge(monthlyFill, Math.round((avg/2)*100), ()=>{
    setTimeout(()=>{
      monthGaugeWrap.classList.add("hidden");
      monthTextWrap.classList.remove("hidden");

      monthlyLongText.innerText =
        "Este recorrido integró todas tus respuestas como un proceso continuo. " +
        "No mide hechos aislados, sino cómo habitaste tus emociones, tus decisiones " +
        "y el impacto que tuvieron en tu entorno a lo largo del tiempo.";

      monthlyText.innerText =
        "La humanidad aparece cuando emoción, pensamiento y acción empiezan a dialogar.";
    }, 2000);
  });
}

/* ================= EL ESPEJO ================= */

const MIRROR_QUESTIONS = [
  { t:"En estos días, ¿sentiste enojo que influyó en tu forma de actuar?", e:"angry" },
  { t:"¿Sentiste tristeza que condicionó decisiones o energía?", e:"sad" },
  { t:"¿Sentiste miedo que te frenó?", e:"fear" },
  { t:"¿Apareció culpa no resuelta?", e:"guilt" },
  { t:"¿Hubo ansiedad que llevó a automatismo?", e:"anx" },
  { t:"¿Indiferencia o desconexión emocional?", e:"flat" },
  { t:"¿Alegría coherente con lo vivido?", e:"joy" },
  { t:"¿Alguna emoción dominante evitada?", e:"q" }
];

let mq = 0;
let mirrorScore = 0;
let mirrorCount = 0;

function openMirror(){
  show("mirrorIntro");
}

function startMirror(){
  mq = 0;
  mirrorScore = 0;
  mirrorCount = 0;
  show("mirrorTest");
  loadMirrorQuestion();
}

function loadMirrorQuestion(){
  mirrorEmoji.className = "emoji3d float " + MIRROR_QUESTIONS[mq].e;
  mirrorQuestion.innerText = MIRROR_QUESTIONS[mq].t;
}

function answerMirror(v){
  if(v !== null){
    mirrorScore += v;
    mirrorCount++;
  }
  mq++;
  mq >= MIRROR_QUESTIONS.length ? showMirrorResult() : loadMirrorQuestion();
}

/* ===== TERMÓMETRO FINAL + DEVOLUCIÓN INTEGRAL ===== */

function showMirrorResult(){
  show("mirrorResult");
  mirrorTextWrap.classList.add("hidden");
  mirrorGaugeWrap.classList.remove("hidden");

  const avg = mirrorCount ? mirrorScore / mirrorCount : 0;
  const target = Math.round((avg/2)*100);

  animateGauge(mirrorFill, target, ()=>{
    setTimeout(()=>{
      mirrorGaugeWrap.classList.add("hidden");
      mirrorTextWrap.classList.remove("hidden");

      mirrorFullText.innerText =
        "Este resultado refleja cómo atravesaste este mes en términos humanos, no como una foto fija, " +
        "sino como un recorrido.\n\n" +

        "En la primera etapa se manifestó tu base de conciencia: desde dónde estabas partiendo, " +
        "cómo te posicionabas frente a lo cotidiano y qué nivel de presencia habitabas.\n\n" +

        "Con el correr de las semanas se volvió visible si esa conciencia inicial se sostuvo, " +
        "se debilitó o se transformó. Hubo momentos de mayor coherencia y otros de respuesta automática. " +
        "Ese movimiento muestra cómo el tiempo impactó en tu humanidad.\n\n" +

        "El espejo integró todo el proceso. No mide errores ni aciertos, sino la relación entre " +
        "lo que sentiste, pensaste y llevaste a la acción, y el efecto que eso tuvo en vos y en tus vínculos.\n\n" +

        "La humanidad no se pierde, pero se apaga
