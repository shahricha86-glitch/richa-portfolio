document.getElementById('site-footer').innerHTML = `
<footer style="position:relative;opacity:1;transform:none;filter:none;">
  <div class="footer__left">
    <h2 class="footer__heading"><span class="sans">Made with </span><span class="serif">sharp corners.</span></h2>
    <div class="footer__socials">
      <a href="https://docs.google.com/document/d/17Sbe0jfaM_j-DL7hASyOlNv6RHQaP1VL7gTOgmSByLw/edit?tab=t.0" target="_blank" rel="noopener">R&eacute;sum&eacute;</a><span class="footer__sep">&middot;</span>
      <a href="https://www.linkedin.com/in/richa-kandoi/" target="_blank" rel="noopener noreferrer">LinkedIn</a><span class="footer__sep">&middot;</span>
      <a href="#" id="footerEmailLink">Email</a>
    </div>
  </div>
  <div class="footer__right">
    <ul class="footer__nav">
      <li class="footer__col">
        <a href="index.html#work" class="footer__link--main">Work</a>
        <a href="password.html?to=abule-admin.html" class="footer__link--sub icon-link"><i class="ph ph-lock-key" style="margin-right:6px; font-size:1.1em; vertical-align:-2px;"></i><span>Admin Portal Design</span></a>
        <a href="layerpath.html" class="footer__link--sub">Layerpath Website &amp; Web-app Redesign</a>
        <a href="password.html?to=abule-webapp.html" class="footer__link--sub icon-link"><i class="ph ph-lock-key" style="margin-right:6px; font-size:1.1em; vertical-align:-2px;"></i><span>Web-app Navigation Redesign</span></a>
        <a href="about.html" class="footer__link--main" style="margin-top:24px;">About</a>
      </li>
    </ul>
  </div>
  <p class="footer__copy">Website &copy; 2026 Richa Kandoi</p>
</footer>
`;

(function () {
  var link = document.getElementById('footerEmailLink');
  if (!link) return;
  link.addEventListener('click', function (e) {
    e.preventDefault();
    navigator.clipboard.writeText('richashah.kandoi@gmail.com').then(function () {
      link.innerHTML = 'Copied! <i class="ph ph-check"></i>';
      setTimeout(function () { link.textContent = 'Email'; }, 2000);
    }).catch(function () {
      window.location.href = 'mailto:richashah.kandoi@gmail.com';
    });
  });
})();
