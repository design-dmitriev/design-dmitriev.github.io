(function () {
  var $ = function (i) { return document.getElementById(i); };
  var stage = $('stage'), slides = $('slides'), ticks = $('ticks'), tag = $('tag'), thumbs = $('thumbs'), count = $('count'), cardT = $('cardT'), meta = $('meta'), eb = $('eb'), capT = $('capT'), capN = $('capN'), intro = $('intro'), outro = $('outro'), grid = $('grid'), pp = $('pp'), cardsNav = $('cards');
  var ambs = [$('ambA'), $('ambB')], ambI = 0;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var DATA = null, card = null, S = [], DUR = 3400, cur = -1, timer = null, left = 0, t0 = 0, paused = false, running = false, els, tk, items;

  function amb(src) {
    if (!src) { ambs.forEach(function (a) { a.classList.remove('on'); }); return; }
    ambI = 1 - ambI;
    var a = ambs[ambI], o = ambs[1 - ambI];
    a.style.backgroundImage = 'url("' + src + '")'; a.classList.add('on'); o.classList.remove('on');
  }
  function clear() { clearTimeout(timer); timer = null; }
  function arm(ms) { clear(); if (reduce) return; left = ms; t0 = Date.now(); timer = setTimeout(function () { go(cur + 1); }, ms); }

  function build(c) {
    clear(); card = c; S = c.slides; DUR = c.duration || 3400; cur = -1; running = false; paused = false;
    stage.style.setProperty('--dur', DUR + 'ms'); stage.classList.remove('paused');
    slides.innerHTML = ''; ticks.innerHTML = ''; thumbs.innerHTML = ''; grid.innerHTML = '';
    $('ttl').textContent = c.title; $('lead').textContent = c.lead || ''; document.title = c.title + ' — Алексей Дмитриев';
    S.forEach(function (s, i) {
      var d = document.createElement('div'); d.className = 'slide';
      d.innerHTML = '<img src="' + s.img + '" alt="Слайд ' + (i + 1) + ': ' + s.title + '" width="900" height="1200"' + (i ? ' loading="lazy"' : '') + '>';
      slides.appendChild(d);
      var t = document.createElement('i'); t.addEventListener('click', function () { go(i); }); ticks.appendChild(t);
      var th = document.createElement('button'); th.type = 'button'; th.setAttribute('role', 'listitem'); th.setAttribute('aria-label', 'Слайд ' + (i + 1) + ': ' + s.title);
      th.innerHTML = '<img src="' + (s.thumb || s.img) + '" alt="" loading="lazy"><span>' + (i + 1) + '</span>';
      th.addEventListener('click', function () { go(i); });
      thumbs.appendChild(th);
      var g = document.createElement('button'); g.type = 'button';
      g.innerHTML = '<img src="' + (s.thumb || s.img) + '" alt="Слайд ' + (i + 1) + '" loading="lazy">';
      g.addEventListener('click', function () { go(i); });
      grid.appendChild(g);
    });
    els = slides.children; tk = ticks.children; items = thumbs.children; info(-1);
    cardT.textContent = c.title; eb.textContent = 'Карточка товара' + (DATA.cards.length > 1 ? ' · ' + (DATA.cards.indexOf(c) + 1) + ' из ' + DATA.cards.length : '');
    var mt = c.meta || [S.length + ' слайдов', '≈ ' + Math.round(S.length * DUR / 1000) + ' сек'];
    meta.innerHTML = mt.map(function (m) { return '<li>' + m + '</li>'; }).join('');
    intro.hidden = false; outro.hidden = true; tag.hidden = true; pp.style.visibility = ''; pp.textContent = 'Пауза';
    amb(null);
  }

  function info(i) {
    if (i < 0 || i >= S.length) { count.textContent = ''; capT.textContent = 'Выберите слайд'; capN.textContent = 'Нажмите «Смотреть» или выберите любой слайд ниже.'; return; }
    count.textContent = (i + 1) + ' / ' + S.length; capT.textContent = S[i].title; capN.textContent = S[i].kind + '. ' + (S[i].note || '');
    var nw = document.querySelector('.now'); nw.classList.remove('swap'); void nw.offsetWidth; nw.classList.add('swap');
    var b = items[i]; if (b && thumbs.scrollWidth > thumbs.clientWidth + 2) thumbs.scrollTo({ left: b.offsetLeft - (thumbs.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
  }
  function go(i) {
    if (i < 0) i = 0;
    intro.hidden = true;
    if (i >= S.length) { finish(); return; }
    outro.hidden = true; running = true; pp.style.visibility = '';
    cur = i;
    for (var k = 0; k < els.length; k++) { els[k].classList.toggle('on', k === i); }
    for (k = 0; k < tk.length; k++) { tk[k].className = k < i ? 'done' : k === i ? 'cur' : ''; items[k].className = k === i ? 'cur' : ''; }
    tag.hidden = false; tag.textContent = (i + 1) + ' / ' + S.length; info(i);
    amb(S[i].thumb || S[i].img);
    paused = false; stage.classList.remove('paused'); pp.textContent = 'Пауза'; pp.setAttribute('aria-label', 'Пауза');
    arm(DUR);
  }
  function finish() {
    clear(); running = false; cur = S.length;
    for (var k = 0; k < els.length; k++) els[k].classList.remove('on');
    for (k = 0; k < tk.length; k++) { tk[k].className = 'done'; items[k].className = ''; }
    tag.hidden = true; outro.hidden = false; pp.style.visibility = 'hidden'; amb(null); info(-1);
  }
  function toggle() {
    if (!running) return;
    paused = !paused; stage.classList.toggle('paused', paused);
    pp.textContent = paused ? 'Продолжить' : 'Пауза'; pp.setAttribute('aria-label', pp.textContent);
    if (paused) { clear(); left = Math.max(300, left - (Date.now() - t0)); } else arm(left);
  }

  $('start').addEventListener('click', function () { go(0); });
  $('again').addEventListener('click', function () { go(0); });
  $('nextCard').addEventListener('click', function () { var k = DATA.cards.indexOf(card); pick(DATA.cards[(k + 1) % DATA.cards.length].id, true); go(0); });
  $('nx').addEventListener('click', function () { go(cur + 1); });
  $('pv').addEventListener('click', function () { go(cur - 1); });
  $('sr').addEventListener('click', function () { go(cur + 1); });
  $('sl').addEventListener('click', function () { go(cur - 1); });
  pp.addEventListener('click', toggle);

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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(cur + 1); else if (e.key === 'ArrowLeft') go(cur - 1); else if (e.key === ' ' && running) { e.preventDefault(); toggle(); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden && running && !paused) toggle(); });

  function pick(id, push) {
    var c = DATA.cards.filter(function (x) { return x.id === id; })[0] || DATA.cards[0];
    build(c);
    [].forEach.call(cardsNav.children, function (b) { b.classList.toggle('cur', b.dataset.id === c.id); });
    if (push) { try { history.replaceState(null, '', '?c=' + c.id); } catch (e) {} }
  }
  fetch('cards.json').then(function (r) { return r.json(); }).then(function (d) {
    DATA = d;
    if (d.cards.length > 1) {
      cardsNav.hidden = false;
      d.cards.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.dataset.id = c.id; b.textContent = c.short || c.title;
        b.addEventListener('click', function () { pick(c.id, true); }); cardsNav.appendChild(b);
      });
    }
    if (d.cards.length > 1) $('nextCard').hidden = false;
    var m = /[?&]c=([^&]+)/.exec(location.search);
    pick(m ? decodeURIComponent(m[1]) : d.cards[0].id, false);
  });
})();
