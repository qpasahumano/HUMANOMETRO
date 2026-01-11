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
// =========================
// BLOQUE CONTROL INICIO V.2
// (SUMA – NO ALTERA LÓGICA PREVIA)
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const v2Screen = document.getElementById("hm-v2-start");
  const continueBtn = document.getElementById("hmV2Continue");

  if (!v2Screen || !continueBtn) return;

  continueBtn.addEventListener("click", () => {
    v2Screen.classList.add("hm-hidden");
    console.log("Inicio testeo semanal HUMANÓMETRO v.2");
    // aquí se conecta luego el flujo de test
  });
});
