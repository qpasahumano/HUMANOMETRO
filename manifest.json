// SPLASH CONTROL
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hide");
    document.getElementById("app").classList.remove("hidden");
  }, 1200);
});

// APP LOGICA BASE (NO CAMBIADA)
function startTest(premium) {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  document.getElementById("resultText").innerText =
    premium
      ? "Lectura humana profunda (Premium)"
      : "Lectura humana estándar";
}

function resetApp() {
  location.reload();
}

function showPrivacy() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("privacy").classList.remove("hidden");
}

function goHome() {
  document.getElementById("privacy").classList.add("hidden");
  document.getElementById("start").classList.remove("hidden");
}

// SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
