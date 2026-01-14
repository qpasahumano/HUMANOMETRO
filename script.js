/* ===============================
   MODO DEV
================================ */
const isDev = new URLSearchParams(window.location.search).has("dev");

/* ===============================
   BLOQUEO SEMANA 1
================================ */
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function canAccessWeek1() {
  if (isDev) return true;

  const doneAt = localStorage.getItem("humanometro_init_done");
  if (!doneAt) return false;

  return (Date.now() - Number(doneAt)) >= WEEK_MS;
}

function saveInitialTest() {
  localStorage.setItem("humanometro_init_done", Date.now());
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("week1Btn");
  const txt = document.getElementById("week1LockText");
  if (!btn) return;

  if (canAccessWeek1()) {
    btn.disabled = false;
    txt.style.display = "none";
  } else {
    btn.disabled = true;
    txt.style.display = "block";
  }
});

/* ===============================
   FLUJO EXISTENTE
   (NO SE TOCA)
================================ */
// startTest(), answer(), restart(), showPrivacy(), etc
// se mantienen tal como ya funcionan

function goWeekly() {
  if (!canAccessWeek1()) {
    alert(
      "Este proceso es consecutivo.\n\n" +
      "Humanómetro necesita que vivas una semana real\n" +
      "antes de evaluar tu Semana 1."
    );
    return;
  }
  show("weekly");
}
