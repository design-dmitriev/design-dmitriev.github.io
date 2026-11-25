(() => {
  const specimen = document.querySelector('.cygre-specimen, .tt-fors-specimen');
  if (!specimen) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lines = [...specimen.querySelectorAll('.cygre-specimen-line, .tt-fors-specimen-line')];
  let letters = [];
  let pointer = null;
  let frame = 0;
  let previous = 0;

  function build() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    letters = [];
    for (const line of lines) {
      line.querySelector('.wave-visual')?.remove();
      const visual = document.createElement('span');
      visual.className = 'wave-visual';
      visual.setAttribute('aria-hidden', 'true');
      for (const word of line.querySelector('.wave-text').textContent.split(' ')) {
        if (visual.childNodes.length) visual.append(' ');
        const group = document.createElement('span');
        group.className = 'wave-word';
        for (const character of word) {
          const letter = document.createElement('span');
          letter.textContent = character;
          group.append(letter);
          letters.push({ letter, value: 0, velocity: 0 });
        }
        visual.append(group);
      }
      line.append(visual);
    }
  }

  function tick(now) {
    const dt = Math.min((now - previous) / 1000, 1 / 60);
    previous = now;
    let moving = false;
    const targets = letters.map(({ letter }) => {
      if (!pointer || reduced.matches) return 0;
      const rect = letter.getBoundingClientRect();
      const distance = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
      const proximity = Math.max(0, 1 - distance / 116);
      return proximity * proximity;
    });
    letters.forEach((state, index) => {
      const target = targets[index];
      const [stiffness, damping] = pointer ? [900, 50] : [280, 22];
      const step = dt / 2;
      for (let i = 0; i < 2; i++) {
        state.velocity += (stiffness * (target - state.value) - damping * state.velocity) * step;
        state.value += state.velocity * step;
      }
      if (Math.abs(state.value - target) > .001 || Math.abs(state.velocity) > .01) moving = true;
      state.letter.style.setProperty('--wave', Math.max(0, Math.min(1, state.value)));
    });
    frame = moving ? requestAnimationFrame(tick) : 0;
  }

  function start() {
    if (frame) return;
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }

  build();
  specimen.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    start();
  });
  specimen.addEventListener('pointerleave', () => {
    pointer = null;
    start();
  });
  reduced.addEventListener('change', build);
  document.addEventListener('portfolio:language', build);
})();
