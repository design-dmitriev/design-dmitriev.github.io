(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ROLES = {
    head: 'Алексей Дмитриев. Выстраиваю процесс отдела дизайна от брифа до разбора результата и делаю инструменты, которые убирают рутину.',
    commercial: 'Алексей Дмитриев. Делаю дизайн карточек для маркетплейсов, который измеряется в CTR: каждая сделка записана до и после.'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n) { return n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function date(s, long) {
    var d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('ru-RU', long ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
  }
  function plural(n, a, b, c) {
    var m = Math.abs(n) % 100, k = m % 10;
    return m > 10 && m < 20 ? c : k > 1 && k < 5 ? b : k === 1 ? a : c;
  }

  /* роль: влияет на подзаголовок и порядок разделов */
  function setRole(role, persist) {
    if (!ROLES[role]) role = 'head';
    document.documentElement.dataset.role = role;
    $('#sub').textContent = ROLES[role];
    $$('[data-role-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.roleBtn === role)); });
    if (persist) {
      try { var u = new URL(location.href); u.searchParams.set('role', role); history.replaceState(null, '', u); } catch (e) {}
    }
  }
  var initial = 'head';
  try { var qr = new URL(location.href).searchParams.get('role'); if (ROLES[qr]) initial = qr; } catch (e) {}
  setRole(initial, false);
  $$('[data-role-btn]').forEach(function (b) { b.addEventListener('click', function () { setRole(b.dataset.roleBtn, true); }); });

  /* ссылка для пересылки */
  $('#copy').addEventListener('click', function () {
    var u = new URL(location.href); u.hash = ''; u.searchParams.set('role', document.documentElement.dataset.role);
    var done = function () { var b = $('#copy'); b.textContent = 'Ссылка скопирована'; $('#copy-live').textContent = 'Ссылка скопирована'; setTimeout(function () { b.textContent = 'Скопировать ссылку'; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u.href).then(done, function () { window.prompt('Скопируйте ссылку', u.href); });
    else window.prompt('Скопируйте ссылку', u.href);
  });

  /* данные */
  function getJSON(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); }); }
  Promise.all([getJSON('data/deals.json'), getJSON('data/projects.json')]).then(function (res) {
    initDeals(res[0]);
    initProjects(res[1]);
  }).catch(function () {
    $('#sum').textContent = 'Не удалось загрузить данные. Обновите страницу.';
  });

  function initProjects(list) {
    $('#projects').innerHTML = list.map(function (p) {
      var link = p.link
        ? '<a href="' + esc(p.link) + '">' + esc(p.linkLabel || 'Открыть') + '</a>'
        : '<span>Внутренний проект, без публичной ссылки</span>';
      return '<li><h3>' + esc(p.name) + '</h3><p class="p-problem">' + esc(p.problem) + '</p><p>' + esc(p.solution) + '</p><p class="p-link">' + link + '</p></li>';
    }).join('');
  }

  function initDeals(data) {
    var deals = data.deals.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var n = deals.length;
    if (data.demo) { $('#demo-hero').hidden = false; $('#demo-list').hidden = false; }
    if (!n) { $('#sum').textContent = 'Сделок пока нет.'; return; }

    var avg = deals.reduce(function (s, d) { return s + (d.ctrAfter - d.ctrBefore); }, 0) / n;
    $('#sum').textContent = n + ' ' + plural(n, 'сделка', 'сделки', 'сделок') + ', средний прирост CTR ' + (avg >= 0 ? '+' : '') + num(avg) + ' п.п. Выберите точку на графике или строку в списке, чтобы увидеть, что менялось.';

    var state = { market: 'Все', q: '', active: -1, match: deals.map(function () { return true; }) };

    /* список */
    var markets = ['Все'].concat(deals.map(function (d) { return d.marketplace; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var chips = $('#chips');
    chips.innerHTML = markets.map(function (m) { return '<button type="button" aria-pressed="' + (m === 'Все') + '" data-m="' + esc(m) + '">' + esc(m) + '</button>'; }).join('');
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      state.market = b.dataset.m;
      $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderList();
    });
    $('#q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); renderList(); });

    var list = $('#deals-list');
    function renderList() {
      var rows = [];
      state.match = deals.map(function (d) {
        var hay = (d.client + ' ' + d.category + ' ' + d.change + ' ' + d.marketplace).toLowerCase();
        return (state.market === 'Все' || d.marketplace === state.market) && (!state.q || hay.indexOf(state.q) !== -1);
      });
      deals.forEach(function (d, i) {
        if (!state.match[i]) return;
        var delta = d.ctrAfter - d.ctrBefore;
        rows.push('<li class="deal" data-i="' + i + '"' + (i === state.active ? ' aria-current="true"' : '') + '>' +
          '<span class="d-date">' + esc(date(d.date, true)) + '</span>' +
          '<span class="d-who"><b>' + esc(d.client) + '</b><span>' + esc(d.marketplace) + ', ' + esc(d.category) + '</span></span>' +
          '<span class="d-ctr"><s>' + num(d.ctrBefore) + '%</s> на ' + num(d.ctrAfter) + '%<span class="d-delta">' + (delta >= 0 ? '+' : '') + num(delta) + ' п.п.</span></span>' +
          '<span class="d-change">' + esc(d.change) + '</span></li>');
      });
      var shown = rows.length;
      list.innerHTML = shown ? rows.join('') : '<li class="empty">Ничего не найдено.<button type="button" id="reset">Сбросить фильтры</button></li>';
      $('#count').textContent = 'Показано ' + shown + ' из ' + n;
      var reset = $('#reset');
      if (reset) reset.addEventListener('click', function () {
        state.market = 'Все'; state.q = ''; $('#q').value = '';
        $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.m === 'Все')); });
        renderList();
      });
      dimDots();
    }
    list.addEventListener('click', function (e) {
      var li = e.target.closest('.deal'); if (!li) return;
      activate(+li.dataset.i);
    });

    /* график */
    var wrap = $('#chart'), svg = $('#chart-svg'), tip = $('#tip');
    var G = null, drawn = false;
    var PAD = { l: 40, r: 14, t: 14, b: 28 };

    function build() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      var max = Math.max.apply(null, deals.map(function (d) { return Math.max(d.ctrBefore, d.ctrAfter); }));
      var top = Math.ceil(max * 1.12);
      var iw = w - PAD.l - PAD.r, ih = h - PAD.t - PAD.b;
      var X = function (i) { return PAD.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw); };
      var Y = function (v) { return PAD.t + (1 - v / top) * ih; };
      G = { w: w, h: h, X: X, Y: Y };

      var grid = [0, top / 2, top].map(function (v) {
        return '<line x1="' + PAD.l + '" x2="' + (w - PAD.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#fff" stroke-opacity=".16"/>' +
          '<text x="' + (PAD.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + num(v).replace(',0', '') + '%</text>';
      }).join('');
      var every = w < 560 ? Math.ceil(n / 3) : Math.ceil(n / 5);
      var xl = deals.map(function (d, i) {
        if (i % every && i !== n - 1) return '';
        if (i !== n - 1 && n - 1 - i < every * 0.6) return '';
        return '<text x="' + X(i) + '" y="' + (h - 6) + '" text-anchor="' + (i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle') + '">' + esc(date(d.date)) + '</text>';
      }).join('');
      var pts = function (key) { return deals.map(function (d, i) { return X(i).toFixed(1) + ',' + Y(d[key]).toFixed(1); }).join(' '); };
      var dots = deals.map(function (d, i) {
        return '<circle class="dot" data-i="' + i + '" cx="' + X(i) + '" cy="' + Y(d.ctrAfter) + '" r="4" fill="#fff" stroke="#0a0a0a" stroke-width="1.5"/>';
      }).join('');

      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.innerHTML = grid + xl +
        '<polyline points="' + pts('ctrBefore') + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="3 4" stroke-linejoin="round"/>' +
        '<line id="cur" y1="' + PAD.t + '" y2="' + (h - PAD.b) + '" stroke="#fff" stroke-opacity=".5" visibility="hidden"/>' +
        '<polyline id="line" points="' + pts('ctrAfter') + '" fill="none" stroke="#fff" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<g id="dots">' + dots + '</g>';

      var line = $('#line', svg);
      if (!drawn && !reduce && line.getTotalLength) {
        var len = line.getTotalLength();
        line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
        $('#dots', svg).style.opacity = 0;
        requestAnimationFrame(function () {
          line.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.3,.6,.2,1)';
          line.style.strokeDashoffset = 0;
          $('#dots', svg).style.transition = 'opacity .5s 1.2s';
          $('#dots', svg).style.opacity = 1;
        });
      }
      drawn = true;
      dimDots();
      if (state.active >= 0) showActive();
    }

    function dimDots() {
      $$('.dot', svg).forEach(function (c) { c.style.opacity = state.match[+c.dataset.i] ? 1 : 0.22; });
    }

    function showActive() {
      var i = state.active, d = deals[i];
      if (!G || i < 0) return;
      var cur = $('#cur', svg); cur.setAttribute('x1', G.X(i)); cur.setAttribute('x2', G.X(i)); cur.setAttribute('visibility', 'visible');
      $$('.dot', svg).forEach(function (c) { c.setAttribute('r', +c.dataset.i === i ? 6.5 : 4); });
      var delta = d.ctrAfter - d.ctrBefore;
      tip.innerHTML = '<b>' + esc(d.client) + ', ' + esc(d.marketplace) + '</b>' +
        '<span>' + esc(date(d.date, true)) + ', ' + esc(d.category) + '</span><br>' +
        'CTR ' + num(d.ctrBefore) + '% на ' + num(d.ctrAfter) + '% (' + (delta >= 0 ? '+' : '') + num(delta) + ' п.п.)<br>' + esc(d.change);
      tip.hidden = false;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = G.X(i) + 14; if (x + tw > G.w) x = G.X(i) - tw - 14; if (x < 0) x = 0;
      var y = G.Y(d.ctrAfter) - th - 14; if (y < 0) y = G.Y(d.ctrAfter) + 16;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    }

    function activate(i, fromChart) {
      state.active = i;
      $$('.deal', list).forEach(function (li) { if (+li.dataset.i === i) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current'); });
      showActive();
      if (!fromChart) { var r = wrap.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
    }

    function nearest(ev) {
      var r = wrap.getBoundingClientRect(), x = ev.clientX - r.left, best = 0, bd = Infinity;
      for (var i = 0; i < n; i++) { var dd = Math.abs(G.X(i) - x); if (dd < bd) { bd = dd; best = i; } }
      return best;
    }
    wrap.addEventListener('pointermove', function (e) { if (G && e.pointerType === 'mouse') activate(nearest(e), true); });
    wrap.addEventListener('pointerdown', function (e) { if (G) activate(nearest(e), true); });

    renderList();
    build();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 120); });
  }
})();
