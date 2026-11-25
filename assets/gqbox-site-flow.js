(() => {
  const player = document.querySelector('[data-gq-site-flow]');
  if (!player) return;

  const controls = player.querySelector('.gq-site-flow__controls');
  const toggle = player.querySelector('.gq-site-flow__toggle');
  const buttons = [...player.querySelectorAll('.gq-site-flow__chapters button')];
  const scenes = [...player.querySelectorAll('.gq-site-flow__scene')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = false;
  let visible = false;
  let progress;

  function updatePlayback() {
    const active = playing && visible && !document.hidden;
    if (!progress) return;
    if (active) progress.play();
    else progress.pause();
  }

  function setPlaying(next) {
    playing = next;
    player.classList.toggle('is-playing', playing);
    updatePlayback();
  }

  function showScene(index) {
    progress?.cancel();
    current = index;
    scenes.forEach((scene, sceneIndex) => {
      const selected = sceneIndex === index;
      scene.hidden = !selected;
      buttons[sceneIndex].setAttribute('aria-pressed', String(selected));
    });

    const track = buttons[index].querySelector('.gq-site-flow__track');
    progress = track.animate(
      [{ '--gq-progress': '0%' }, { '--gq-progress': '100%' }],
      { duration: 5300, fill: 'forwards' },
    );
    progress.pause();
    progress.onfinish = () => showScene((current + 1) % scenes.length);
    updatePlayback();
  }

  player.classList.add('is-ready');
  controls.hidden = false;
  showScene(0);
  setPlaying(!reducedMotion.matches);

  toggle.addEventListener('click', () => setPlaying(!playing));
  player.querySelector('.gq-site-flow__screen').addEventListener('focusin', () => setPlaying(false));
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      setPlaying(false);
      showScene(index);
    });
  });

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0.25 });
  observer.observe(player.querySelector('.gq-site-flow__window'));
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) setPlaying(false);
  });
})();
