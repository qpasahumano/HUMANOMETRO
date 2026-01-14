const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function canAccessWeekly() {
  const last = localStorage.getItem("week1_done");
  if (!last) return true;
  return Date.now() - parseInt(last, 10) >= WEEK_MS;
}

function weeklyWithCheck() {
  if (!canAccessWeekly()) {
    alert(
      "Este proceso es consecutivo.\n\n" +
      "Necesitás vivir una semana de experiencias\n" +
      "antes de volver a medir tu humanidad."
    );
    return;
  }
  startWeekly();
}

function saveWeekly() {
  localStorage.setItem("week1_done", Date.now().toString());
}
