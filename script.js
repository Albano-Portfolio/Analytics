/* ================================================================
   JASON L. ALBANO — Senior AI-Enabled Healthcare Data Analyst
   script.js

   SPECIAL EFFECTS:
   1.  Theme Toggle
   2.  Navigation (sticky + hamburger + active links)
   3.  Typewriter (hero subtitle)
   4.  Neural Network Canvas (hero background)
   5.  Data Streams (matrix-style falling columns, global)
   6.  Floating Metric Chips (drift upward across screen)
   7.  AI Pipeline Canvas (about section visual)
   8.  Stat Counter Animations (hero numbers count up)
   9.  3D Tilt Cards (mouse-tracking on all .tilt-card elements)
   10. Scroll Reveal Animations
   11. Back to Top button
   12. Contact Form (mailto handler)
   13. Resume Download fallback
   14. PD Scroll drag-to-scroll
   15. Tool Tooltips
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

/* ─── 1. THEME TOGGLE ─────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('portfolio-theme') || 'dark';
if (saved === 'light') html.setAttribute('data-theme', 'light');

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* ─── 2. NAVIGATION ───────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
});

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
  const pos = window.scrollY + 120;
  sections.forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`);
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Smooth anchor scroll with navbar offset
const NAV_OFFSET = 80;
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t || a.getAttribute('href') === '#') return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: 'smooth' });
  });
});

document.getElementById('backToTop').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ─── 3. TYPEWRITER ───────────────────────────────────────────── */
const twEl = document.getElementById('typewriterText');
const phrases = [
  'Healthcare Data Analyst',
  'AI Analytics Specialist',
  'Databricks Certified',
  'Claims Analytics Expert',
  'Prior Auth AI Automation',
  'Cost Containment Strategist',
  'BI & Dashboard Developer',
  'Prompt Engineering Practitioner',
  'Stanford AI in Healthcare',
  'Enterprise BI Leader',
];
let pi = 0, ci = 0, del = false, delay = 80;

function type() {
  const cur = phrases[pi];
  twEl.textContent = del
    ? cur.substring(0, ci - 1)
    : cur.substring(0, ci + 1);
  del ? ci-- : ci++;
  if (!del && ci === cur.length) { delay = 2200; del = true; }
  else if (del && ci === 0)      { del = false; pi = (pi + 1) % phrases.length; delay = 350; }
  else                            { delay = del ? 38 : 80; }
  setTimeout(type, delay);
}
setTimeout(type, 900);

/* ─── 4. NEURAL NETWORK CANVAS ────────────────────────────────── */
const nc = document.getElementById('neuralCanvas');
if (nc) {
  const ctx = nc.getContext('2d');
  let nodes = [], raf;

  function resize() {
    nc.width  = nc.offsetWidth;
    nc.height = nc.offsetHeight;
    initNodes();
  }

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * nc.width;
      this.y  = init ? Math.random() * nc.height : nc.height + 10;
      this.vx = (Math.random() - .5) * .35;
      this.vy = -Math.random() * .4 - .1;
      this.r  = Math.random() * 2.5 + 1;
      this.a  = Math.random() * .55 + .1;
      this.pulse = Math.random() * Math.PI * 2;
      // color: mix of cyan, teal, purple
      const c = Math.random();
      this.color = c < .55 ? '#00D4FF' : c < .8 ? '#00B8A0' : '#9B5DE5';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += .025;
      this.a = .15 + Math.sin(this.pulse) * .12;
      if (this.y < -10 || this.x < -20 || this.x > nc.width + 20) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initNodes() {
    nodes = [];
    const n = Math.max(40, Math.floor(nc.width * nc.height / 9000));
    for (let i = 0; i < n; i++) nodes.push(new Node());
  }

  function drawEdges() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 110) * .07;
          ctx.strokeStyle = '#00D4FF';
          ctx.lineWidth   = .8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, nc.width, nc.height);
    drawEdges();
    nodes.forEach(n => { n.update(); n.draw(); });
    raf = requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); animate(); });
}

/* ─── 5. DATA STREAMS (healthcare-themed matrix columns) ─────── */
const streamWrap = document.getElementById('dataStreams');
if (streamWrap) {
  const streamData = [
    'ICD10','CPT','DRG','HCPCS','NDC','NPI','HEDIS','CLAIMS',
    'SQL','0x3F','REGEX','JOIN','QUERY','INDEX','VIEW','PROC',
    '0.974','0.882','0.997','0.741','97.4%','88.2%',
    'AI','LLM','GPT','ML','NLP','RAG','ETL','API',
    'RX','DX','PX','ER','ICU','CMS','FWA','TMC',
  ];
  const cols = Math.floor(window.innerWidth / 22);
  for (let i = 0; i < cols; i++) {
    const col = document.createElement('div');
    col.className = 'data-stream-col';
    col.style.left = `${i * 22}px`;
    col.style.animationDuration = `${8 + Math.random() * 14}s`;
    col.style.animationDelay   = `-${Math.random() * 20}s`;
    const len = 15 + Math.floor(Math.random() * 20);
    for (let j = 0; j < len; j++) {
      const span = document.createElement('span');
      span.textContent = streamData[Math.floor(Math.random() * streamData.length)];
      col.appendChild(span);
    }
    streamWrap.appendChild(col);
  }
}

/* ─── 6. FLOATING METRIC CHIPS ────────────────────────────────── */
const fmWrap = document.getElementById('floatingMetrics');
if (fmWrap) {
  const metrics = [
    'SQL ▲', 'AI Enabled', 'Claims Analytics', 'Databricks ✓',
    'HEDIS', 'NLP Active', 'Cost Savings', 'Power BI',
    'Prior Auth AI', 'TMC Analytics', 'FWA Detection', 'Snowflake ✓',
    'Tableau ✓', 'Python', 'Prompt Eng.', 'Healthcare AI',
    'Stanford ✓', 'Gov. Certified', 'Delta Lake', 'GenAI',
  ];

  function spawnChip() {
    const chip = document.createElement('div');
    chip.className = 'float-chip';
    chip.textContent = metrics[Math.floor(Math.random() * metrics.length)];
    chip.style.left    = `${5 + Math.random() * 88}vw`;
    chip.style.bottom  = '-40px';
    const dur = 18 + Math.random() * 22;
    chip.style.animationDuration = `${dur}s`;
    chip.style.animationDelay   = '0s';
    fmWrap.appendChild(chip);
    setTimeout(() => chip.remove(), dur * 1000 + 500);
  }

  // Initial batch
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnChip, i * 2000);
  }
  setInterval(spawnChip, 3500);
}

/* ─── 7. AI PIPELINE CANVAS (about section) ──────────────────── */
const pc = document.getElementById('pipelineCanvas');
if (pc) {
  const ctx = pc.getContext('2d');
  pc.width  = 320;
  pc.height = 360;

  // Nodes representing the AI data pipeline
  const pNodes = [
    { x:160, y:40,  label:'Raw Claims',      color:'#9B5DE5', r:28 },
    { x:80,  y:120, label:'SQL\nEngine',     color:'#00D4FF', r:24 },
    { x:240, y:120, label:'Python\nPipeline',color:'#00B8A0', r:24 },
    { x:160, y:200, label:'Databricks\nGenie',color:'#F5A623',r:28 },
    { x:80,  y:290, label:'BI\nDashboard',   color:'#00D4FF', r:22 },
    { x:240, y:290, label:'AI\nInsights',    color:'#9B5DE5', r:22 },
  ];

  // Connections
  const edges = [
    [0,1],[0,2],[1,3],[2,3],[3,4],[3,5]
  ];

  // Animated particles travelling along edges
  const particles = [];
  edges.forEach(([a,b]) => {
    for (let i = 0; i < 2; i++) {
      particles.push({
        a, b,
        t: Math.random(),
        speed: .003 + Math.random() * .004,
        color: ['#00D4FF','#00B8A0','#9B5DE5','#F5A623'][Math.floor(Math.random()*4)]
      });
    }
  });

  let tick = 0;

  function drawPipeline() {
    ctx.clearRect(0, 0, 320, 360);
    tick++;

    // Draw edges
    edges.forEach(([a, b]) => {
      const na = pNodes[a], nb = pNodes[b];
      const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
      grad.addColorStop(0, na.color + '40');
      grad.addColorStop(1, nb.color + '40');
      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -tick * .5;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Draw particles
    particles.forEach(p => {
      p.t = (p.t + p.speed) % 1;
      const na = pNodes[p.a], nb = pNodes[p.b];
      const x = na.x + (nb.x - na.x) * p.t;
      const y = na.y + (nb.y - na.y) * p.t;
      ctx.save();
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 8;
      ctx.globalAlpha = .9;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw nodes
    pNodes.forEach((n, i) => {
      const pulse = Math.sin(tick * .04 + i * .9) * .08 + .92;
      const r = n.r * pulse;

      // glow ring
      ctx.save();
      ctx.strokeStyle = n.color;
      ctx.lineWidth   = 1;
      ctx.globalAlpha = .2 + Math.sin(tick * .05 + i) * .08;
      ctx.shadowColor = n.color;
      ctx.shadowBlur  = 14;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // node fill
      ctx.save();
      const g = ctx.createRadialGradient(n.x - r*.3, n.y - r*.3, r*.1, n.x, n.y, r);
      g.addColorStop(0, n.color + 'CC');
      g.addColorStop(1, n.color + '22');
      ctx.fillStyle   = g;
      ctx.strokeStyle = n.color;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = .9;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // label
      ctx.save();
      ctx.fillStyle   = '#E8EDF5';
      ctx.font        = `bold ${n.r > 25 ? 9 : 8}px 'JetBrains Mono', monospace`;
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.globalAlpha = .95;
      const lines = n.label.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, n.x, n.y + (li - (lines.length-1)/2) * 11);
      });
      ctx.restore();
    });

    requestAnimationFrame(drawPipeline);
  }

  // Animate the live counter chips in about section
  let claimsCount = 48204;
  setInterval(() => {
    claimsCount += Math.floor(Math.random() * 12 + 3);
    const el = document.getElementById('claimsVal');
    if (el) el.textContent = claimsCount.toLocaleString();
  }, 1200);

  let accuracy = 97.4;
  setInterval(() => {
    accuracy = 96.8 + Math.random() * 1.4;
    const el = document.getElementById('accuracyVal');
    if (el) el.textContent = accuracy.toFixed(1) + '%';
  }, 3000);

  drawPipeline();
}

/* ─── 8. STAT COUNTER ANIMATIONS ─────────────────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

// Trigger counters when hero stats scroll into view
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      statNumbers.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObs.disconnect();
    }
  });
}, { threshold: .5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

/* ─── 9. 3D TILT CARDS ────────────────────────────────────────── */
const tiltCards = document.querySelectorAll('.tilt-card');

// Inject shine div into each tilt card
tiltCards.forEach(card => {
  // Only add if not already present
  if (!card.querySelector('.tilt-shine')) {
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.style.position = 'relative';
    card.appendChild(shine);
  }
});

function applyTilt(card, e) {
  const rect = card.getBoundingClientRect();
  const cx   = rect.left + rect.width / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = (e.clientX - cx) / (rect.width  / 2);
  const dy   = (e.clientY - cy) / (rect.height / 2);

  const rotX = dy * -7;  // degrees
  const rotY = dx *  7;

  card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.025)`;
  card.style.boxShadow = `${-dx * 10}px ${-dy * 10}px 30px rgba(0,212,255,0.10)`;

  // Update shine position via CSS vars
  const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
  const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
  card.style.setProperty('--mx', `${mx}%`);
  card.style.setProperty('--my', `${my}%`);
}

function resetTilt(card) {
  card.style.transform  = '';
  card.style.boxShadow  = '';
}

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => applyTilt(card, e));
  card.addEventListener('mouseleave', () => resetTilt(card));
  // Disable tilt on touch devices
  card.addEventListener('touchstart', () => resetTilt(card), { passive: true });
});

/* ─── 10. SCROLL REVEAL ANIMATIONS ───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right');

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: .10, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

/* ─── Skill tag pop-in ─── */
const skillCats = document.querySelectorAll('.skill-category');
const tagStyle = document.createElement('style');
tagStyle.textContent = `
  @keyframes tagPop{0%{opacity:0;transform:scale(.8) translateY(6px)}60%{transform:scale(1.06) translateY(-1px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  .tag-pop{animation:tagPop .4s ease forwards;opacity:0}
`;
document.head.appendChild(tagStyle);

if ('IntersectionObserver' in window) {
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-tag').forEach((tag, i) => {
          tag.style.animationDelay = `${i * .055}s`;
          tag.classList.add('tag-pop');
        });
        sObs.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  skillCats.forEach(c => sObs.observe(c));
}

/* ─── 11. BACK TO TOP handled inline in nav scroll listener ───── */

/* ─── 12. CONTACT FORM — mailto handler ──────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) { alert('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email.'); return; }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body    = encodeURIComponent(`Hi Jason,\n\nMy name is ${name} and my email is ${email}.\n\n${message}\n\nBest regards,\n${name}`);
    window.location.href = `mailto:Japi782004@yahoo.com?subject=${subject}&body=${body}`;

    submitBtn.textContent = '✓ Opening your email app…';
    submitBtn.style.background = 'var(--teal)';
    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

/* ─── 13. RESUME DOWNLOAD FALLBACK ───────────────────────────── */
const resumeBtn  = document.getElementById('resumeDownloadBtn');
const resumeNote = document.getElementById('resumeNote');
if (resumeBtn && resumeNote) {
  resumeBtn.addEventListener('click', async e => {
    try {
      const res = await fetch('Jason_Albano_Resume.pdf', { method: 'HEAD' });
      if (!res.ok) { e.preventDefault(); resumeNote.style.display = 'block'; }
    } catch { e.preventDefault(); resumeNote.style.display = 'block'; }
  });
}

/* ─── 14. PD SCROLL DRAG ─────────────────────────────────────── */
const pdWrap = document.querySelector('.pd-scroll-wrap');
if (pdWrap) {
  let dragging = false, sx, sl;
  pdWrap.addEventListener('mousedown', e => { dragging=true; sx=e.pageX-pdWrap.offsetLeft; sl=pdWrap.scrollLeft; pdWrap.style.cursor='grabbing'; });
  pdWrap.addEventListener('mouseleave', () => { dragging=false; pdWrap.style.cursor=''; });
  pdWrap.addEventListener('mouseup',    () => { dragging=false; pdWrap.style.cursor=''; });
  pdWrap.addEventListener('mousemove',  e => { if (!dragging) return; e.preventDefault(); pdWrap.scrollLeft=sl-(e.pageX-pdWrap.offsetLeft-sx)*1.5; });
}

/* ─── 15. TOOL TOOLTIPS ──────────────────────────────────────── */
const tip = document.createElement('div');
tip.style.cssText = 'position:fixed;background:rgba(6,12,24,.96);border:1px solid rgba(0,212,255,.2);color:#E8EDF5;padding:4px 10px;border-radius:6px;font-family:var(--font-mono);font-size:11px;pointer-events:none;z-index:9000;opacity:0;transition:opacity .15s;white-space:nowrap;backdrop-filter:blur(8px)';
tip.setAttribute('role', 'tooltip');
document.body.appendChild(tip);

document.querySelectorAll('.tool-item[data-tip]').forEach(el => {
  el.addEventListener('mouseenter',  () => { tip.textContent = el.dataset.tip; tip.style.opacity = '1'; });
  el.addEventListener('mousemove',   e  => { tip.style.left = `${e.clientX + 14}px`; tip.style.top = `${e.clientY - 28}px`; });
  el.addEventListener('mouseleave',  () => { tip.style.opacity = '0'; });
});

/* ─── Console signature ──────────────────────────────────────── */
console.log('%c Jason L. Albano','color:#00D4FF;font-family:monospace;font-size:14px;font-weight:700');
console.log('%c Senior AI-Enabled Healthcare Data Analyst · Nashville, TN','color:#7A8BA8;font-family:monospace;font-size:11px');
console.log('%c https://github.com/Albano-Portfolio','color:#00B8A0;font-family:monospace;font-size:10px');

}); // end DOMContentLoaded
