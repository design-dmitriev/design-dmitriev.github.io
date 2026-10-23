(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n) { return n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function getJSON(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); }); }

  /* результаты: заказы, CTR и CR до и после */
  function pct(n) { return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + '%'; }
  function pair(v) { return pct(v[0]) + ' → ' + pct(v[1]); }
  getJSON('data/results.json').then(function (d) {
    $('#results-intro').textContent = d.intro || '';
    if (d.demo) $('#demo').hidden = false;
    var max = Math.max.apply(null, d.cases.map(function (c) { return Math.max(c.orders[0], c.orders[1]); }));
    $('#cases').innerHTML = d.cases.map(function (c) {
      var growth = Math.round((c.orders[1] - c.orders[0]) / c.orders[0] * 100);
      var notes = [];
      if (c.change) notes.push(esc(c.change));
      if (c.manager) notes.push('Оценка менеджера: ' + esc(c.manager.toLowerCase()));
      return '<li class="case">' +
        '<div class="who"><b>' + esc(c.title) + '</b><span>' + notes.join('<br>') + '</span></div>' +
        '<div class="bars" role="img" aria-label="Заказов в день: ' + c.orders[0] + ', стало ' + c.orders[1] + '">' +
          '<div class="bar before"><span>до</span><span class="v"><i style="--w:' + (c.orders[0] / max * 100).toFixed(1) + '%"></i>' + c.orders[0] + '</span></div>' +
          '<div class="bar after"><span>после</span><span class="v"><i style="--w:' + (c.orders[1] / max * 100).toFixed(1) + '%"></i><b>' + c.orders[1] + '</b><em>' + (growth >= 0 ? '+' : '') + growth + '%</em></span></div>' +
          '<p class="cap">заказов в день</p>' +
        '</div>' +
        '<dl class="m"><div><dt>CTR</dt><dd>' + pair(c.ctr) + '</dd></div><div><dt>CR в корзину</dt><dd>' + pair(c.cart) + '</dd></div><div><dt>CR в заказ</dt><dd>' + pair(c.order) + '</dd></div></dl>' +
        '</li>';
    }).join('');
    var src = $('#source'), s = d.source || {};
    src.textContent = s.text || '';
    if (s.proof) {
      var a = document.createElement('a');
      a.href = s.proof; a.textContent = s.proofLabel || 'Посмотреть выгрузку';
      src.appendChild(a);
    }
  }).catch(function () {
    $('#results-intro').textContent = 'Не удалось загрузить данные. Обновите страницу.';
  });

  /* личные работы: пока заглушка, фото подставятся из data/works.json */
  getJSON('data/works.json').then(function (list) {
    if (!list.length) return;
    $('#works-list').innerHTML = list.map(function (w) {
      return '<li><figure class="work"><img src="' + esc(w.src) + '" alt="' + esc(w.alt || w.title || '') + '" loading="lazy">' +
        (w.title ? '<figcaption>' + esc(w.title) + (w.text ? '<span>' + esc(w.text) + '</span>' : '') + '</figcaption>' : '') + '</figure></li>';
    }).join('');
    $('#works-note').textContent = 'Проекты, которые я делаю для себя.';
  }).catch(function () {});

  /* хобби: переключатель появляется, когда в data/hobbies.json есть записи */
  getJSON('data/hobbies.json').then(function (list) {
    if (!list.length) return;
    $('#hobby-list').innerHTML = list.map(function (h) {
      return '<li><h3>' + esc(h.title) + '</h3><p>' + esc(h.text || '') + '</p></li>';
    }).join('');
    $('#views').hidden = false;
    function setView(v) {
      document.body.dataset.view = v;
      $$('[data-show]').forEach(function (el) { el.hidden = el.dataset.show !== v; });
      $$('[data-view-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.viewBtn === v)); });
    }
    $$('[data-view-btn]').forEach(function (b) { b.addEventListener('click', function () { setView(b.dataset.viewBtn); }); });
  }).catch(function () {});
})();

/* превью при наведении в «Что я выстроил» */
(function () {
  var panel = document.getElementById('built-panel');
  if (!panel || !matchMedia('(min-width:1100px) and (hover:hover)').matches) return;
  var peek = document.createElement('div');
  peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true');
  peek.innerHTML = '<div class="ph">Превью появится позже</div><img alt="" hidden>';
  panel.appendChild(peek);
  var img = peek.querySelector('img'), ph = peek.querySelector('.ph');
  var rows = [].slice.call(panel.querySelectorAll('.built > li'));

  function show(li) {
    var src = li.getAttribute('data-peek');
    if (src) { img.hidden = false; ph.hidden = true; if (img.getAttribute('src') !== src) img.src = src; }
    else { img.hidden = true; ph.hidden = false; }
    var top = li.offsetTop + li.offsetHeight / 2 - peek.offsetHeight / 2;
    top = Math.max(0, Math.min(top, panel.clientHeight - peek.offsetHeight));
    if (!peek.classList.contains('on')) {
      peek.style.transition = 'none'; peek.style.top = top + 'px'; void peek.offsetWidth; peek.style.transition = '';
    } else peek.style.top = top + 'px';
    rows.forEach(function (r) { r.classList.toggle('on', r === li); });
    panel.classList.add('hovering'); peek.classList.add('on');
  }
  function hide() {
    rows.forEach(function (r) { r.classList.remove('on'); });
    panel.classList.remove('hovering'); peek.classList.remove('on');
  }
  rows.forEach(function (li) { li.addEventListener('mouseenter', function () { show(li); }); });
  panel.addEventListener('mouseleave', hide);
})();
