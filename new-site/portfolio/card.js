(function () {
  var $ = function (i) { return document.getElementById(i); };
  var fr = window.self !== window.top;
  if (fr) document.documentElement.classList.add('fr');
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
    ct.textContent = (cur + 1) + ' / ' + S.length;
    pre(t).then(function () {
      if (cur !== t) return;
      img.src = S[t]; img.alt = T[t];
      ai = 1 - ai; ambs[ai].style.backgroundImage = 'url("' + S[t] + '")'; ambs[ai].classList.add('on'); ambs[1 - ai].classList.remove('on');
      if (dir && !reduce) {
        fig.style.transition = 'none'; fig.style.transform = 'translateX(' + (dir * 60) + 'px)'; fig.style.opacity = '0'; void fig.offsetWidth;
        fig.style.transition = 'transform .3s cubic-bezier(.2,.7,.2,1),opacity .3s'; fig.style.transform = ''; fig.style.opacity = '';
      }
    });
    pre(t + 1); pre(t - 1);
  }
  function go(d) { show(cur + d, d); }

  $('x').addEventListener('click', close);
  $('pv').addEventListener('click', function () { go(-1); });
  $('nx').addEventListener('click', function () { go(1); });
  $('stage').addEventListener('click', function (e) { if (e.target === $('stage')) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') close();
  });

  var sx = 0, sy = 0, dx = 0, drag = false, lock = null;
  fig.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; dx = 0; drag = true; lock = null; fig.style.transition = 'none'; try { fig.setPointerCapture(e.pointerId); } catch (x) {} });
  fig.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var x = e.clientX - sx, y = e.clientY - sy;
    if (lock === null && (Math.abs(x) > 8 || Math.abs(y) > 8)) lock = Math.abs(x) > Math.abs(y);
    if (lock) { dx = x; fig.style.transform = 'translateX(' + dx + 'px)'; }
  });
  function end() {
    if (!drag) return; drag = false; fig.style.transition = '';
    if (lock && Math.abs(dx) > 50) { fig.style.transform = ''; go(dx < 0 ? 1 : -1); } else fig.style.transform = '';
  }
  fig.addEventListener('pointerup', end); fig.addEventListener('pointercancel', end);

  fetch('../cards.json?v=4').then(function (r) { return r.json(); }).then(function (d) {
    var n = parseInt(document.body.dataset.n, 10) || 1, c = d.cards[n - 1] || d.cards[0];
    S = c.slides.map(function (s) { return '../' + s.img; });
    T = c.slides.map(function (s, i) { return 'Слайд ' + (i + 1) + ': ' + s.title; });
    ttl.textContent = c.title; document.title = c.title + ' — Алексей Дмитриев';
    if (S.length < 2) { $('pv').hidden = $('nx').hidden = true; }
    show(0);
  });
  setTimeout(function () { try { window.focus(); } catch (e) {} }, 0);
})();
