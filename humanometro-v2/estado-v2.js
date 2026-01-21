/* =========================================
   ESTADO + REANUDACIÓN — HUMANÓMETRO v2
   (NO TOCAR script.js)
========================================= */

/* CONFIG */
const DEV_MODE_V2 = false; // ⬅️ PRODUCCIÓN
const WEEK_MS_V2 = 7 * 24 * 60 * 60 * 1000;

/* KEYS */
const HM_V2_STATE = "hm_v2_state";
const HM_V2_LAST_DATE = "hm_v2_last_date";

/* =========================================
   GUARDADO DE ESTADO
========================================= */
function saveV2State(extra = {}) {
  const state = {
    week,
    q,
    currentScore,
    weeklyScores,
    allAnswers,
    mirrorLog,
    section: getVisibleSection(),
    time: Date.now(),
    ...extra
  };
  localStorage.setItem(HM_V2_STATE, JSON.stringify(state));
}

/* =========================================
   CARGA DE ESTADO
========================================= */
function loadV2State() {
  const raw = localStorage.getItem(HM_V2_STATE);
  if (!raw) return false;

  try {
    const state = JSON.parse(raw);

    week = state.week ?? 0;
    q = state.q ?? 0;
    currentScore = state.currentScore ?? 0;
    weeklyScores = state.weeklyScores ?? [];
    allAnswers = state.allAnswers ?? [];
    mirrorLog = state.mirrorLog ?? [];

    if (state.section) {
      show(state.section);
      if (state.section === "test") loadQuestion();
      if (state.section === "mirrorTest") loadMirror();
    }

    return true;
  } catch {
    return false;
  }
}

/* =========================================
   SECCIÓN ACTUAL
========================================= */
function getVisibleSection() {
  const ids = [
    "start",
    "test",
    "weeklyResult",
    "monthlyResult",
    "mirrorIntro",
    "mirrorTest",
    "finalResult"
  ];
  return ids.find(id => !document.getElementById(id).classList.contains("hidden"));
}

/* =========================================
   BLOQUEO ESPEJO (SEMANA)
========================================= */
function gateMirrorIntro() {
  if (DEV_MODE_V2) {
    saveV2State({ section: "mirrorIntro" });
    show("mirrorIntro");
    return;
  }

  const last = localStorage.getItem(HM_V2_LAST_DATE);

  if (last && Date.now() - Number(last) < WEEK_MS_V2) {
    saveV2State({ section: "monthlyResult" });
    if (typeof showWeeklyBlockFlash === "function") {
      showWeeklyBlockFlash();
    }
    return;
  }

  localStorage.setItem(HM_V2_LAST_DATE, Date.now());
  saveV2State({ section: "mirrorIntro" });
  show("mirrorIntro");
}

/* =========================================
   AUTO-REANUDACIÓN AL CARGAR
========================================= */
window.addEventListener("load", () => {
  loadV2State();
});

/* =========================================
   HOOKS DE GUARDADO AUTOMÁTICO
========================================= */
const _startV2 = startV2;
startV2 = function () {
  _startV2();
  saveV2State({ section: "test" });
};

const _answer = answer;
answer = function (v) {
  _answer(v);
  saveV2State();
};

const _nextWeek = nextWeek;
nextWeek = function () {
  _nextWeek();
  saveV2State();
};

const _startMirror = startMirror;
startMirror = function () {
  _startMirror();
  saveV2State({ section: "mirrorTest" });
};

const _answerMirror = answerMirror;
answerMirror = function (v) {
  _answerMirror(v);
  saveV2State();
};
