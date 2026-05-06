/* ─── ACCORDION v2 ──────────────────────────────────────────
   - Toggle fires only when the header row (trigger) is clicked.
     Clicking text, images, video, or whitespace inside the body
     does NOT close the accordion.
   - When open, the trigger becomes sticky so the user always
     knows which section they're in and can close without
     scrolling back up.
   - When open and settled, the 4-sided border becomes solid.
     During open/close transition the marching-ants animation runs.
   To revert: remove this file and its <script> tags, then
   restore the inline ACCORDION block in each case study page,
   and remove the ACCORDION v2 block from styles.css.
─────────────────────────────────────────────────────────── */

/* ── Sticky-top offset ─────────────────────────────────────
   On mobile the sidebar nav is also sticky at nav-height.
   We push the accordion trigger below it by measuring both.  */
(function () {
  function updateStickyTop() {
    var navEl     = document.querySelector('.nav-global');
    var sidebarEl = document.querySelector('.cs-layout__sidebar');
    var navH      = navEl ? navEl.offsetHeight : 64;
    var sidebarH  = 0;
    if (sidebarEl && window.innerWidth <= 768) {
      sidebarH = sidebarEl.offsetHeight;
    }
    document.documentElement.style.setProperty(
      '--accordion-sticky-top', (navH + sidebarH) + 'px'
    );
  }
  updateStickyTop();
  window.addEventListener('resize', updateStickyTop, { passive: true });
})();

/* ── Click handler ─────────────────────────────────────────
   Listens only on .cs-accordion__trigger (the button row).
   Content inside the expanded body never triggers a close.  */
(function () {
  document.querySelectorAll('.cs-accordion__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var accordion = btn.closest('.cs-accordion');
      if (!accordion) return;

      var isOpen = accordion.classList.contains('is-open');
      accordion.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(!isOpen));
      accordion.classList.add('is-marching');

      var bodyWrap = accordion.querySelector('.cs-accordion__body-wrap');

      if (isOpen) {
        /* Closing: if the accordion header has scrolled above the nav
           (user was deep in the content), scroll back to show it. */
        var navEl  = document.querySelector('.nav-global');
        var navH   = navEl ? navEl.offsetHeight : 64;
        var triggerTop = accordion.getBoundingClientRect().top;
        if (triggerTop < navH) {
          var accordionDocTop = triggerTop + window.scrollY;
          window.scrollTo(0, Math.max(0, accordionDocTop - navH - 24));
        }
      }

      bodyWrap.addEventListener('transitionend', function stop() {
        accordion.classList.remove('is-marching');
        bodyWrap.removeEventListener('transitionend', stop);
      });
    });
  });
})();
