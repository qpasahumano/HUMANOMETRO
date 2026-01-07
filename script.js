* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Poppins", sans-serif;
  background: radial-gradient(circle at top, #16233f, #0b1229);
  color: #ffffff;
  overflow-x: hidden;
}

/* SPLASH */
#splash {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle, #16233f, #0b1229);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.6s ease;
}

#splash img {
  width: 220px;
  max-width: 70%;
  margin-bottom: 24px;
}

#splash span {
  font-size: 1.4rem;
  opacity: 0.85;
}

#splash.hide {
  opacity: 0;
  pointer-events: none;
}

/* APP */
#app {
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  padding: 28px;
  text-align: center;
}

.hidden {
  display: none;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 12px;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 16px;
}

p {
  opacity: 0.9;
  line-height: 1.5;
}

/* BOTONES */
button {
  width: 100%;
  padding: 14px 18px;
  margin: 12px 0;
  font-size: 1rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: #ffffff;
  color: #0b1229;
}

button.premium {
  background: #ffd65a;
  color: #000000;
}

button:hover {
  opacity: 0.9;
}
