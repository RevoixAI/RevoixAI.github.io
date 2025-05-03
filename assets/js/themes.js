// === Theme Toggle ===
const toggleBtn = document.getElementById("toggleTheme");
const html = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
  toggleBtn.innerText = "🌞";
} else {
  toggleBtn.innerText = "🌙";
}

toggleBtn.addEventListener("click", () => {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  toggleBtn.innerText = isDark ? "🌞" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateParticlesColor();
});

document.addEventListener("DOMContentLoaded", () => {
  updateParticlesColor(); // Initial load once DOM is ready
});

function updateParticlesColor() {
  const isDark = document.documentElement.classList.contains("dark");

  tsParticles.load("tsparticles", {
    background: { color: { value: "transparent" } },
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: { value: 70, density: { enable: true, area: 800 } },
      color: { value: isDark ? "#ffffff" : "#000000" },
      links: {
        enable: true,
        distance: 130,
        color: isDark ? "#ffffff" : "#000000",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        outModes: { default: "bounce" }
      },
      size: { value: 3 },
      opacity: { value: 0.7 }
    },
    detectRetina: true
  });
}