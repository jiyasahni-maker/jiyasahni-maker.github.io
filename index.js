const landing = document.getElementById("landing");
const hero = document.getElementById("hero");
const about = document.getElementById("about");

const moon = document.getElementById("moon");
const explore = document.getElementById("explore");
const restart = document.getElementById("restart");

const video = document.getElementById("bgVideo");
const starfield = document.getElementById("starfield");

function setScene(scene) {
  landing.classList.remove("active");
  hero.classList.remove("active");
  about.classList.remove("active");

  if (scene === "landing") {
    landing.classList.add("active");
    video.classList.remove("hidden");
    starfield.classList.remove("active");
  }

  if (scene === "hero") {
    hero.classList.add("active");
    video.classList.add("hidden");
    starfield.classList.add("active");
  }

  if (scene === "about") {
    about.classList.add("active");
  }
}

moon.addEventListener("click", () => setScene("hero"));
explore.addEventListener("click", () => setScene("about"));
restart.addEventListener("click", () => setScene("landing"));
