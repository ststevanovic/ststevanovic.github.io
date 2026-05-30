/* =================================================================
   SCROLL PARALLAX — hero blobs move at different depths on scroll
   blob-1 (back): slowest | blob-2 (mid): medium | blob-3 (front): faster
   ================================================================= */
;(function () {
  const blob1 = document.querySelector('.hero-blob-1');
  const blob2 = document.querySelector('.hero-blob-2');
  const blob3 = document.querySelector('.hero-blob-3');
  if (!blob1) return;

  function onScroll() {
    const y = window.scrollY;
    blob1.style.transform = `translateY(${y * 0.55}px)`;
    blob2.style.transform = `translateY(${y * 0.35}px)`;
    blob3.style.transform = `translateY(${y * 0.15}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* =================================================================
   NAV GREETING — cycles multilingual hellos every ~3s
   ================================================================= */
;(function () {
  const el = document.getElementById('navGreet');
  if (!el) return;
  const greets = [
    'Hello, World.', 'Zdravo, Svete.', 'Hola, Mundo.',
    'Ciao, Mondo.', 'Bonjour, Monde.', 'こんにちは。', 'Привет, Мир.'
  ];
  let i = 0;
  el.style.transition = 'opacity 0.22s ease';
  setInterval(() => {
    i = (i + 1) % greets.length;
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = greets[i]; el.style.opacity = '1'; }, 220);
  }, 3200);
})();


/* =================================================================
   STORY — scroll reveal (3-D Z entrance) + timeline dot + accordion
   ================================================================= */
;(function () {
  const chapters = document.querySelectorAll('.chapter');
  if (!chapters.length) return;

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  chapters.forEach(ch => revealObs.observe(ch));

  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('active', e.isIntersecting));
  }, { rootMargin: '-10% 0px -45% 0px', threshold: 0 });
  chapters.forEach(ch => activeObs.observe(ch));

  /* accordion */
  document.querySelectorAll('.expand-btn').forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('data-panel'));
    if (!panel) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (!open) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.classList.add('open');
      } else {
        panel.style.maxHeight = '0';
        panel.classList.remove('open');
      }
    });
  });
})();


/* =================================================================
   3-D CARD TILT on hover
   ================================================================= */
;(function () {
  document.querySelectorAll('.project-card, .conv-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* =================================================================
   SLIDE CAROUSEL (services.html)
   ================================================================= */
(function () {
  const container = document.getElementById('slidesContainer');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const total = slides.length;
  let current = 0, animating = false;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots()    { dotsContainer.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === current)); }
  function updateButtons() { prevBtn.disabled = current === 0; nextBtn.disabled = current === total - 1; }

  function goTo(next) {
    if (animating || next === current || next < 0 || next >= total) return;
    animating = true;
    const dir = next > current ? 'up' : 'down';
    const from = slides[current], to = slides[next];
    to.style.transition = 'none';
    to.classList.remove('exit-up','exit-down','active');
    to.style.transform = dir === 'up' ? 'translateY(40px)' : 'translateY(-40px)';
    to.style.opacity = '0'; to.style.pointerEvents = 'none';
    void to.offsetHeight;
    to.style.transition = ''; to.style.transform = ''; to.style.opacity = '';
    from.classList.add(dir === 'up' ? 'exit-up' : 'exit-down');
    from.classList.remove('active'); from.style.pointerEvents = 'none';
    to.classList.add('active');
    current = next; updateDots(); updateButtons();
    setTimeout(() => { from.classList.remove('exit-up','exit-down'); from.style.pointerEvents = ''; animating = false; }, 520);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', e => {
    if (e.key==='ArrowRight'||e.key==='ArrowDown') { e.preventDefault(); goTo(current+1); }
    if (e.key==='ArrowLeft' ||e.key==='ArrowUp')   { e.preventDefault(); goTo(current-1); }
  });

  let ty = null, tx = null;
  document.addEventListener('touchstart', e => { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend',   e => {
    if (ty === null) return;
    const dy = ty - e.changedTouches[0].clientY, dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) dy > 0 ? goTo(current+1) : goTo(current-1);
    else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) dx > 0 ? goTo(current+1) : goTo(current-1);
    ty = tx = null;
  }, { passive: true });

  updateButtons();
})();
