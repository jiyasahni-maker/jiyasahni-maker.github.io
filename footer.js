// footer.js — hybrid footer behavior (fixed for short pages, anchored for long pages)
// Usage: include <link href="assets/footer.css"> and <script src="assets/footer.js" defer></script>
// Footer element added into each HTML: <div class="site-footer-wrap"><footer class="site-footer">...</footer></div>

(function(){
  const FOOTER_SELECTOR = '.site-footer';
  function updateFooterMode() {
    const el = document.querySelector(FOOTER_SELECTOR);
    if (!el) return;
    // calculate whether content height exceeds viewport
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    const threshold = 120; // small buffer to avoid jitter
    // If page content is shorter or about same as viewport, fix it to bottom.
    if (docH <= winH + threshold) {
      el.classList.remove('anchored');
      el.classList.add('fixed');
      // subtle pulse to attract attention on short pages
      el.classList.add('pulse');
    } else {
      el.classList.remove('fixed');
      el.classList.remove('pulse');
      el.classList.add('anchored');
    }
  }

  // init and observe
  window.addEventListener('load', updateFooterMode);
  window.addEventListener('resize', () => { window.requestAnimationFrame(updateFooterMode); });
  window.addEventListener('orientationchange', () => { window.requestAnimationFrame(updateFooterMode); });

  // watch for dynamic DOM changes (images, async content)
  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(updateFooterMode);
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: false });

  // initial fallback
  setTimeout(updateFooterMode, 600);
})();
