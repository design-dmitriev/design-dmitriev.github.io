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

  /* результаты: артикул, заказы или конверсия (индекс) и CTR до и после */
  function pct(n) { return n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + '%'; }
  var LINKS = {
    Ozon: function (a) { return 'https://www.ozon.ru/product/' + a + '/'; },
    WB: function (a) { return 'https://www.wildberries.ru/catalog/' + a + '/detail.aspx'; }
  };
  getJSON('data/results.json').then(function (d) {
    $('#results-intro').textContent = d.intro || '';
    if (d.demo) $('#demo').hidden = false;
    function idx(c) { return c.orders || c.ordersIndex || c.conversionIndex || (c.conv == null ? c.ctr : null); }
    var html = '';
    ['Ozon', 'WB', null].forEach(function (mp) {
      var list = d.cases.filter(function (c) { return c.marketplace === mp; });
      if (!list.length) return;
      var mpc = mp ? ' mp-' + mp.toLowerCase() : '', n = list.length, word = (n % 10 === 1 && n % 100 !== 11) ? 'артикул' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'артикула' : 'артикулов';
      if (mp) html += '<li class="group' + mpc + '"><h3>' + mp + '<small>' + n + ' ' + word + '</small></h3></li>';
      function isCtr(c) { return !(c.orders || c.ordersIndex || c.conversionIndex) && c.conv == null; }
      function maxOf(ctr) { return Math.max.apply(null, list.filter(function (c) { return idx(c) && isCtr(c) === ctr; }).map(function (c) { var v = idx(c); return Math.max(v[0], v[1]); })) || 1; }
      var maxes = { true: maxOf(true), false: maxOf(false) };
      html += list.map(function (c) {
        var v = idx(c) || [0, 0], ctrOnly = !(c.orders || c.ordersIndex || c.conversionIndex) && c.conv == null, growth = (c.orders || ctrOnly) ? Math.round((v[1] / v[0] - 1) * 100) : v[1] - v[0], fmt = function (n) { return ctrOnly ? pct(n) : n; };
        var cap = c.conv != null ? 'прирост конверсии по A/B-тесту' : ctrOnly ? 'CTR' : c.orders ? (c.ordersCap || 'заказов в день') : c.ordersIndex ? 'заказы в день, индекс' : 'конверсия, индекс';
        var metrics = c.ctr && !ctrOnly ? '<dl class="m"><div><dt>CTR до</dt><dd>' + pct(c.ctr[0]) + '</dd></div><div><dt>CTR после</dt><dd>' + pct(c.ctr[1]) + '</dd></div></dl>' : '';
        if (c.date) metrics += '<p class="note">Контент обновлён ' + esc(c.date) + '</p>';
        return '<li data-art="' + esc(c.article) + '" class="case' + mpc + (ctrOnly ? ' static' : '') + '">' +
          '<div class="who"><span>Артикул' + (mp ? ' ' + mp : '') + '</span>' + (mp ? '<a href="' + esc(LINKS[mp](c.article)) + '" target="_blank" rel="noopener"><b>' + esc(c.article) + '</b></a>' : '<b>' + esc(c.article) + '</b>') + '</div>' +
          (c.conv != null ? '<div class="bars"><div class="bar after conv"><span>конверсия</span><span class="v"><b>+' + c.conv + '%</b></span></div><p class="cap">' + cap + '</p></div>' : '<div class="bars" role="img" aria-label="' + cap + ': до ' + v[0] + ', после ' + v[1] + '">' +
            '<div class="bar before"><span>до</span><span class="v"><i style="--w:' + (v[0] / maxes[ctrOnly] * 100).toFixed(1) + '%"></i>' + fmt(v[0]) + '</span></div>' +
            '<div class="bar after"><span>после</span><span class="v"><i style="--w:' + (v[1] / maxes[ctrOnly] * 100).toFixed(1) + '%"></i><b>' + fmt(v[1]) + '</b><em>' + (growth >= 0 ? '+' : '') + growth + '%</em></span></div>' +
            '<p class="cap">' + cap + '</p>' +
          '</div>') + '<div>' + metrics + '</div></li>';
      }).join('');
    });
    $('#cases').innerHTML = html;
    document.dispatchEvent(new Event('results:ready'));
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
    var fc = $('#works-list .wfont'); $('#works-list').innerHTML = (fc ? fc.outerHTML : '') + list.map(function (w) {
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
  peek.innerHTML = '<div class="ph">Превью появится позже</div><img alt="" hidden><span class="m-badge" hidden></span>';
  panel.appendChild(peek);
  var img = peek.querySelector('img'), ph = peek.querySelector('.ph');
  var rows = [].slice.call(panel.querySelectorAll('.built > li'));

  var frame = null;
  function fit() {}
  function show(li) {
    var demo = li.getAttribute('data-demo');
    var pb = peek.querySelector('.m-badge'); pb.textContent = li.getAttribute('data-badge') || ''; pb.hidden = !(demo && pb.textContent);
    peek.classList.toggle('demo', !!demo); if (demo) peek.style.aspectRatio = li.getAttribute('data-ratio') || '0.6'; else peek.style.aspectRatio = '';
    if (demo) {
      if (frame && frame.getAttribute('src') !== demo) frame.src = demo;
      if (!frame) { frame = document.createElement('iframe'); frame.title = 'Превью Folderify'; frame.tabIndex = -1; frame.src = demo; peek.appendChild(frame); }
      frame.hidden = false; img.hidden = true; ph.hidden = true; fit();
    } else if (frame) frame.hidden = true;
    var src = li.getAttribute('data-peek');
    if (demo) {}
    else if (src) { img.hidden = false; ph.hidden = true; if (img.getAttribute('src') !== src) img.src = src; }
    else { img.hidden = true; ph.hidden = false; var st = li.getAttribute('data-stat'); ph.innerHTML = st ? '<b>' + st + '</b><span>' + (li.getAttribute('data-stat-cap') || '') + '</span>' : 'Превью появится позже'; ph.classList.toggle('stat', !!st); }
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

/* превью карточки при наведении на артикул (только десктоп) */
(function () {
  if (!matchMedia('(min-width:1100px) and (hover:hover)').matches) return;
  document.addEventListener('results:ready', function () {
    var box = document.getElementById('cases'); if (!box) return;
    var panel = box.closest('.panel') || box.parentNode;
    if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
    var pk = document.createElement('div'); pk.className = 'rpeek'; pk.setAttribute('aria-hidden', 'true');
    var img = document.createElement('img'); img.alt = ''; pk.appendChild(img); panel.appendChild(pk);
    var ok = {};
    img.addEventListener('error', function () { ok[img.dataset.a] = false; pk.classList.remove('on'); });
    img.addEventListener('load', function () { ok[img.dataset.a] = true; });
    function place(li) {
      var pr = panel.getBoundingClientRect(), lr = li.getBoundingClientRect(), w = pk.offsetWidth;
      var x = lr.right - pr.left + 16; if (x + w > pr.width - 16) x = lr.left - pr.left - w - 16;
      var y = lr.top - pr.top + lr.height / 2 - pk.offsetHeight / 2;
      pk.style.left = x + 'px'; pk.style.top = Math.max(16, Math.min(y, pr.height - pk.offsetHeight - 16)) + 'px';
    }
    [].forEach.call(box.querySelectorAll('.case[data-art]'), function (li) {
      li.addEventListener('mouseenter', function () {
        var a = li.getAttribute('data-art'); if (ok[a] === false) return;
        if (img.dataset.a !== a) { img.dataset.a = a; img.src = 'assets/peek/results/' + a + '.jpg'; }
        pk.classList.add('on'); place(li);
        img.onload = function () { ok[a] = true; place(li); };
      });
      li.addEventListener('mouseleave', function () { pk.classList.remove('on'); });
    });
  });
})();
