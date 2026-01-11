document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startTestBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      alert("Inicio test semanal – HUMANÓMETRO v.2");
    });
  }
});
// ===== START V.2 =====
document.addEventListener("DOMContentLoaded", () => {
  const btnV2 = document.getElementById("continueTestBtn");

  if (btnV2) {
    btnV2.addEventListener("click", () => {
      console.log("Continuar testeo V.2");
      // acá luego se engancha el flujo del test semanal
    });
  }
});
