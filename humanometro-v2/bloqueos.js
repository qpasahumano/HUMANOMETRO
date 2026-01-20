/* ===============================
   CONFIGURACIÓN
   =============================== */
const DEV_MODE = true; // ← en producción poner false
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
   DESTELLO + TEXTO
   =============================== */
function destello(){
  const d = document.createElement("div");
  d.textContent = "No seas ansioso. Tiene que pasar una semana.";
  d.style.cssText = `
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    pointer-events:none;
    font-size:1.2rem;
    color:white;
    background:radial-gradient(circle,rgba(255,255,255,.18),transparent);
    z-index:9999;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),1000);
}

/* ===============================
   CANDADO
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
  `;
  document.body.appendChild(c);
  setTimeout(()=>{
    c.remove();
    cb && cb();
  },1000);
}

/* ===============================
   GATES (PUERTAS)
   =============================== */

/
