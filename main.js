// Slide carousel logic for services.html
(function () {
  const container = document.getElementById('slidesContainer');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const total = slides.length;
  let current = 0;
  let animating = false;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function updateButtons() {
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;
  }

  function goTo(next) {
    if (animating || next === current || next < 0 || next >= total) return;
    animating = true;

    const direction = next > current ? 'up' : 'down';
    const exitClass = direction === 'up' ? 'exit-up' : 'exit-down';

    const fromSlide = slides[current];
    const toSlide = slides[next];

    // Prepare incoming slide without transition
    toSlide.style.transition = 'none';
    toSlide.classList.remove('exit-up', 'exit-down', 'active');
    toSlide.style.transform = direction === 'up' ? 'translateY(40px)' : 'translateY(-40px)';
    toSlide.style.opacity = '0';
    toSlide.style.pointerEvents = 'none';

    void toSlide.offsetHeight; // force reflow

    toSlide.style.transition = '';
    toSlide.style.transform = '';
    toSlide.style.opacity = '';

    fromSlide.classList.add(exitClass);
    fromSlide.classList.remove('active');
    fromSlide.style.pointerEvents = 'none';

    toSlide.classList.add('active');

    current = next;
    updateDots();
    updateButtons();

    setTimeout(() => {
      fromSlide.classList.remove(exitClass);
      fromSlide.style.pointerEvents = '';
      animating = false;
    }, 520);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  // Touch swipe support
  let touchStartY = null;
  let touchStartX = null;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) {
      dy > 0 ? goTo(current + 1) : goTo(current - 1);
    } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    touchStartY = null;
    touchStartX = null;
  }, { passive: true });

  updateButtons();
})();
