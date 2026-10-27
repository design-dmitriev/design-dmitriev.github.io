(function () {
  var $ = function (i) { return document.getElementById(i); };
  var fr = window.self !== window.top;
  if (fr) document.documentElement.classList.add('fr');
  var col = document.querySelector('.col'), needReady = false, hintT = 0, hint = $('hint'), tickEl = $('ticks'), seen = {}, tk = [];
  var fig = $('fig'), img = $('img'), ct = $('ct'), ttl = $('ttl'), ambs = [$('ambA'), $('ambB')], ai = 0;
  var S = [], T = [], cur = 0, ready = {};
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function close() { if (fr) parent.postMessage('vw-close', location.origin); else location.href = '../../#zaglavki'; }
  function pre(i) {
    i = (i + S.length) % S.length;
    if (ready[i]) return Promise.resolve();
    var im = new Image(); im.src = S[i];
    return (im.decode ? im.decode() : new Promise(function (r) { im.onload = r; im.onerror = r; })).catch(function () {}).then(function () { ready[i] = true; });
  }
  function show(i, dir) {
    cur = (i + S.length) % S.length; var t = cur;
    ct.textContent = (cur + 1) + ' / ' + S.length; seen[cur] = 1;
    tk.forEach(function (e, k) { e.className = k === cur ? 'on' : seen[k] ? 'seen' : ''; });
    if (dir) hint.classList.add('off');
    pre(t).then(function () {
      if (cur !== t) return;
      img.src = S[t]; img.alt = T[t];
      col.classList.add('in');
      if (needReady) { needReady = false; (img.decode ? img.decode() : Promise.resolve()).catch(function () {}).then(function () { parent.postMessage('vw-ready', location.origin); }); }
      ai = 1 - ai; ambs[ai].style.backgroundImage = 'url("' + S[t] + '")'; ambs[ai].classList.add('on'); ambs[1 - ai].classList.remove('on');
      if (dir && !reduce) {
        fig.style.transition = 'none'; fig.style.transform = 'translateX(' + (dir * 60) + 'px)'; fig.style.opacity = '0'; void fig.offsetWidth;
        fig.style.transition = 'transform .3s cubic-bezier(.2,.7,.2,1),opacity .3s'; fig.style.transform = ''; fig.style.opacity = '';
      }
    });
    pre(t + 1); pre(t - 1);
  }
  function go(d) { show(cur + d, d); }
  $('pv2').addEventListener('click', function () { go(-1); });
  $('nx2').addEventListener('click', function () { go(1); });

  $('x').addEventListener('click', close);
  $('pv').addEventListener('click', function () { go(-1); });
  $('nx').addEventListener('click', function () { go(1); });
  $('stage').addEventListener('click', function (e) { if (moved) { moved = false; return; } if (e.target === $('stage')) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') close();
  });

  var st = $('stage'), sx = 0, sy = 0, dx = 0, dy = 0, drag = false, lock = null, moved = false;
  st.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    sx = e.clientX; sy = e.clientY; dx = dy = 0; drag = true; lock = null; moved = false;
    fig.style.transition = 'none'; col.style.transition = 'none';
  });
  st.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var x = e.clientX - sx, y = e.clientY - sy;
    if (lock === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) { lock = Math.abs(x) > Math.abs(y) ? 'h' : 'v'; moved = true; try { st.setPointerCapture(e.pointerId); } catch (z) {} }
    if (lock === 'h') { dx = x; fig.style.transform = 'translateX(' + dx + 'px)'; }
    else if (lock === 'v') { dy = Math.max(0, y); col.style.transform = 'translateY(' + dy * .7 + 'px) scale(' + (1 - Math.min(dy, 400) / 2400) + ')'; col.style.opacity = String(1 - Math.min(dy, 300) / 420); }
  });
  function end() {
    if (!drag) return; drag = false; fig.style.transition = ''; col.style.transition = '';
    var closeIt = lock === 'v' && dy > 90, nav = lock === 'h' && Math.abs(dx) > 50;
    fig.style.transform = '';
    if (!closeIt) { col.style.transform = ''; col.style.opacity = ''; }
    if (nav) go(dx < 0 ? 1 : -1);
    if (closeIt) close();
  }
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);

  fetch('../cards.json?v=14', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    var n = parseInt(document.body.dataset.n, 10) || 1, set = document.body.dataset.set, c = set ? { title: d[set].title, slides: d[set].items } : d.cards[n - 1];
    if (!c) { close(); return; }
    function p(u) { return u.charAt(0) === '^' ? '../../' + u.slice(1) : '../' + u; }
    S = c.slides.map(function (s) { return p(s.img); });
    T = c.slides.map(function (s, i) { return set ? s.title : 'Слайд ' + (i + 1) + ': ' + s.title; });
    if (c.adult) { var ok = false; try { ok = sessionStorage.getItem('adult18') === '1'; } catch (z) {}
      if (!ok) { fig.classList.add('veil'); var g = document.createElement('div'); g.className = 'gate'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', 'Товар для взрослых');
        g.innerHTML = '<b>18+</b><p>Товар для взрослых. Нажимая кнопку, вы подтверждаете, что вам есть 18 лет.</p><button type="button">Мне есть 18, показать</button>';
        g.querySelector('button').addEventListener('click', function () { fig.classList.remove('veil'); g.remove(); try { sessionStorage.setItem('adult18', '1'); } catch (z) {} });
        fig.appendChild(g); } }
    ttl.textContent = c.title; document.title = c.title + ' — Алексей Дмитриев';
    if (S.length < 2) { $('pv').hidden = $('nx').hidden = $('pv2').hidden = $('nx2').hidden = true; hint.hidden = true; }
    S.forEach(function (s, i) { var t = document.createElement('i'); t.addEventListener('click', function () { show(i, i > cur ? 1 : -1); }); tickEl.appendChild(t); tk.push(t); });
    hint.textContent = matchMedia('(hover:hover)').matches ? 'Листайте ← →' : 'Листайте →';
    hintT = setTimeout(function () { hint.classList.add('off'); }, 3500);
    if (fr) { pre(0); pre(1); parent.postMessage('vw-loaded', location.origin); }
    else { var q = /[?&]i=(\d+)/.exec(location.search); show(q ? Math.min(+q[1], S.length - 1) : 0); }
  });
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data || e.data.t !== 'open' || !S.length) return;
    col.style.transform = ''; col.style.opacity = ''; seen = {}; needReady = true; hint.classList.remove('off'); clearTimeout(hintT); hintT = setTimeout(function () { hint.classList.add('off'); }, 3500);
    img.removeAttribute('src'); show(Math.min(e.data.i || 0, S.length - 1));
  });
  setTimeout(function () { try { window.focus(); } catch (e) {} }, 0);
})();
