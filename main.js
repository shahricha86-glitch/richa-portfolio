/* ─── CUSTOM CURSOR ─────────────────────────── */
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--active');
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--active');
    });
  });
})();

/* ─── NAV ACTIVE STATE (clicked = bold) ─────── */
(function () {
  var navLinks = Array.from(document.querySelectorAll('.nav__links a'));

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('is-active'); });
      link.classList.add('is-active');
    });
  });

  var brand = document.querySelector('.nav__brand');
  if (brand) {
    brand.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    });
  }
})();

/* ─── SCROLL REVEAL ─────────────────────────── */
(function () {
  const containers = document.querySelectorAll('.scroll-reveal');

  // Apply stagger delays to direct children before the observer fires
  containers.forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  containers.forEach(el => io.observe(el));
})();

/* ─── STICKY CARD STACK ──────────────────────── */
(function () {
  const sections = Array.from(document.querySelectorAll('.card-wrap'));
  const wraps    = Array.from(document.querySelectorAll('.card-wrap__sticky'));
  if (wraps.length < 2 || sections.length !== wraps.length) return;

  const state = wraps.map(() => ({ scale: 1, bright: 1, tScale: 1, tBright: 1 }));

  function readTargets() {
    sections.forEach((sec, i) => {
      let totalP = 0;
      for (let j = i + 1; j < sections.length; j++) {
        const wr = sections[j - 1].getBoundingClientRect();
        const nr = sections[j].getBoundingClientRect();
        const p = Math.max(0, Math.min(1,
          1 - (nr.top - wr.top) / wr.height
        ));
        totalP += p;
      }
      state[i].tScale  = 1 - totalP * 0.09;
      state[i].tBright = 1 - totalP * 0.25;
    });
  }

  const LERP = 0.10;
  let rafPending = false;

  function tick() {
    rafPending = false;
    let settled = true;

    wraps.forEach((wrap, i) => {
      const s = state[i];
      s.scale  += (s.tScale  - s.scale)  * LERP;
      s.bright += (s.tBright - s.bright) * LERP;

      if (Math.abs(s.tScale - s.scale) > 0.0002 ||
          Math.abs(s.tBright - s.bright) > 0.0002) {
        settled = false;
      }

      if (Math.abs(s.scale - 1) > 0.001 || Math.abs(s.bright - 1) > 0.001) {
        wrap.style.transform = `scale(${s.scale.toFixed(4)})`;
        wrap.style.filter    = `brightness(${s.bright.toFixed(4)})`;
      } else {
        wrap.style.transform = '';
        wrap.style.filter    = '';
      }
    });

    if (!settled) {
      rafPending = true;
      requestAnimationFrame(tick);
    }
  }

  function scheduleUpdate() {
    readTargets();
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  scheduleUpdate();
})();

/* ─── COPY EMAIL ────────────────────────────── */
(function () {
  const link = document.getElementById('copyEmailLink');
  if (!link) return;
  link.addEventListener('click', () => {
    navigator.clipboard.writeText('richashah.kandoi@gmail.com').then(() => {
      link.textContent = 'Copied!';
      setTimeout(() => {
        link.textContent = 'Email';
      }, 2200);
    }).catch(() => {
      link.textContent = 'Email';
    });
  });
})();

/* ─── TESTIMONIALS CAROUSEL ──────────────────── */
(function () {
  const testiTrack    = document.getElementById('testi-track');
  const btnPrev       = document.getElementById('testi-prev');
  const btnNext       = document.getElementById('testi-next');
  const dotsContainer = document.getElementById('testi-dots');

  if (!testiTrack) return;

  const originalCells = Array.from(testiTrack.querySelectorAll('.testi__cell'));
  if (!originalCells.length) return;

  // Clone for infinite seamless loop: [1,2,3] → [1,2,3,1,2,3]
  originalCells.forEach(cell => {
    testiTrack.appendChild(cell.cloneNode(true));
  });

  const cells     = testiTrack.querySelectorAll('.testi__cell');
  const realCount = originalCells.length;
  let currentIndex    = 0;
  let isTransitioning = false;

  const dots = dotsContainer
    ? Array.from(dotsContainer.querySelectorAll('.testi__dot'))
    : [];

  function updateDots(index) {
    const realIndex = index % realCount;
    dots.forEach((dot, i) =>
      dot.classList.toggle('testi__dot--active', i === realIndex)
    );
  }

  function getShift(index) {
    const cellWidth = cells[0].offsetWidth;
    return index * (cellWidth + 24);
  }

  function slideTo(index, animate = true) {
    testiTrack.style.transition = animate
      ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'none';
    if (animate) isTransitioning = true;
    testiTrack.style.transform = `translateX(-${getShift(index)}px)`;
    currentIndex = index;
    updateDots(index);
  }

  testiTrack.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex === realCount) slideTo(0, false);
  });

  if (btnNext) btnNext.addEventListener('click', () => {
    if (isTransitioning) return;
    slideTo(currentIndex + 1, true);
  });

  if (btnPrev) btnPrev.addEventListener('click', () => {
    if (isTransitioning) return;
    if (currentIndex === 0) {
      slideTo(realCount, false);
      testiTrack.offsetHeight; // force reflow
      slideTo(realCount - 1, true);
    } else {
      slideTo(currentIndex - 1, true);
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      slideTo(i, true);
    });
  });

  // Swipe gesture
  let touchStartX = 0;
  const SWIPE_MIN = 40;

  testiTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  testiTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < SWIPE_MIN || isTransitioning) return;
    if (diff > 0) {
      slideTo(currentIndex + 1, true);
    } else {
      if (currentIndex === 0) {
        slideTo(realCount, false);
        testiTrack.offsetHeight; // force reflow
        slideTo(realCount - 1, true);
      } else {
        slideTo(currentIndex - 1, true);
      }
    }
  }, { passive: true });

  window.addEventListener('resize', () => slideTo(currentIndex, false));
  slideTo(0, false);
})();
