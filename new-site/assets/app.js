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

  /* результаты по CTR */
  getJSON('data/results.json').then(function (d) {
    $('#results-intro').textContent = d.intro || '';
    if (d.demo) $('#demo').hidden = false;
    var max = Math.max.apply(null, d.cases.map(function (c) { return Math.max(c.ctrBefore, c.ctrAfter); }));
    $('#cases').innerHTML = d.cases.map(function (c) {
      var delta = c.ctrAfter - c.ctrBefore;
      return '<li class="case">' +
        '<div class="who"><b>' + esc(c.client) + '</b><span>' + esc(c.marketplace) + ', ' + esc(c.category) + '<br>' + esc(c.period) + '</span></div>' +
        '<div class="bars">' +
          '<div class="bar before"><span>до</span><span class="v"><i style="--w:' + (c.ctrBefore / max * 100).toFixed(1) + '%"></i>' + num(c.ctrBefore) + '%</span></div>' +
          '<div class="bar after"><span>после</span><span class="v"><i style="--w:' + (c.ctrAfter / max * 100).toFixed(1) + '%"></i><b>' + num(c.ctrAfter) + '%</b></span></div>' +
        '</div>' +
        '<p class="what"><b>' + (delta >= 0 ? '+' : '') + num(delta) + ' п.п.</b>' + esc(c.change) + '</p></li>';
    }).join('');
    var s = d.source || {};
    var src = $('#source');
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
