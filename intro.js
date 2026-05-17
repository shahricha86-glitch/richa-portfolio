// Intro entrance animation — remove this <script> tag in index.html to disable.
// Plays once per browser session; subsequent visits skip it entirely.
if (!sessionStorage.getItem('intro_done')) {
  sessionStorage.setItem('intro_done', '1');
  document.documentElement.classList.add('intro-active');
}
