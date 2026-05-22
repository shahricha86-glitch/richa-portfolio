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

/* ─── NAV ACTIVE STATE ─────────────────────── */
(function () {
  var navLinks = Array.from(document.querySelectorAll('.nav__links a'));

  function clearActive() {
    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
  }

  /* Set active on page load based on current URL */
  (function () {
    var path = window.location.pathname;
    var hash = window.location.hash; /* e.g. "#work" */

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';

      /* Hash match: href="#work" or href="/#work" with hash="#work" */
      if (hash && href.endsWith(hash)) {
        link.classList.add('is-active');
        return;
      }

      /* Exact page match: href="/about" and path ends with "about.html" */
      if (!href.includes('#') && href !== '#' && href !== '' && path.endsWith(href)) {
        link.classList.add('is-active');
        return;
      }

      /* Case study pages — Work link is always active */
      var isCaseStudy = /abule|layerpath/.test(path);
      if (isCaseStudy && href.includes('#work')) {
        link.classList.add('is-active');
      }
    });
  })();

  /* Update active on click */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      clearActive();
      link.classList.add('is-active');
    });
  });

  var brand = document.querySelector('.nav__brand');
  if (brand) {
    brand.addEventListener('click', function () { clearActive(); });
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
    ? Array.from(dotsContainer.querySelectorAll('.dot-nav__dot'))
    : [];

  function updateDots(index) {
    const realIndex = index % realCount;
    dots.forEach((dot, i) =>
      dot.classList.toggle('dot-nav__dot--active', i === realIndex)
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
    dot.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      slideTo(i, true);
    });
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

/* ─── ABOUT GALLERY CAROUSELS ───────────────── */
(function () {
  function initCarousel(trackId, dotsId, descId) {
    var track = document.getElementById(trackId);
    if (!track) return;

    var viewport = track.closest('.about-carousel__viewport');
    var frame    = track.closest('.about-carousel__frame');
    if (!viewport || !frame) return;

    var slides  = Array.from(track.children);
    var count   = slides.length;
    var current = 0;

    var btnPrev = frame.querySelector('.about-carousel__btn--prev');
    var btnNext = frame.querySelector('.about-carousel__btn--next');
    var descEl  = descId ? document.getElementById(descId) : null;

    /* ── Build dot elements ── */
    var dotsEl   = dotsId ? document.getElementById(dotsId) : null;
    var dotEls   = [];
    var N_VIS    = 5;    /* dots visible at once when count > N_VIS */
    var DOT_STEP = 16;   /* 8px dot + 8px gap = 16px per slot */
    var dotsRow  = null; /* inner scrolling row, only when count > N_VIS */

    if (dotsEl && count > 1) {
      if (count > N_VIS) {
        /* Clip box + scrolling row for the sliding window */
        var clip = document.createElement('div');
        clip.className = 'about-carousel__dots-clip';
        dotsRow = document.createElement('div');
        dotsRow.className = 'about-carousel__dots-row';
        clip.appendChild(dotsRow);
        dotsEl.appendChild(clip);
      }
      for (var d = 0; d < count; d++) {
        var dot = document.createElement('span');
        dot.className = 'dot-nav__dot';
        (function (pos) {
          dot.addEventListener('touchend', function (e) { e.preventDefault(); go(pos); });
          dot.addEventListener('click', function () { go(pos); });
        })(d);
        (dotsRow || dotsEl).appendChild(dot);
        dotEls.push(dot);
      }
    }

    /* Active dot is always kept at the centre of the 5-dot window.
       ws shifts so active lands at position 2 (0-indexed middle). */
    function updateDots() {
      if (!dotEls.length) return;
      var ws = 0;
      if (count > N_VIS) {
        ws = Math.max(0, Math.min(current - 2, count - N_VIS));
        dotsRow.style.transform = 'translateX(-' + (ws * DOT_STEP) + 'px)';
      }
      dotEls.forEach(function (d, pos) {
        var isActive   = pos === current;
        var posInWin   = pos - ws;
        var isLeftDim  = count > N_VIS && posInWin === 0 && ws > 0;
        var isRightDim = count > N_VIS && posInWin === N_VIS - 1 && (ws + N_VIS < count);
        var isDim      = (isLeftDim || isRightDim) && !isActive;

        d.classList.toggle('dot-nav__dot--active', isActive);
        if (isDim) {
          d.style.width   = '4px';
          d.style.height  = '4px';
          d.style.opacity = '0.35';
        } else {
          /* Let CSS handle all sizes — clear any prior inline overrides */
          d.style.width   = '';
          d.style.height  = '';
          d.style.opacity = '';
        }
      });
    }

    function vw() { return viewport.offsetWidth; }

    function sizeSlides() {
      var w = vw();
      slides.forEach(function (s) { s.style.width = w + 'px'; });
    }

    function go(index) {
      var isWrap = index < 0 || index >= count;
      var next   = ((index % count) + count) % count;

      if (isWrap) {
        track.style.transition = 'none';
        current = next;
        track.style.transform = 'translateX(-' + (current * vw()) + 'px)';
        track.offsetHeight;          /* force reflow */
        track.style.transition = '';
      } else {
        current = next;
        track.style.transform = 'translateX(-' + (current * vw()) + 'px)';
      }
      updateDots();
      if (descEl) {
        descEl.innerHTML = slides[current] ? (slides[current].getAttribute('data-desc') || '') : '';
      }
    }

    sizeSlides();
    go(0);

    if (btnPrev) btnPrev.addEventListener('click', function () { go(current - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { go(current + 1); });

    window.addEventListener('resize', function () { sizeSlides(); go(current); }, { passive: true });
  }

  initCarousel('travel-track', 'travel-dots');
  initCarousel('ai-track',     'ai-dots',    'ai-desc');
  initCarousel('arch-track',   'arch-dots');
  initCarousel('fifth-track',  'fifth-dots');
})();

/* ─── BITS & PIECES FILL ALIGNMENT ──────────── */
(function () {
  if (!document.querySelector('.about-gallery__grid')) return;

  function alignFills() {
    var ticaFrame = document.querySelector('#fifth-track') &&
                    document.querySelector('#fifth-track').closest('.about-carousel__frame');
    var archItem  = document.querySelector('#arch-track') &&
                    document.querySelector('#arch-track').closest('.about-gallery__item');

    /* On mobile (single column), clear any inline overrides and bail */
    if (window.innerWidth <= 900) {
      if (ticaFrame) { ticaFrame.style.minHeight = ''; }
      if (archItem)  {
        var af = archItem.querySelector('.about-carousel__frame');
        if (af) { af.style.height = ''; af.style.flex = ''; }
        archItem.style.flex      = '';
        archItem.style.marginTop = '';
      }
      return;
    }

    if (!ticaFrame || !archItem) return;
    var archFrame = archItem.querySelector('.about-carousel__frame');
    if (!archFrame) return;

    /* Reset all inline overrides */
    ticaFrame.style.minHeight = '';
    archFrame.style.height    = '';
    archFrame.style.flex      = '';
    archItem.style.flex       = '';
    archItem.style.marginTop  = '';

    /* After browser reflows the reset */
    requestAnimationFrame(function () {
      /* 1. Freeze Architecture at its current natural height */
      var archH = archFrame.getBoundingClientRect().height;
      archFrame.style.flex   = 'none';
      archFrame.style.height = archH.toFixed(1) + 'px';
      archItem.style.flex    = '0 0 auto';

      /* 2. Increase TICA frame height by 30% */
      var ticaH = ticaFrame.getBoundingClientRect().height;
      ticaFrame.style.minHeight = (ticaH * 1.3).toFixed(1) + 'px';

      /* 3. After TICA has grown, align Architecture bottom with TICA bottom */
      requestAnimationFrame(function () {
        var ticaBottom = ticaFrame.getBoundingClientRect().bottom;
        var archItemTop = archItem.getBoundingClientRect().top;
        var marginTop = ticaBottom - archH - archItemTop;
        if (marginTop > 0) {
          archItem.style.marginTop = marginTop.toFixed(1) + 'px';
        }
      });
    });
  }

  window.addEventListener('load', alignFills);
  window.addEventListener('resize', alignFills);
})();

/* ─── HERO HEADLINE FIT (mobile) ────────────────
   Finds the largest font-size where both spans
   fit on one line — no orphans, no guessing.    */
(function () {
  function fitHeroHeadline() {
    var headline = document.querySelector('.hero__headline');
    if (!headline || window.innerWidth > 768) {
      if (headline) headline.style.fontSize = '';
      return;
    }

    headline.style.fontSize = '';

    /* getBoundingClientRect gives the true visual width, not scroll width */
    var containerW = headline.getBoundingClientRect().width;
    if (!containerW) return;

    var spans = Array.from(headline.querySelectorAll('span'));

    /* Binary search: largest font-size (capped at 32px) where every span
       fits unwrapped in one line within the container */
    var lo = 14, hi = 32;
    for (var i = 0; i < 20; i++) {
      var mid = (lo + hi) / 2;
      headline.style.fontSize = mid + 'px';

      var overflows = spans.some(function (s) {
        var saved = s.getAttribute('style') || '';
        s.style.display    = 'inline-block';
        s.style.whiteSpace = 'nowrap';
        var w = s.getBoundingClientRect().width;
        s.setAttribute('style', saved);
        return w > containerW + 1;
      });

      if (overflows) hi = mid;
      else lo = mid;
    }
    headline.style.fontSize = lo + 'px';
  }

  fitHeroHeadline();
  window.addEventListener('resize', fitHeroHeadline);
})();

/* ─── TOOL TICKER — pixel-perfect seamless loop ── */
(function () {
  function initTicker() {
    var track = document.querySelector('.tool-ticker__track');
    if (!track) return;
    var items = track.querySelectorAll('.tool-ticker__item');
    if (!items.length) return;
    var half = Math.floor(items.length / 2);
    // Sum the widths of the first half (one set) including their margin-right
    var setWidth = 0;
    for (var i = 0; i < half; i++) {
      var style = window.getComputedStyle(items[i]);
      setWidth += items[i].getBoundingClientRect().width
        + parseFloat(style.marginRight || 0);
    }
    track.style.setProperty('--ticker-translate', '-' + setWidth + 'px');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTicker);
  } else {
    // Images may still be loading — wait one frame after load
    window.addEventListener('load', function () {
      requestAnimationFrame(initTicker);
    });
  }
})();
