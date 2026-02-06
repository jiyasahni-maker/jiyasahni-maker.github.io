const canvas = document.getElementById("skillsCanvas");
const ctx = canvas.getContext("2d");
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  createStars();
});

/* 🌙 Navbar Scroll Effect */
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 10);
});

/* 🌠 Brighter Twinkling Background Stars */
const starsBg = Array.from({ length: 250 }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  radius: Math.random() * 1.6,
  alpha: 0.6 + Math.random() * 0.5,
  speedX: (Math.random() - 0.5) * 0.05,
  speedY: 0.02 + Math.random() * 0.06,
  twinkleSpeed: 0.04 + Math.random() * 0.03,
  twinklePhase: Math.random() * Math.PI * 2
}));

function drawBackgroundStars() {
  ctx.save();
  starsBg.forEach((s) => {
    s.x += s.speedX;
    s.y += s.speedY;
    if (s.y > height) s.y = 0;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;

    s.alpha = 0.7 + Math.sin((s.twinklePhase += s.twinkleSpeed)) * 0.5;
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#dbe4ff";
    ctx.shadowColor = "#aabaff";
    ctx.shadowBlur = 6;
    ctx.fill();
  });
  ctx.restore();
}

/* 🌌 Skill Clusters */
const clusters = [
  {
    skill: "C Programming",
    color: "#a0b8ff",
    projects: [
      { name: "Password Manager CLI Tool", desc: "Built a command-line encryption utility using hashing and file security methods to safely manage user credentials.", img: "https://i.pinimg.com/736x/56/34/8b/56348b1153302d1f79dc16604ff3ffca.jpg" },
      { name: "PROJECT A", desc: "Low-level whispers to the machine.", img: "https://placehold.co/600x400?text=System+Tools" }
    ]
  },
  {
    skill: "C++ / DSA",
    color: "#9ecbff",
    projects: [
      { name: "Phishing Awareness Quiz", desc: "A fun, interactive web app that teaches users to recognize cyber threats through gamified scenarios.", img: "https://i.pinimg.com/736x/b9/3b/4b/b93b4b14f01b36438393befe00ce6360.jpg" },
      { name: "PROJECT B", desc: "Where physics meets poetry.", img: "https://placehold.co/600x400?text=Game+Engine" }
    ]
  },
  {
    skill: "JavaScript",
    color: "#b1c7ff",
    projects: [
      { name: "PROJECT C", desc: "Fragments of art reassembled by code.", img: "https://placehold.co/600x400?text=Interactive+Gallery" },
      { name: "PROJECT D", desc: "Shadows, ripples, and light.", img: "https://placehold.co/600x400?text=Portfolio+Effects" }
    ]
  },
  {
    skill: "Cyber Security",
    color: "#b5d4ff",
    projects: [
      { name: "SPA Dashboard", desc: "State and silence intertwined.", img: "https://placehold.co/600x400?text=SPA+Dashboard" },
      { name: "PROJECT E", desc: "Pages that breathe.", img: "https://placehold.co/600x400?text=UI+Transitions" }
    ]
  },
  {
    skill: "Python",
    color: "#d1d9ff",
    projects: [
      { name: "AI-Powered Intrusion Detector", desc: "Developed a lightweight model that identifies unusual network activity in real time using Python and ML algorithms.", img: "https://i.pinimg.com/736x/bf/df/34/bfdf347941e0c16abe5a72fdbdd46075.jpg" },
      { name: "PROJECT F", desc: "Numbers painted into meaning.", img: "https://placehold.co/600x400?text=Data+Visualizer" }
    ]
  },
  {
    skill: "HTML",
    color: "#dcd8ff",
    projects: [
      { name: "Portfolio Website", desc: "Designed and coded this site from scratch, implementing responsive design and dark-mode logic for a cohesive UI/UX..", img: "https://i.pinimg.com/1200x/84/d3/93/84d393210364ab06404f1b062d1a7bf0.jpg" },
      { name: "PROJECT G", desc: "A frame that bends but never breaks.", img: "https://placehold.co/600x400?text=Responsive+Mockup" }
    ]
  },
  // {
  //   skill: "CSS",
  //   color: "#c3d4ff",
  //   projects: [
  //     { name: "Animation Kit", desc: "Stillness learns motion.", img: "https://placehold.co/600x400?text=Animation+Kit" },
  //     { name: "Theme Styling", desc: "Color in harmonic balance.", img: "https://placehold.co/600x400?text=Theme+Styling" }
  //   ]
  // }
];

class Star {
  constructor(x, y, radius, color, label, isProject = false, orbitCenter = null, projectData = null) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.label = label;
    this.isProject = isProject;
    this.orbitCenter = orbitCenter;
    this.angle = Math.random() * 360;
    this.orbitRadius = isProject ? 60 + Math.random() * 40 : 0;
    this.speed = 0.005 + Math.random() * 0.002;
    this.projectData = projectData;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fill();

    ctx.font = `${this.isProject ? 14 : 17}px 'Cinzel', serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = this.isProject ? "#aab8ff" : "#dde3ff";
    ctx.fillText(this.label, this.x, this.y - (this.isProject ? 15 : 25));
  }

  update() {
    if (this.isProject && this.orbitCenter) {
      this.angle += this.speed;
      this.x = this.orbitCenter.x + Math.cos(this.angle) * this.orbitRadius;
      this.y = this.orbitCenter.y + Math.sin(this.angle) * this.orbitRadius;
    }
    this.draw();
  }
}

/* 🌌 Positioning Logic */
function getClusterPositions() {
  const cols = 3;
  const spacingX = width / (cols + 1);
  const spacingY = height / 2.7;
  return clusters.map((_, i) => ({
    x: spacingX * ((i % cols) + 1),
    y: spacingY * (Math.floor(i / cols) + 0.75)
  }));
}

/* 🌠 Create Skill Stars */
let stars = [];
function createStars() {
  stars = [];
  const positions = getClusterPositions();
  clusters.forEach((cluster, i) => {
    const center = positions[i];
    const skillStar = new Star(center.x, center.y, 6, cluster.color, cluster.skill);
    stars.push(skillStar);
    cluster.projects.forEach(proj => {
      stars.push(new Star(center.x, center.y, 3, cluster.color, proj.name, true, skillStar, proj));
    });
  });
}
createStars();

/* 🌙 Project Card UI */
const card = document.createElement("div");
card.classList.add("project-card");
card.innerHTML = `
  <button class="close-card">✦</button>
  <img class="project-img" src="https://placehold.co/600x400" alt="Preview">
  <h2 class="project-title"></h2>
  <p class="project-desc"></p>
  <button class="project-btn">View Project</button>
`;
document.body.appendChild(card);
card.style.display = "none";

canvas.addEventListener("click", (e) => {
  const mx = e.clientX, my = e.clientY;
  for (const s of stars) {
    if (s.isProject) {
      const dist = Math.hypot(mx - s.x, my - s.y);
      if (dist < 30) {
        showCard(s.projectData, mx, my);
        return;
      }
    }
  }
  hideCard();
});

function showCard(data, x, y) {
  const cardWidth = 420, cardHeight = 360, padding = 30;
  card.querySelector(".project-title").textContent = data.name;
  card.querySelector(".project-desc").textContent = data.desc;
  card.querySelector(".project-img").src = data.img;
  
  let posX = x + 20;
  let posY = y - 20;

  if (posX + cardWidth > width - padding) posX = x - cardWidth - 30;
  if (posY + cardHeight > height - padding) posY = height - cardHeight - padding;
  if (posX < padding) posX = padding;
  if (posY < padding) posY = padding;

  card.style.left = `${posX}px`;
  card.style.top = `${posY}px`;
  card.style.display = "block";
  requestAnimationFrame(() => card.classList.add("visible"));
}

function hideCard() {
  card.classList.remove("visible");
  setTimeout(() => (card.style.display = "none"), 300);
}
document.querySelector(".close-card").addEventListener("click", hideCard);

/* 🌌 PARALLAX + REAL CONSTELLATIONS */
let parallax = { x: 0, y: 0 };
document.addEventListener("mousemove", (e) => {
  const xNorm = (e.clientX / width - 0.5) * 2;
  const yNorm = (e.clientY / height - 0.5) * 2;
  parallax.x = xNorm * 40;
  parallax.y = yNorm * 30;
});

/* Real Constellations Data */
const realConstellations = [
  {
    name: "Orion",
    color: "rgba(180,200,255,0.35)",
    stars: [
      { x: 0.1, y: 0.2 },
      { x: 0.13, y: 0.25 },
      { x: 0.16, y: 0.2 },
      { x: 0.19, y: 0.26 },
      { x: 0.22, y: 0.21 },
      { x: 0.25, y: 0.27 }
    ]
  },
  {
    name: "Cassiopeia",
    color: "rgba(200,210,255,0.3)",
    stars: [
      { x: 0.7, y: 0.1 },
      { x: 0.73, y: 0.13 },
      { x: 0.76, y: 0.1 },
      { x: 0.79, y: 0.13 },
      { x: 0.82, y: 0.1 }
    ]
  },
  {
    name: "Ursa Major",
    color: "rgba(190,210,255,0.25)",
    stars: [
      { x: 0.6, y: 0.7 },
      { x: 0.63, y: 0.68 },
      { x: 0.66, y: 0.67 },
      { x: 0.69, y: 0.7 },
      { x: 0.72, y: 0.74 },
      { x: 0.75, y: 0.7 },
      { x: 0.78, y: 0.73 }
    ]
  },
  {
    name: "Lyra",
    color: "rgba(210,220,255,0.25)",
    stars: [
      { x: 0.3, y: 0.8 },
      { x: 0.33, y: 0.83 },
      { x: 0.36, y: 0.8 },
      { x: 0.39, y: 0.83 }
    ]
  }
];

/* 🌠 Draw Rotating Real Constellations */
let driftAngle = 0;
let driftSpeed = 0.00015;

function drawRealConstellations() {
  driftAngle += driftSpeed;
  realConstellations.forEach(c => {
    ctx.beginPath();
    for (let i = 0; i < c.stars.length; i++) {
      const cx = width / 2;
      const cy = height / 2;
      const relX = (c.stars[i].x * width - cx);
      const relY = (c.stars[i].y * height - cy);
      const rotX = relX * Math.cos(driftAngle) - relY * Math.sin(driftAngle);
      const rotY = relX * Math.sin(driftAngle) + relY * Math.cos(driftAngle);
      const sx = cx + rotX + parallax.x * 0.3;
      const sy = cy + rotY + parallax.y * 0.3;

      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210,220,255,0.45)";
      ctx.shadowColor = "#aabaff";
      ctx.shadowBlur = 10;
      ctx.fill();

      if (i > 0) {
        const prev = c.stars[i - 1];
        const px = cx + ((prev.x * width - cx) * Math.cos(driftAngle) - (prev.y * height - cy) * Math.sin(driftAngle)) + parallax.x * 0.3;
        const py = cy + ((prev.x * width - cx) * Math.sin(driftAngle) + (prev.y * height - cy) * Math.cos(driftAngle)) + parallax.y * 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 2500) * 0.25;
        ctx.stroke();
      }
    }
  });
}

/* 🌌 Animate Everything */
let opacity = 0;
function animate() {
  ctx.clearRect(0, 0, width, height);

  drawBackgroundStars();
  drawRealConstellations();

  opacity = Math.min(opacity + 0.01, 1);
  ctx.globalAlpha = opacity;

  ctx.save();
  ctx.translate(parallax.x * 0.5, parallax.y * 0.5);

  stars.forEach(star => star.update());
  stars.forEach(s => {
    if (s.isProject && s.orbitCenter) {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.orbitCenter.x, s.orbitCenter.y);
      ctx.strokeStyle = "rgba(180,200,255,0.2)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  });

  ctx.restore();
  ctx.globalAlpha = 1;

  requestAnimationFrame(animate);
}
animate();

/* ✍️ Typing effect */
const text = "Each glowing cluster represents a skill — its projects orbit gently like satellites.";
let i = 0;
function typeEffect() {
  const el = document.getElementById("skills-description");
  if (i < text.length) {
    el.textContent += text.charAt(i++);
    setTimeout(typeEffect, 45);
  }
}
typeEffect();
