(() => {
  const cover = document.querySelector('.case-motion-cover');
  if (!cover) return;
  const video = cover.querySelector('video');
  const toggle = cover.querySelector('button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let loaded = false, visible = false, manuallyPaused = false, manuallyStarted = false;
  video.muted = true;
  function load() {
    if (loaded) return;
    loaded = true;
    cover.querySelectorAll('source[data-src]').forEach(source => {
      source.src = source.dataset.src;
    });
    video.load();
  }
  function sync() {
    if (!visible || document.hidden || manuallyPaused || (reduced.matches && !manuallyStarted)) {
      video.pause();
      return;
    }
    load();
    video.play().catch(() => {});
  }
  function updateButton() {
    cover.classList.toggle('is-playing', !video.paused);
    toggle.setAttribute('aria-label', video.paused ? 'Воспроизвести видео' : 'Приостановить видео');
  }
  video.addEventListener('play', updateButton);
  video.addEventListener('pause', updateButton);
  toggle.addEventListener('click', () => {
    manuallyPaused = !video.paused;
    if (!manuallyPaused) manuallyStarted = true;
    sync();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0.08 });
  observer.observe(cover);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  updateButton();
})();
