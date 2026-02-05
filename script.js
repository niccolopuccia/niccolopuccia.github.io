/* ═══════════════════════════════════════════
   NEURAL NETWORK BACKGROUND (Canvas)
   ═══════════════════════════════════════════ */

(function () {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles;
  let mouseX = 0, mouseY = 0;
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((width * height) / 12000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2.5 + 1,
      color: Math.random() > 0.5 ? 'accent' : 'accent2',
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.01;

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = 0.25 * (1 - dist / 160);
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(108, 99, 255, ${alpha})`);
          gradient.addColorStop(1, `rgba(0, 212, 170, ${alpha})`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      const pulseSize = Math.sin(time * 2 + p.pulse) * 0.5 + 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulseSize, 0, Math.PI * 2);

      if (p.color === 'accent') {
        ctx.fillStyle = 'rgba(108, 99, 255, 0.8)';
      } else {
        ctx.fillStyle = 'rgba(0, 212, 170, 0.7)';
      }
      ctx.fill();

      // Add glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulseSize * 2, 0, Math.PI * 2);
      if (p.color === 'accent') {
        ctx.fillStyle = 'rgba(108, 99, 255, 0.15)';
      } else {
        ctx.fillStyle = 'rgba(0, 212, 170, 0.12)';
      }
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction - subtle attraction
      const dxMouse = mouseX - p.x;
      const dyMouse = mouseY - p.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distMouse < 200 && distMouse > 0) {
        p.x += dxMouse * 0.001;
        p.y += dyMouse * 0.001;
      }

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
})();

/* ═══════════════════════════════════════════
   TYPING EFFECT
   ═══════════════════════════════════════════ */

(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'deep learning & biomedical imaging.',
    'computer vision & wearables.',
    'machine learning & data science.',
    'innovative healthcare solutions.',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = current.substring(0, charIdx);

    if (!deleting) {
      charIdx++;
      if (charIdx > current.length) {
        deleting = true;
        return setTimeout(type, 2000);
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 35 : 70);
  }

  type();
})();

/* ═══════════════════════════════════════════
   NAVBAR SCROLL EFFECT
   ═══════════════════════════════════════════ */

(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

/* ═══════════════════════════════════════════
   MOBILE NAV TOGGLE
   ═══════════════════════════════════════════ */

(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => links.classList.toggle('open'));

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
})();

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */

(function () {
  const targets = document.querySelectorAll(
    '.about-grid, .timeline-item, .project-card, .skill-category, .contact-card'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════
   SKILL BAR ANIMATION
   ═══════════════════════════════════════════ */

(function () {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level;
          entry.target.style.width = level + '%';
        }
      });
    },
    { threshold: 0.3 }
  );

  fills.forEach(f => observer.observe(f));
})();
