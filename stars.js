const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let w, h;
let stars = [];
let mouse = { x: 0, y: 0 };

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX / w - 0.5;
  mouse.y = e.clientY / h - 0.5;
});

for (let i = 0; i < 250; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    r: Math.random() * 1.5 + 0.5
  });
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";

  stars.forEach(s => {
    const px = s.x + mouse.x * s.z * 40;
    const py = s.y + mouse.y * s.z * 40;

    ctx.globalAlpha = 0.8 + s.z * 0.2;
    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
