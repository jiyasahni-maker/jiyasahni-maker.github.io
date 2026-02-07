const landing = document.getElementById("landing");
const hero = document.getElementById("hero");
const about = document.getElementById("about");

const moon = document.getElementById("moon");
const explore = document.getElementById("explore");
const restart = document.getElementById("restart");

const video = document.getElementById("bgVideo");
const starfield = document.getElementById("starfield");

let morphing = false;

function setScene(scene) {
  landing.classList.remove("active");
  hero.classList.remove("active");
  about.classList.remove("active");

  if (scene === "landing") {
    landing.classList.add("active");
    video.classList.remove("hidden");
    starfield.classList.remove("active");
    resetStars();
  }

  if (scene === "hero") {
    hero.classList.add("active");
  }

  if (scene === "about") {
    about.classList.add("active");
  }
}

moon.addEventListener("click", () => {
  if (morphing) return;
  morphing = true;

  startMorph({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  video.classList.add("hidden");
  starfield.classList.add("active");

  setTimeout(() => {
    landing.classList.remove("active");
    hero.classList.add("active");
  }, 1800);
});

explore.addEventListener("click", () => setScene("about"));
restart.addEventListener("click", () => {
  morphing = false;
  setScene("landing");
});
// const navToggle = document.getElementById("navToggle");
// const navLinks = document.querySelector(".nav-links");

// navToggle.addEventListener("click", () => {
//   navLinks.classList.toggle("open");
// });
