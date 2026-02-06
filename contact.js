// contact.js — FINAL FIXED EDITION
// Nebula background + cyberpunk form + canvas-height fix

(() => {

  /* ---------- CANVAS + NEBULA ---------- */

  const canvas = document.getElementById('contactBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    regenStars(W, H);
    nebulaSize = { W, H };
  }

  let nebulaSize = { W: window.innerWidth, H: window.innerHeight };

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('load', resizeCanvas);

  let stars = [];
  function regenStars(W, H){
    stars = Array.from({ length: Math.floor((W * H) / 9000) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.6 + 0.3,
      tw: Math.random() * 0.02 + 0.004,
      hue: Math.random() * 40 + 220
    }));
  }

  let layers = Array.from({ length: 5 }, (_, i) => ({
    hue: 240 + i * 8,
    speed: 0.0001 + i * 0.00006,
    scale: 0.6 + i * 0.12,
    offsetX: Math.random() * nebulaSize.W,
    offsetY: Math.random() * nebulaSize.H
  }));

  let mouseX = 0, mouseY = 0;
  document.addEventListener('pointermove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const comets = [];
  function spawnComet() {
    if (Math.random() > 0.993) {
      const { W, H } = nebulaSize;
      comets.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.6,
        vx: -4 - Math.random() * 2,
        vy: 1 + Math.random() * 2,
        len: 100 + Math.random() * 100,
        hue: 240 + Math.random() * 40,
        life: 0
      });
    }
  }

  function draw(now){
    const { W, H } = nebulaSize;

    ctx.clearRect(0, 0, W, H);

    const base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, '#070710');
    base.addColorStop(1, '#01020b');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // nebula
    layers.forEach((n, i) => {
      const t = now * n.speed;
      const x = n.offsetX + Math.sin(t + i) * 40;
      const y = n.offsetY + Math.cos(t + i) * 40;
      const r = Math.max(W, H) * n.scale;

      const g = ctx.createRadialGradient(
        x + mouseX * 40,
        y + mouseY * 40,
        0,
        x, y, r
      );

      g.addColorStop(0, `hsla(${n.hue},80%,70%,0.07)`);
      g.addColorStop(0.4, `hsla(${n.hue+20},70%,60%,0.04)`);
      g.addColorStop(1, 'transparent');

      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    });

    // stars
    for (let s of stars){
      s.alpha += (Math.random() - 0.5) * s.tw;
      s.alpha = Math.max(.3, Math.min(1, s.alpha));

      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = `hsl(${s.hue},90%,88%)`;
      ctx.beginPath();
      ctx.arc(s.x + mouseX*15, s.y + mouseY*15, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // comets
    spawnComet();
    for (let i = comets.length - 1; i >= 0; i--){
      const c = comets[i];
      c.x += c.vx;
      c.y += c.vy;
      c.life++;

      const grad = ctx.createLinearGradient(
        c.x, c.y,
        c.x - c.vx * c.len/12,
        c.y - c.vy * c.len/12
      );
      grad.addColorStop(0, `hsla(${c.hue},100%,80%,0.9)`);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(
        c.x - c.vx * c.len/12,
        c.y - c.vy * c.len/12
      );
      ctx.stroke();

      if (c.x < -200 || c.y > H+200 || c.life > 2000) {
        comets.splice(i,1);
      }
    }

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  requestAnimationFrame(draw);

  /* ---------- CYBER FORM ---------- */

  const form = document.getElementById("cyberForm");
  if (!form) return;

  const holo = document.createElement("div");
  holo.className = "holo-popup";
  form.appendChild(holo);

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const msg = document.getElementById("message");
    const success = document.getElementById("formSuccess");

    let ok = true;

    form.querySelectorAll(".error").forEach(e=>e.textContent="");

    if (name.value.trim().length < 2){
      name.nextElementSibling.textContent = "Enter valid name.";
      ok = false;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value.trim())){
      email.nextElementSibling.textContent = "Invalid email format.";
      ok = false;
    }

    if (msg.value.trim().length < 10){
      msg.nextElementSibling.textContent = "At least 10 characters.";
      ok = false;
    }

    if (!ok){
      form.animate([
        { transform:"translateY(0)" },
        { transform:"translateY(-6px)" },
        { transform:"translateY(0)" }
      ], { duration:220 });
      return;
    }

    // success animation
    form.reset();
    success.textContent = "Transmission queued ✦";

    holo.textContent = "✦ Transmission Sent — Awaiting Response ✦";
    holo.classList.add("show");

    setTimeout(()=>{
      holo.classList.remove("show");
      success.textContent = "";
    }, 2400);
  });

})();
