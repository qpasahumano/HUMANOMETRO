/* ===============================
   MOTOR DE FLUJO BASE – HUMANÓMETRO
   (NO contiene preguntas ni textos)
================================ */

const SCREENS = [
  "start",
  "test",
  "results",
  "weekly",
  "weeklyResultScreen",
  "privacy"
];

/* ===============================
   CONTROL DE PANTALLAS
================================ */

function show(screenId) {
  SCREENS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(screenId);
  if (target) target.classList.remove("hidden");
}

/* ===============================
   BOTONES DE INICIO
================================ */

function startTest(isPremium) {
  window.__HM_MODE__ = isPremium ? "premium" : "common";
  show("test");
}

function showPrivacy() {
  show("privacy");
}

function restart() {
  show("start");
}

/* ===============================
   BLOQUEO TEMPORAL (BASE)
================================ */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function saveBlockDone(blockName) {
  localStorage.setItem(
    "hm_block_" + blockName,
    Date.now().toString()
  );
}

function canAccessBlock(blockName, days = 7) {
  const last = localStorage.getItem("hm_block_" + blockName);
  if (!last) return false;

  return Date.now() - Number(last) >= days * 24 * 60 * 60 * 1000;
}

/* ===============================
   UTILIDAD CHECKLIST FUTUROS
================================ */

function blockedMessage() {
  alert(
    "Este proceso es consecutivo.\n\n" +
    "Humanómetro se mide con tiempo vivido.\n" +
    "Volvé cuando hayan pasado 7 días."
  );
}
