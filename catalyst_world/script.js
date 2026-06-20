/* =============================================
   CATALYST — JavaScript
   Particles, Scroll Effects, Animations
   ============================================= */

// ---- STEP 1: ADD REVEAL CLASSES FIRST (before observer setup) ----
(function addRevealClasses() {
  const revealTargets = [
    { selector: '.stat-card', cls: 'reveal', delayStep: 100 },
    { selector: '.city-card', cls: 'reveal', delayStep: 200 },
    { selector: '.faction-card', cls: 'reveal', delayStep: 150 },
    { selector: '.spark-card', cls: 'reveal', delayStep: 80 },
    { selector: '.intro-text', cls: 'reveal-left', delayStep: 0 },
    { selector: '.intro-stat-grid', cls: 'reveal-right', delayStep: 0 },
    { selector: '.section-header', cls: 'reveal', delayStep: 0 },
    { selector: '.conflict-desc', cls: 'reveal', delayStep: 0 },
    { selector: '.versus-row', cls: 'reveal', delayStep: 0 },
  ];

  revealTargets.forEach(({ selector, cls, delayStep }) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add(cls);
      el.dataset.revealDelay = idx * delayStep;
    });
  });
})();

// ---- STEP 2: SET UP SCROLL REVEAL OBSERVER ----
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  els.forEach(el => observer.observe(el));
})();

// ---- PARTICLE SYSTEM ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  const PARTICLE_COUNT = 80;
  const particles = [];

  const colors = [
    'rgba(74, 159, 255, ',
    'rgba(0, 255, 106, ',
    'rgba(201, 162, 39, ',
    'rgba(168, 212, 255, ',
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opacityDir = (Math.random() - 0.5) * 0.003;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 400;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacityDir;
      this.life++;

      if (this.opacity <= 0.05 || this.opacity >= 0.65) this.opacityDir *= -1;

      if (
        this.x < -10 || this.x > W + 10 ||
        this.y < -10 || this.y > H + 10 ||
        this.life > this.maxLife
      ) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.x = Math.random() * W;
    p.y = Math.random() * H;
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function drawConnections() {
    const MAX_DIST = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(74, 159, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    for (const p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();

// ---- NAVIGATION SCROLL EFFECT ----
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- ANIMATE METER BARS ON SCROLL ----
(function initMeterBars() {
  const fills = document.querySelectorAll('.meter-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetWidth = el.dataset.targetWidth;
        setTimeout(() => {
          el.style.width = targetWidth;
        }, 300);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(f => {
    const w = f.style.width;
    f.dataset.targetWidth = w;
    f.style.width = '0';
    observer.observe(f);
  });
})();

// ---- FACTION CARD 3D HOVER EFFECT ----
(function initFactionGlow() {
  document.querySelectorAll('.faction-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 12;
      const yPct = (y / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-4px) rotateX(${-yPct}deg) rotateY(${xPct}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });
})();

// ---- CITY CARD EMBLEM PARALLAX ----
(function initCityParallax() {
  document.querySelectorAll('.city-emblem').forEach(img => {
    const card = img.closest('.city-card');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `scale(1.06) translate(${x * 8}px, ${y * 6}px)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
})();

// ---- GLITCH EFFECT ON HERO TITLE ----
(function initGlitch() {
  const title = document.querySelector('.hero-title-main');
  if (!title) return;

  function glitch() {
    title.style.filter = 'drop-shadow(2px 0 0 rgba(74,159,255,0.8)) drop-shadow(-2px 0 0 rgba(201,162,39,0.8))';
    title.style.transform = `translateX(${(Math.random() - 0.5) * 4}px)`;

    setTimeout(() => {
      title.style.filter = 'drop-shadow(0 0 40px rgba(201, 162, 39, 0.4))';
      title.style.transform = '';
    }, 80);
  }

  function scheduleGlitch() {
    const delay = 5000 + Math.random() * 5000;
    setTimeout(() => {
      glitch();
      setTimeout(glitch, 120);
      scheduleGlitch();
    }, delay);
  }

  // Wait for hero to be visible first
  setTimeout(scheduleGlitch, 3000);
})();

// ---- ACTIVE NAV LINK HIGHLIGHT ----
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--gold-300)';
      }
    });
  }, { passive: true });
})();

// ---- SUBTLE CURSOR GLOW (desktop only) ----
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(74,159,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
})();
