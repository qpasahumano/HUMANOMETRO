/* ===============================
   FLUJO HUMANÓMETRO – NÚCLEO ÚNICO
   (no toca preguntas ni puntajes)
================================ */

/* === CONFIG === */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DEV_MODE = true; // ponelo en false para usuario final

/* === ESTADO === */
function now() {
  return Date.now();
}

function get(key) {
  return localStorage.getItem(key);
}

function set(key, value) {
  localStorage.setItem(key, value);
}

/* === HITOS DE FLUJO === */
const FLOW = {
  mainTestDone: "hm_main_done",
  week1Done: "hm_week1_done",
  week2Done: "hm_week2_done",
  week3Done: "hm_week3_done"
};

/* === HELPERS === */
function passed7Days(fromKey) {
  const t = get(fromKey);
  if (!t) return false;
  return now() - parseInt(t, 10) >= WEEK_MS;
}

/* === REGISTROS (se llaman al finalizar cada bloque) === */
function registerMainTest() {
  set(FLOW.mainTestDone, now());
  showSaved();
}

function registerWeek(n) {
  set(FLOW["week" + n + "Done"], now());
  showSaved();
}

/* === MENSAJE DE GUARDADO === */
function showSaved() {
  const el = document.getElementById("autoSaved");
  if (!el) return;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2500);
}

/* === VALIDADORES DE ACCESO === */
function canAccessWeek1() {
  return DEV_MODE || passed7Days(FLOW.mainTestDone);
}

function canAccessWeek2() {
  return DEV_MODE || passed7Days(FLOW.week1Done);
}

function canAccessWeek3() {
  return DEV_MODE || passed7Days(FLOW.week2Done);
}

function canAccessMirror() {
  return DEV_MODE || passed7Days(FLOW.week3Done);
}

/* === BLOQUEOS DE BOTONES === */
function guardAccess(condition, message, action) {
  if (!condition()) {
    alert(message);
    return;
  }
  action();
}

/* === EJEMPLOS DE USO (HTML) === */
/*
onclick="guardAccess(
  canAccessWeek1,
  'Tenés que vivir 7 días antes de evaluar tu primera semana.',
  () => startWeek1()
)"
*/

/* === NADA MÁS === */
/* Este archivo NO calcula,
   NO pregunta,
   NO evalúa humanidad.
   Solo gobierna el tiempo y el orden.
*/
