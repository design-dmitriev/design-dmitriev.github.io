(function () {
  var S = [
    ['Заглавный слайд', 'Быстрая для iPhone', 'Главная мысль и комплект сразу в кадре.'],
    ['Сценарий', 'Зарядка на весь день', 'Выгода показана на жизненной ситуации.'],
    ['Скорость', 'Меньше проводов', 'Зарядка и передача данных на рабочем месте.'],
    ['Возражение', 'Не перегревается', 'Закрываем страх перегрева наглядной сценой.'],
    ['Бренд и совместимость', 'Создана для Apple', 'Устройства рядом, понятно, с чем работает.'],
    ['Возражение', 'Не перегревается', 'Светлый вариант того же аргумента.'],
    ['Гарантия', 'Ещё раз о безопасности', 'Поддержка и QR на гарантийном талоне.'],
    ['Комплект', 'Всё в одном комплекте', 'Блок питания и кабель, что входит в заказ.'],
    ['Итог', 'Инфографика', 'Все характеристики на одном экране.']
  ];
  var DUR = 3400, $ = function (i) { return document.getElementById(i); };
  var stage = $('stage'), slides = $('slides'), ticks = $('ticks'), tag = $('tag'), list = $('list'), intro = $('intro'), outro = $('outro'), grid = $('grid'), pp = $('pp');
  var cur = -1, timer = null, left = 0, t0 = 0, paused = false, running = false;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  stage.style.setProperty('--dur', DUR + 'ms');

  S.forEach(function (s, i) {
    var d = document.createElement('div'); d.className = 'slide';
    d.innerHTML = '<img src="img/' + (i + 1) + '.webp" alt="Слайд ' + (i + 1) + ': ' + s[1] + '" width="900" height="1200"' + (i ? ' loading="lazy"' : '') + '>';
    slides.appendChild(d);
    ticks.appendChild(document.createElement('i'));
    var li = document.createElement('li');
    li.innerHTML = '<button type="button"><span>' + (i + 1) + '</span><b>' + s[1] + '</b><small>' + s[0] + '. ' + s[2] + '</small></button>';
    li.firstChild.addEventListener('click', function () { go(i); });
    list.appendChild(li);
    var g = document.createElement('button'); g.type = 'button'; g.style.animationDelay = (i * .05) + 's';
    g.innerHTML = '<img src="img/' + (i + 1) + '-t.webp" alt="Слайд ' + (i + 1) + '" loading="lazy">';
    g.addEventListener('click', function () { go(i); });
    grid.appendChild(g);
  });
  var els = slides.children, tk = ticks.children, items = list.children;

  function clear() { clearTimeout(timer); timer = null; }
  function arm(ms) { clear(); if (reduce) return; left = ms; t0 = Date.now(); timer = setTimeout(function () { go(cur + 1); }, ms); }

  function go(i) {
    if (i < 0) i = 0;
    intro.hidden = true;
    if (i >= S.length) { finish(); return; }
    outro.hidden = true; running = true; pp.style.visibility = '';
    var prev = cur; cur = i;
    for (var k = 0; k < els.length; k++) { els[k].classList.remove('on', 'off'); }
    if (prev >= 0 && prev !== i && els[prev]) { els[prev].classList.add('off'); }
    void stage.offsetWidth;
    els[i].classList.add('on');
    for (k = 0; k < tk.length; k++) { tk[k].className = k < i ? 'done' : k === i ? 'cur' : ''; items[k].className = k === i ? 'cur' : ''; }
    tag.hidden = false; tag.style.animation = 'none'; void tag.offsetWidth; tag.style.animation = '';
    tag.textContent = S[i][0];
    paused = false; stage.classList.remove('paused'); pp.textContent = 'Пауза'; pp.setAttribute('aria-label', 'Пауза');
    arm(DUR);
  }
  function finish() {
    clear(); running = false; cur = S.length;
    for (var k = 0; k < els.length; k++) els[k].classList.remove('on', 'off');
    for (k = 0; k < tk.length; k++) { tk[k].className = 'done'; items[k].className = ''; }
    tag.hidden = true; outro.hidden = false; pp.style.visibility = 'hidden';
    var b = grid.children; for (k = 0; k < b.length; k++) { b[k].style.animation = 'none'; void b[k].offsetWidth; b[k].style.animation = ''; }
  }
  function toggle() {
    if (!running) return;
    paused = !paused; stage.classList.toggle('paused', paused);
    pp.textContent = paused ? 'Продолжить' : 'Пауза'; pp.setAttribute('aria-label', pp.textContent);
    if (paused) { clear(); left = Math.max(300, left - (Date.now() - t0)); } else arm(left);
  }
  $('start').addEventListener('click', function () { go(0); });
  $('again').addEventListener('click', function () { go(0); });
  $('nx').addEventListener('click', function () { go(cur + 1); });
  $('pv').addEventListener('click', function () { go(cur - 1); });
  [].forEach.call(tk, function (t, i) { t.addEventListener('click', function () { go(i); }); });
  var px0 = 0, py0 = 0, pt0 = 0, held = false, hid = 0, down = false;
  function release() { if (held && paused) toggle(); held = false; stage.classList.remove('hold'); }
  stage.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    down = true; px0 = e.clientX; py0 = e.clientY; pt0 = Date.now(); held = false;
    clearTimeout(hid); hid = setTimeout(function () { if (down && running && !paused) { held = true; toggle(); stage.classList.add('hold'); } }, 260);
  });
  stage.addEventListener('pointerup', function (e) {
    if (!down) return; down = false; clearTimeout(hid);
    var dx = e.clientX - px0, dy = e.clientY - py0, dt = Date.now() - pt0, wasHeld = held;
    release();
    if (!running && cur < 0) return;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { go(dx < 0 ? cur + 1 : cur - 1); return; }
    if (wasHeld || dt > 400 || Math.abs(dx) > 12 || Math.abs(dy) > 12) return;
    var r = stage.getBoundingClientRect(); go((e.clientX - r.left) < r.width * .4 ? cur - 1 : cur + 1);
  });
  stage.addEventListener('pointercancel', function () { down = false; clearTimeout(hid); release(); });
  stage.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  pp.addEventListener('click', toggle);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1); else if (e.key === ' ' && running) { e.preventDefault(); toggle(); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && running && !paused) toggle(); });
  setTimeout(function () { if (cur < 0 && !reduce) { /* автозапуск не делаем: интро ждёт нажатия */ } }, 0);
})();
