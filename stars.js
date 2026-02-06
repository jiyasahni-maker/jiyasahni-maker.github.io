const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];
let mouse = { x: 0, y: 0 };

let morphRadius = 0;
let morphCenter = { x: 0, y: 0 };
let morphActive = false;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
  mouse.x = (e.clientX / w - 0.5) * 2;
  mouse.y = (e.clientY / h - 0.5) * 2;
});

/* ---------- STAR SETUP ---------- */

function createStars() {
  stars = [];
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random(),          // depth 0–1
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05
    });
  }
}

createStars();

/* ---------- MORPH CONTROL ---------- */

function startMorph(center) {
  morphCenter = center;
  morphRadius = 0;
  morphActive = true;
}

function resetStars() {
  morphActive = false;
  morphRadius = 0;
}

/* ---------- RENDER LOOP ---------- */

function animate() {
  ctx.clearRect(0, 0, w, h);

  if (morphActive) {
    morphRadius += 12;
  }

  stars.forEach(s => {
    // Drift (depth-weighted)
    s.x += s.vx * (0.3 + s.z);
    s.y += s.vy * (0.3 + s.z);

    if (s.x < 0) s.x = w;
    if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h;
    if (s.y > h) s.y = 0;

    // Parallax
    const px = s.x + mouse.x * s.z * 40;
    const py = s.y + mouse.y * s.z * 40;

    // Morph mask
    let alpha = 0;
    if (!morphActive) {
      alpha = 1;
    } else {
      const dx = px - morphCenter.x;
      const dy = py - morphCenter.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      alpha = Math.min(Math.max((morphRadius - dist) / 200, 0), 1);
    }

    ctx.globalAlpha = alpha * (0.4 + s.z * 0.6);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(px, py, s.r * (0.5 + s.z), 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

animate();
