/* ===============================
   CONFIGURACIÓN
   =============================== */
const DEV_MODE = false; // ← en producción FALSE
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* ===============================
   TIEMPO
   =============================== */
function now(){
  return Date.now();
}

function pasoUnaSemana(key){
  if(DEV_MODE) return true;
  const last = localStorage.getItem(key);
  if(!last) return true;
  return (now() - Number(last)) >= WEEK_MS;
}

function marcarPaso(key){
  localStorage.setItem(key, now());
}

/* ===============================
   DESTELLO + TEXTO (ÚNICO)
   =============================== */
function destello(){
  const d = document.createElement("div");
  d.innerHTML = `
    <div style="
      text-align:center;
      font-size:1.2rem;
      line-height:1.6;
    ">
      No seas ansioso.<br>
      Tiene que pasar una semana.
    </div>
  `;
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    pointer-events:none;
    color:white;
    background:
      radial-gradient(circle,
        rgba(255,255,255,.18),
        rgba(0,0,0,.85)
      );
    z-index:9999;
    animation: fadeInOut 1.2s ease-in-out;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1200);
}

/* ===============================
   CANDADO VISUAL
   =============================== */
function candadoAbrir(cb){
  const c = document.createElement("div");
  c.textContent = "🔓";
  c.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:4rem;
    pointer-events:none;
    z-index:9999;
    animation: fadeInOut 1s ease-in-out;
  `;
  document.body.appendChild(c);
  setTimeout(()=>{
    c.remove();
    cb && cb();
  },1000);
}

/* ===============================
   GATES — PUERTAS REALES
   =============================== */

/* PRIMER BLOQUEO — después de la semana 1 */
function gateMonthly(){
  const KEY = "hm_v1_week1";

  if(!pasoUnaSemana(KEY)){
    destello();
    return;
  }

  marcarPaso(KEY);
  candadoAbrir(() => {
    startWeekly();
  });
}

/* EJEMPLO FUTURO — semana 2 */
function gateWeek2(next){
  const KEY = "hm_v1_week2";

  if(!pasoUnaSemana(KEY)){
    destello();
    return;
  }

  marcarPaso(KEY);
  candadoAbrir(() => {
    next && next();
  });
}

/* ===============================
   ANIMACIÓN BASE
   =============================== */
const style = document.createElement("style");
style.textContent = `
@keyframes fadeInOut {
  0% { opacity:0 }
  20% { opacity:1 }
  80% { opacity:1 }
  100% { opacity:0 }
}`;
document.head.appendChild(style);
