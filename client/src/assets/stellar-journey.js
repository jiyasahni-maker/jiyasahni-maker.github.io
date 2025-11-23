/* stellar-journey.js — final corrected version
   - preserves nebula, stars, orbs, supernova, tooltip, keyboard nav
   - REMOVED the footer auto-placement block that caused overlap
*/

/* ---------- Canvas + resize ---------- */
const canvas = document.getElementById('journeyCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
function onResize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  layoutOrbs();
}
window.addEventListener('resize', () => requestAnimationFrame(onResize));

/* ---------- Data (initial) & API ---------- */
let milestones = [
  { id:'m1', title:'The Dawn', sub:'XYZ University', desc:'The spark — when I first met code. Every “hello world” felt like a star flickering to life. Curiosity was the universe’s first gift..', img:'https://i.pinimg.com/736x/a7/06/4f/a7064f32e1e0697f44f023c2dea2711c.jpg', year:2025, type:'edu', link: '' },
  { id:'m2', title:'The Awakening (2026)', sub:'InterHack 2024', desc:'Discovered my fascination with Cybersecurity — the art of guardianship — and AI, where logic dreams. Nights blurred into learning loops and code constellations.', img:'https://i.pinimg.com/736x/02/0e/97/020e975e3cbb5a92b77786a21df90e51.jpg', year:2024, type:'ach', link: '' },
  { id:'m3', title:'The Ascent', sub:'SecAnalyst 2023', desc:'Built systems that felt alive: security tools that think, designs that breathe. My projects became galaxies — structured yet unpredictable..', img:'https://i.pinimg.com/736x/fe/9b/77/fe9b770e23903a278414cb4cb5d54637.jpg', year:2023, type:'edu', link: '' },
  { id:'m4', title:'The Continuum', sub:'Top 5% — 2022', desc:'Still orbiting. Still exploring. Each keystroke a new eclipse, each creation a pulse in the cosmic network I call my craft.', img:'https://i.pinimg.com/736x/1c/b8/a6/1cb8a67d4ec2ba8d0dad4eb8e964e7c7.jpg', year:2022, type:'ach', link: '' }
];

function addMilestone(m){
  m.id = m.id || ('m' + (milestones.length + 1));
  milestones.push(m);
  layoutOrbs();
  addToScreenReaderList(m);
}
function getMilestones(){ return milestones; }
window.addMilestone = addMilestone;
window.getMilestones = getMilestones;

/* ---------- Screen-reader list helper ---------- */
const srList = document.getElementById('milestone-list');
function addToScreenReaderList(m){
  if(!srList) return;
  const li = document.createElement('li');
  li.textContent = `${m.year} — ${m.title} — ${m.sub}`;
  srList.appendChild(li);
}
milestones.forEach(addToScreenReaderList);

/* ---------- Layout: orbs (spiral) ---------- */
let orbs = [];
function layoutOrbs(){
  orbs = [];
  const cx = W/2;
  const cy = H/2.6;
  const count = Math.max(1, milestones.length);
  const spiralSpacing = Math.min(W, H) / 14;
  const baseRadius = Math.min(W, H) / 10;
  const spread = 1.12 + (count * 0.02);
  milestones.forEach((m, i) => {
    const t = i / Math.max(1, count - 1);
    const angle = -Math.PI/2 + t * Math.PI * (1.4 * spread);
    const radius = baseRadius + i * spiralSpacing * 0.92;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.78;
    orbs.push({
      x, y, baseX: x, baseY: y,
      radius: 8 + (m.type === 'ach' ? 3.5 : 0),
      data: m,
      angle
    });
  });
}
layoutOrbs();

/* ---------- Visual elements: nebula, stars, shooting ---------- */
let nebulaT = 0;
const bgStars = Array.from({length: Math.min(260, Math.max(120, Math.floor((W*H)/9000)))}, ()=>({
  x: Math.random()*W, y: Math.random()*H,
  r: 0.6 + Math.random()*1.6, alphaBase: 0.5 + Math.random()*0.5,
  phase: Math.random()*Math.PI*2, speed: 0.01 + Math.random()*0.03
}));
let shooting = [];
function spawnShooting(){ if(Math.random() > 0.988) shooting.push({
  x: Math.random()*W*0.6, y: Math.random()*H*0.45,
  len: 100 + Math.random()*140, vx: 6 + Math.random()*9, vy: 1 + Math.random()*2, life: 0
}); }

/* ---------- Supernova (center) ---------- */
const supernova = {
  enabled: true,
  centerX: () => W/2, centerY: () => H/2.6
};
window.setSupernova = (obj) => { Object.assign(supernova, obj); supernova.enabled = true; };

/* ---------- Parallax ---------- */
let px = 0, py = 0;
document.addEventListener('mousemove', (e)=> {
  const nx = (e.clientX / W - 0.5) * 2, ny = (e.clientY / H - 0.5) * 2;
  px = nx * 30; py = ny * 25;
});

/* ---------- DOM Card + Tooltip ---------- */
/* Card (detailed) */
const card = document.createElement('div');
card.className = 'milestone-card';
card.innerHTML = `
  <button class="milestone-close" aria-label="Close">✦</button>
  <div class="card-top">
    <img class="thumb" src="" alt="">
    <div>
      <h3 class="card-title"></h3>
      <div class="milestone-meta card-sub"></div>
    </div>
  </div>
  <p class="card-desc"></p>
  <div style="margin-top:.6rem"><a class="card-link" href="#" target="_blank" rel="noopener" style="color:var(--accent-2);text-decoration:none;font-weight:600">Open</a></div>
`;
document.body.appendChild(card);
/* ensure hidden until used */
card.style.display = 'none';
card.setAttribute('aria-hidden', 'true');
card.querySelector('.milestone-close').addEventListener('click', ()=> { hideCard(); focused = null; });

/* Tooltip (short, hover-only) */
const tooltip = document.createElement('div');
tooltip.className = 'sj-tooltip';
tooltip.style.position = 'fixed';
tooltip.style.padding = '8px 10px';
tooltip.style.background = 'rgba(8,10,18,0.9)';
tooltip.style.border = '1px solid rgba(180,200,255,0.06)';
tooltip.style.borderRadius = '8px';
tooltip.style.fontFamily = "Cinzel, serif";
tooltip.style.fontSize = '13px';
tooltip.style.color = '#e6ecff';
tooltip.style.pointerEvents = 'none';
tooltip.style.boxShadow = '0 8px 30px rgba(10,12,30,0.6)';
tooltip.style.transform = 'translate(-50%, -130%)';
tooltip.style.opacity = '0';
tooltip.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
tooltip.style.zIndex = '95';
document.body.appendChild(tooltip);

/* One-time hint (non-blocking) */
const hint = document.createElement('div');
hint.className = 'sj-hint';
hint.textContent = 'Tip: hover or tap a star to learn more';
Object.assign(hint.style, {
  position:'fixed', left:'50%', top:'84%', transform:'translateX(-50%)',
  background:'rgba(12,14,22,0.85)', color:'#cfd5f8', padding:'8px 12px', borderRadius:'10px',
  zIndex:70, fontFamily:'Lora, serif', fontSize:'13px', boxShadow:'0 8px 30px rgba(6,8,16,0.6)', opacity:0, transition:'opacity .5s ease'
});
if(!localStorage.getItem('sj_seen_hint')) {
  document.body.appendChild(hint);
  requestAnimationFrame(()=> hint.style.opacity = '1');
  setTimeout(()=> { hint.style.opacity = '0'; localStorage.setItem('sj_seen_hint','1'); setTimeout(()=> hint.remove(), 600); }, 5200);
}

/* ---------- Interaction: pointer handling (robust, large hitboxes) ---------- */
let hovered = null, focused = null;
const HIT_PADDING = 18; // extra hit area in pixels

canvas.addEventListener('pointermove', (e)=>{
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  hovered = null;
  for (let i = orbs.length - 1; i >= 0; i--){
    const o = orbs[i];
    const dx = mx - (o.x + px*0.08);
    const dy = my - (o.y + py*0.06);
    const hitRadius = o.radius * 6 + HIT_PADDING;
    if (Math.hypot(dx, dy) < hitRadius) { hovered = o; break; }
  }
  canvas.style.cursor = hovered ? 'pointer' : 'default';
  if (hovered) showTooltip(hovered, e.clientX, e.clientY); else hideTooltip();
}, { passive: true });

canvas.addEventListener('pointerdown', (e) => {
  if (hovered){
    focused = hovered;
    showCard(focused, e.clientX, e.clientY);
  } else {
    focused = null;
    hideCard();
  }
});

/* keyboard nav */
let idx = -1;
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { idx = (idx + 1) % orbs.length; focused = orbs[idx]; showCard(focused, focused.baseX + 40, focused.baseY); }
  if (e.key === 'ArrowLeft') { idx = (idx - 1 + orbs.length) % orbs.length; focused = orbs[idx]; showCard(focused, focused.baseX + 40, focused.baseY); }
  if (e.key === 'Enter') { if (focused) showCard(focused, focused.baseX + 40, focused.baseY); }
  if (e.key === 'Escape') { focused = null; hideCard(); }
});

/* ---------- Tooltip helpers ---------- */
function showTooltip(o, clientX, clientY){
  tooltip.textContent = o.data.sub || o.data.title;
  tooltip.style.left = `${clientX}px`;
  tooltip.style.top = `${clientY}px`;
  tooltip.style.opacity = '1';
  tooltip.style.transform = 'translate(-50%, -150%) scale(1)';
}
function hideTooltip(){
  tooltip.style.opacity = '0';
  tooltip.style.transform = 'translate(-50%, -130%) scale(.98)';
}

/* ---------- Card helpers (detailed) ---------- */
function showCard(o, clientX, clientY){
  card.querySelector('.card-title').textContent = o.data.title;
  card.querySelector('.card-sub').textContent = `${o.data.sub} • ${o.data.year}`;
  card.querySelector('.card-desc').textContent = o.data.desc;
  card.querySelector('.thumb').src = o.data.img || 'https://placehold.co/300x200';
  const linkEl = card.querySelector('.card-link');
  if (o.data.link) { linkEl.href = o.data.link; linkEl.style.visibility = 'visible'; } else { linkEl.style.visibility = 'hidden'; }
  const w = Math.min(460, Math.max(300, Math.floor(W*0.28)));
  const h = 240, pad = 18;
  let left = clientX + 18, top = clientY - h/2;
  if (left + w > W - pad) left = clientX - w - 18;
  if (top + h > H - pad) top = H - h - pad;
  if (top < pad) top = pad;
  card.style.left = `${left}px`; card.style.top = `${top}px`; card.style.width = `${w}px`;
  card.style.display = 'block';
  card.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=> card.classList.add('visible'));
}
function hideCard(){
  card.classList.remove('visible');
  setTimeout(()=> { card.style.display = 'none'; card.setAttribute('aria-hidden','true'); }, 260);
}

/* ---------- Drawing helpers ---------- */
function drawNebula(t){
  nebulaT += 0.002;
  const blobs = Math.min(5 + Math.floor(milestones.length / 3), 12);
  for(let i=0;i<blobs;i++){
    const gx = ctx.createRadialGradient(
      (0.15 + (i / blobs) * 0.7) * W + Math.cos(nebulaT*(0.6+i*0.1))*40,
      (0.12 + (i%2?0.5:0.35)) * H + Math.sin(nebulaT*(0.4+i*0.07))*30,
      0,
      (0.15 + (i / blobs) * 0.7) * W,
      (0.12 + (i%2?0.5:0.35)) * H,
      Math.max(W,H)*0.6 + i*40
    );
    const a = 0.04 + (i * 0.008);
    gx.addColorStop(0, `rgba(90, 100, 200, ${a})`);
    gx.addColorStop(1, 'rgba(5, 5, 15, 0)');

    ctx.fillStyle = gx;
    ctx.fillRect(0,0,W,H);
  }
}

function drawBgStars(time){
  for(let s of bgStars){
    s.x += (Math.sin(time*0.0001 + s.phase) * 0.02);
    const a = Math.max(0, Math.min(1, s.alphaBase + Math.sin(time * s.speed + s.phase) * 0.5));
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.fillStyle = '#f4f8ff';
    ctx.shadowColor = '#b8c9ff';
    ctx.shadowBlur = 6;
    ctx.arc(s.x + (px*0.04), s.y + (py*0.03), s.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawShooting(dt){
  for(let i = shooting.length-1; i >= 0; i--){
    const s = shooting[i];
    s.x += s.vx * (dt/16);
    s.y += s.vy * (dt/16);
    s.life += dt;
    const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*s.len/12, s.y - s.vy*s.len/12);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*s.len/12, s.y - s.vy*s.len/12); ctx.stroke();
    if(s.x > W+200 || s.y > H+200 || s.life > 2200) shooting.splice(i,1);
  }
}

function drawPath(){
  if(orbs.length < 2) return;
  ctx.beginPath();
  for(let i=0;i<orbs.length;i++){
    const o = orbs[i];
    const x = o.x + px*0.08, y = o.y + py*0.06;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle = 'rgba(160,170,230,0.06)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawOrbs(time){
  for(let o of orbs){
    const pulse = 1 + Math.sin(time*0.002 + o.angle*6) * 0.06;
    ctx.beginPath();
    const fill = (o.data.type === 'ach') ? `rgba(190,170,255,0.95)` : `rgba(150,180,255,0.92)`;
    const glow = (o.data.type === 'ach') ? 'rgba(200,180,255,0.6)' : 'rgba(160,190,255,0.7)';
    ctx.fillStyle = fill;
    ctx.shadowBlur = (hovered === o || focused === o) ? 32 : 14;
    ctx.shadowColor = glow;
    ctx.arc(o.x + px*0.08, o.y + py*0.06, o.radius * pulse, 0, Math.PI*2);
    ctx.fill();
    ctx.font = '12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(225,230,255,0.92)';
    ctx.fillText(o.data.title, o.x + px*0.08, o.y + py*0.06 - (o.radius*5));
  }
}

/* Supernova */
let snPulse = 0;
function drawSupernova(time){
  if(!supernova.enabled) return;
  snPulse += 0.03;
  const cx = supernova.centerX(), cy = supernova.centerY();
  for(let r=0;r<4;r++){
    const rr = 42 + r*26 + Math.sin(time*0.001 + r)*6;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,220,160,${0.06 - r*0.01 + 0.02*Math.sin(time*0.0009 + r)})`;
    ctx.lineWidth = 2;
    ctx.arc(cx + px*0.02, cy + py*0.02, rr, 0, Math.PI*2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.fillStyle = 'rgba(200,190,255,0.98)';
  ctx.shadowColor = '#c7baff';
  ctx.shadowBlur = 30;
  ctx.arc(cx + px*0.02, cy + py*0.02, 18 + Math.sin(snPulse)*3, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ---------- Animation loop ---------- */
let last = performance.now();
function loop(now){
  const dt = now - last; last = now;
  ctx.clearRect(0,0,W,H);

  drawNebula(now);
  drawBgStars(now);

  if(Math.random() > 0.996) spawnShooting();
  drawShooting(dt);

  drawPath();
  drawSupernova(now);

  for(let o of orbs){
    if(hovered === o) { o.x += (o.baseX - o.x) * 0.06; o.y += (o.baseY - 12 - o.y) * 0.06; }
    else { o.x += (o.baseX - o.x) * 0.04; o.y += (o.baseY - o.y) * 0.04; }
  }
  drawOrbs(now);

  if(focused){
    const cx = focused.baseX + px*0.08;
    const cy = focused.baseY + py*0.06;
    showCardFollow(focused, cx + 40, cy);
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* keep card positioned while focused */
function showCardFollow(o, cx, cy){
  if(card.style.display === 'block' && card.classList.contains('visible') && focused === o){
    const w = parseInt(card.style.width || Math.min(420, Math.floor(W*0.28)));
    const h = 240, pad = 18;
    let left = cx + 18, top = cy - h/2;
    if(left + w > W - pad) left = cx - w - 18;
    if(top + h > H - pad) top = H - h - pad;
    if(top < pad) top = pad;
    card.style.left = `${left}px`; card.style.top = `${top}px`;
    return;
  }
  showCard(o, cx, cy);
}

/* ---------- Ensure layout initial & expose API ---------- */
layoutOrbs();
window.setSupernova = window.setSupernova || ((o)=>Object.assign(supernova,o));
window.addMilestone = addMilestone;
window.getMilestones = getMilestones;

/* ---------------------------------------------------------------
   IMPORTANT: footer auto-placement block intentionally REMOVED.
   The footer is now positioned via CSS only to avoid conflicts.
   --------------------------------------------------------------- */
