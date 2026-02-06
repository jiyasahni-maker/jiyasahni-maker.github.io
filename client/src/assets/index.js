document.addEventListener("DOMContentLoaded", () => {
  const moon = document.getElementById("moon");
  const cueLine = document.getElementById("cueLine");
  const clickHint = document.querySelector(".click-hint");
  const video = document.getElementById("celestialLake");
  const hero = document.getElementById("hero");
  const exploreBtn = document.getElementById("exploreBtn");
  const about = document.getElementById("about");
  const starCanvas = document.getElementById("parallaxStars");
  const ctx = starCanvas.getContext("2d");

  /* === STARFIELD INIT === */
  function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const numStars = 220;
  const stars = Array.from({ length: numStars }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    r: Math.random() * 1.3 + 0.4,
    baseAlpha: Math.random() * 0.4 + 0.6,
    alpha: Math.random() * 0.4 + 0.6,
  }));

  function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#b8c9ff";
      ctx.fill();
    });
  }

  /* === STARFIELD MOTION === */
  let offset = 0;
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  let gravityRadius = 280; // distance around moon that affects stars
  let gravityStrength = 0.18; // how much they drift toward the moon

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateStars() {
    offset += 0.3;

    stars.forEach((s) => {
      const dx = mouseX - s.x;
      const dy = mouseY - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base twinkle
      s.alpha = s.baseAlpha + Math.sin(offset * 0.05 + s.x * 0.02) * 0.1;

      // Gravity pull near moon
      if (dist < gravityRadius) {
        const pull = (gravityRadius - dist) / gravityRadius;
        s.x += dx * gravityStrength * pull * 0.03;
        s.y += dy * gravityStrength * pull * 0.03;
        s.alpha = Math.min(1, s.alpha + pull * 0.4);
      }

      // Parallax drift
      s.x += Math.cos(offset * 0.002 + s.y * 0.01) * 0.08;
      s.y += Math.sin(offset * 0.002 + s.x * 0.01) * 0.05;

      // Wraparound
      if (s.x < 0) s.x = starCanvas.width;
      if (s.x > starCanvas.width) s.x = 0;
      if (s.y < 0) s.y = starCanvas.height;
      if (s.y > starCanvas.height) s.y = 0;
    });

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, targetX * 30, targetY * 20);
    drawStars();
    ctx.restore();

    requestAnimationFrame(animateStars);
  }
  animateStars();

  /* === PARALLAX ON CURSOR === */
  document.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetX += (nx - targetX) * 0.02;
    targetY += (ny - targetY) * 0.02;
  });

  /* === SCROLL-BASED DEPTH === */
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY / window.innerHeight;
    ctx.globalAlpha = 0.5 + Math.sin(scrollY * 1.5) * 0.08;
  });

  /* === VIDEO AUTOPLAY FALLBACK === */
  video.play().catch(() => console.warn("Autoplay blocked; will play later."));

  /* === MOON GLOW ON HOVER === */
  moon.addEventListener("mouseenter", () => (cueLine.style.opacity = "1"));
  moon.addEventListener("mouseleave", () => (cueLine.style.opacity = "0.75"));

  /* === MOON CLICK TRANSITION === */
  moon.addEventListener("click", () => {
    cueLine.style.opacity = "0";
    clickHint.style.opacity = "0";

    const pulse = document.createElement("div");
    pulse.className = "wormhole";
    Object.assign(pulse.style, {
      position: "fixed",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      width: "0",
      height: "0",
      background:
        "radial-gradient(circle, rgba(230,240,255,0.9) 0%, transparent 70%)",
      zIndex: "999",
      transition: "all 2.2s ease",
    });
    document.body.appendChild(pulse);

    requestAnimationFrame(() => {
      pulse.style.width = "400vw";
      pulse.style.height = "400vw";
      pulse.style.opacity = "0";
      moon.style.transition = "opacity 1.5s ease";
      moon.style.opacity = "0";
    });

    setTimeout(() => {
      pulse.remove();
      document.getElementById("landing").classList.add("hidden");
      video.style.transition = "opacity 2s ease";
      video.style.opacity = "0";
      hero.classList.add("show");

      setTimeout(() => {
        hero.classList.add("show");

      }, 600);
    }, 2200);
  });

  /* === EXPLORE BUTTON → ABOUT SECTION === */
  exploreBtn.addEventListener("click", () => {
    hero.classList.remove("show");
    setTimeout(() => {
      about.classList.add("visible");
      about.style.display = "flex";
      hero.classList.add("hidden");
about.classList.add("visible");

    }, 600);
  });
});
