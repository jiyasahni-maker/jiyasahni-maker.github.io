// projects.js
// Celestial Projects page — nebula + starfield + constellation hubs + 2 orbiting projects each
(function () {
  const bg = document.getElementById('bgCanvas');
  const canvas = document.getElementById('projCanvas');
  const bgCtx = bg.getContext('2d');
  const ctx = canvas.getContext('2d');

  function resize() {
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Nebula: moving gradient blobs using offscreen canvas ----
  const nebula = { blobs: [], speed: 0.0005 };
  for (let i = 0; i < 5; i++) {
    nebula.blobs.push({
      x: Math.random() * bg.width,
      y: Math.random() * bg.height,
      radius: 300 + Math.random() * 600,
      hue: 200 + Math.random() * 40,
      t: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      alpha: 0.06 + Math.random() * 0.08
    });
  }

  // background stars for parallax depth
  const stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * bg.width,
      y: Math.random() * bg.height,
      r: Math.random() * 1.4,
      a: Math.random() * 0.9 + 0.1,
      tw: Math.random() * 0.02 + 0.004
    });
  }

  // ---- Define 7 skill hubs with two projects each (poetic-tech placeholders) ----
  const skillLabels = [
    "Celestial Web Design (HTML / CSS)",
    "JavaScript Alchemy",
    "React Realms",
    "C Programming Arts",
    "C++ DSA Forge",
    "Creative Algorithms",
    "UI / UX Enchantment"
  ];

  // projects labels + descriptions (2 per skill)
  const projectData = [
    [{title:"Moonlight Journal", desc:"A minimal CMS with soft transitions", link:"#"},
     {title:"Lunar Canvas", desc:"A responsive gallery with subtle motion", link:"#"}],

    [{title:"Echoes of Code", desc:"An interactive visualization toolkit", link:"#"},
     {title:"Async Aurora", desc:"A microservice puzzle of event flows", link:"#"}],

    [{title:"Realm Dashboard", desc:"Composable UI panels with smooth routing", link:"#"},
     {title:"Nebula Forms", desc:"Accessible form patterns with animation", link:"#"}],

    [{title:"Pointer Atelier", desc:"Tools built in C for efficient file ops", link:"#"},
     {title:"Binary Loom", desc:"Low-level utilities with careful memory use", link:"#"}],

    [{title:"Forge Engine", desc:"A compact DSA-driven game core", link:"#"},
     {title:"Graph Sonata", desc:"High-performance graph algorithms explained", link:"#"}],

    [{title:"Algorithmic Weave", desc:"Creative generative sketches & demos", link:"#"},
     {title:"Flow Sculptor", desc:"Interactive algorithm visualizer", link:"#"}],

    [{title:"Silent Framework", desc:"Micro-UX patterns for quiet interfaces", link:"#"},
     {title:"Orbital Prototypes", desc:"Rapid UI prototypes with polished motion", link:"#"}]
  ];

  // Place hubs in a pleasing spread (avoid edges)
  const hubs = [];
  const margin = 160;
  (function initHubs() {
    const cols = 4;
    const rows = 2;
    // generate grid-ish positions, then jitter
    const w = bg.width - margin * 2;
    const h = bg.height - margin * 2;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (idx >= skillLabels.length) break;
        const cx = margin + (c + 0.5) * (w / cols) + (Math.random() - 0.5) * 120;
        const cy = margin + (r + 0.5) * (h / rows) + (Math.random() - 0.5) * 90;
        hubs.push({
          id: idx,
          label: skillLabels[idx],
          x: cx,
          y: cy,
          baseX: cx,
          baseY: cy,
          radius: 8 + Math.random() * 3,
          brightness: 1,
          hover: 0,
          projects: []
        });
        idx++;
      }
    }

    // assign projects per hub
    hubs.forEach((hub, i) => {
      const pset = projectData[i];
      pset.forEach((pd, j) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 110 + Math.random() * 90;
        hub.projects.push({
          title: pd.title,
          desc: pd.desc,
          link: pd.link,
          angle: angle + (j === 0 ? 0 : Math.PI), // roughly opposite
          distance: dist,
          rotationSpeed: 0.004 + Math.random() * 0.004,
          size: 5 + Math.random() * 2,
          hover: 0,
          x: hub.x + Math.cos(angle) * dist,
          y: hub.y + Math.sin(angle) * dist
        });
      });
    });
  })();

  // tooltip DOM
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  tooltip.style.opacity = 0;
  document.body.appendChild(tooltip);

  // mouse state
  const mouse = { x: 0, y: 0, down: false };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // highlight logic
  function updateHoverStates() {
    let anyHover = false;
    hubs.forEach(h => { h.hover = 0; });
    hubs.forEach(h => {
      h.projects.forEach(p => { p.hover = 0; });
    });

    // check projects first
    hubs.forEach(h => {
      h.projects.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < (p.size * 3 + 6)) {
          p.hover = Math.max(p.hover, 1);
          // parent highlight
          h.hover = Math.max(h.hover, 0.9);
          anyHover = true;
          tooltip.innerHTML = `<strong>${p.title}</strong><br><span style="font-size:12px;color:#cbdcff">${p.desc}</span>`;
          tooltip.style.left = (mouse.x) + 'px';
          tooltip.style.top = (mouse.y - 12) + 'px';
          tooltip.style.opacity = 1;
        }
      });
    });

    // then hubs
    hubs.forEach(h => {
      const dx = mouse.x - h.x, dy = mouse.y - h.y;
      if (Math.hypot(dx, dy) < 28) {
        h.hover = Math.max(h.hover, 1);
        tooltip.innerHTML = `<strong>${h.label}</strong>`;
        tooltip.style.left = (mouse.x) + 'px';
        tooltip.style.top = (mouse.y - 12) + 'px';
        tooltip.style.opacity = 1;
        anyHover = true;
      }
    });

    if (!anyHover) tooltip.style.opacity = 0;
  }

  // click handling
  canvas.addEventListener('click', (e) => {
    // if user clicks over a project, open link
    const mx = e.clientX, my = e.clientY;
    for (const h of hubs) {
      for (const p of h.projects) {
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < p.size * 3 + 6) {
          // placeholder link — replace '#' with real URLs
          if (p.link && p.link !== '#') window.open(p.link, '_blank');
          else {
            // small snappy animation cue for placeholder
            p.hover = 1;
            setTimeout(()=>p.hover = 0, 300);
            // temporary default behavior: open new tab to #
            window.open('#', '_blank');
          }
          return;
        }
      }
    }
  });

  // animation loop
  let last = performance.now();
  function render(now) {
    const dt = now - last;
    last = now;

    // resize adapt if needed
    if (bg.width !== window.innerWidth || bg.height !== window.innerHeight) {
      resize();
      // recalc hub bases proportionally to keep pleasant spread (not huge layout shift)
      hubs.forEach((h,i)=> {
        h.baseX = Math.min(Math.max(h.baseX, 160), bg.width-160);
        h.baseY = Math.min(Math.max(h.baseY, 160), bg.height-160);
      });
    }

    // clear bg
    bgCtx.clearRect(0,0,bg.width,bg.height);

    // draw subtle moving nebula blobs (cool-blue/lavender)
    nebula.blobs.forEach(b => {
      b.x += b.vx * (dt * 0.02);
      b.y += b.vy * (dt * 0.02);
      b.t += 0.0006 * dt;
      const grd = bgCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      const h = b.hue;
      grd.addColorStop(0, `hsla(${h},80%,70%, ${b.alpha * 1.0})`);
      grd.addColorStop(0.5, `hsla(${h + 12},70%,55%, ${b.alpha * 0.45})`);
      grd.addColorStop(1, `rgba(0,0,0,0)`);
      bgCtx.globalCompositeOperation = 'lighter';
      bgCtx.fillStyle = grd;
      bgCtx.beginPath();
      bgCtx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
      bgCtx.fill();
      bgCtx.globalCompositeOperation = 'source-over';
    });

    // parallax stars (soft twinkle)
    for (const s of stars) {
      s.a += (Math.random() - 0.5) * s.tw;
      if (s.a < 0.1) s.a = 0.1;
      if (s.a > 1) s.a = 1;
      bgCtx.globalAlpha = s.a * 0.95;
      bgCtx.fillStyle = '#ffffff';
      bgCtx.beginPath(); bgCtx.arc(s.x, s.y, s.r, 0, Math.PI*2); bgCtx.fill();
    }
    bgCtx.globalAlpha = 1;

    // update hubs (gentle drift)
    for (let i=0;i<hubs.length;i++){
      const h = hubs[i];
      // subtle float
      h.x += Math.cos((now*0.0002)+(i))*0.02;
      h.y += Math.sin((now*0.00017)+(i))*0.02;
      // animate projects orbit
      h.projects.forEach(p => {
        p.angle += p.rotationSpeed * (dt*0.06);
        p.x = h.x + Math.cos(p.angle) * p.distance;
        p.y = h.y + Math.sin(p.angle) * p.distance;
      });
    }

    // update hover states
    updateHoverStates();

    // draw connecting lines and nodes onto proj canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // draw connections first (thin glow)
    hubs.forEach(h => {
      h.projects.forEach(p => {
        // compute highlight factor
        const highlight = Math.max(h.hover, p.hover);
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(130,170,255, ${0.18 + 0.5*highlight})`;
        ctx.lineWidth = 1 + 2*highlight;
        ctx.stroke();
      });
    });

    // draw project nodes (orbiters)
    hubs.forEach(h => {
      h.projects.forEach(p => {
        const hl = p.hover || h.hover;
        // glow halo
        if (hl) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size*4 + 6*hl, 0, Math.PI*2);
          ctx.fillStyle = `rgba(170,200,255, ${0.06 + 0.12*hl})`;
          ctx.fill();
        }

        // core node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (hl?1.6:0), 0, Math.PI*2);
        ctx.fillStyle = `rgba(220,235,255, ${0.95})`;
        ctx.shadowBlur = 8 * (hl?1.2:0.6);
        ctx.shadowColor = 'rgba(160,190,255,0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // project title
        ctx.font = '13px Lora';
        ctx.fillStyle = '#cbe2ff';
        ctx.textAlign = 'center';
        ctx.fillText(p.title, p.x, p.y - 12);

        // short desc smaller
        ctx.font = '11px Lora';
        ctx.fillStyle = 'rgba(200,215,255,0.9)';
        ctx.fillText(p.desc, p.x, p.y + 16);
      });
    });

    // draw hubs last (on top)
    hubs.forEach(h => {
      const hl = h.hover;
      // halo
      ctx.beginPath();
      ctx.arc(h.x, h.y, 18 + 8*hl, 0, Math.PI*2);
      ctx.fillStyle = `rgba(150,180,255, ${0.06 + 0.12*hl})`;
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius + (hl?2.5:0), 0, Math.PI*2);
      ctx.fillStyle = 'rgba(150,185,255,0.98)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(140,170,255,0.9)';
      ctx.fill();
      ctx.shadowBlur = 0;
      // label
      ctx.font = '14px Cinzel';
      ctx.fillStyle = '#e6eeff';
      ctx.textAlign = 'center';
      ctx.fillText(h.label, h.x, h.y - 26);
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // expose hubs for console debugging if needed
  window.__PJ__ = { hubs };
})();
