(function () {
  var canvas = document.getElementById('noise');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BUDGET = 12000;
  var W = 0, H = 0, A = 1, img = null, px = null;
  var visible = true, raf = 0, last = -Infinity;

  function hash(x, y) { var s = Math.sin(127.1 * x + 311.7 * y) * 43758.5453123; return s - Math.floor(s); }
  function sm(t) { return t * t * (3 - 2 * t); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    var u = sm(xf), v = sm(yf);
    return a + (b - a) * u + (c - a) * v * (1 - u) + (d - b) * u * v;
  }
  function fbm(x, y, oct) {
    var sum = 0, amp = 0.5, f = 1;
    for (var i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f); f *= 2; amp *= 0.5; }
    return sum;
  }
  function field(x, y, t) {
    var n = fbm(x, y, 2), u = fbm(x + 5.2, y + 1.3, 2);
    var i = fbm(x + 2.6 * n + 1.7 + 0.045 * t, y + 2.6 * u + 9.2, 2);
    var l = fbm(x + 2.6 * n + 8.3, y + 2.6 * u + 2.8 - 0.035 * t, 2);
    return fbm(x + 2.2 * i, y + 2.2 * l, 3);
  }
  function size() {
    var p = canvas.parentElement;
    var a = p && p.clientHeight ? p.clientWidth / p.clientHeight : 1.6;
    a = Math.min(3, Math.max(0.3, a));
    var w = Math.round(Math.sqrt(BUDGET * a)), h = Math.round(Math.sqrt(BUDGET / a));
    if (w !== W || h !== H) {
      W = w; H = h; A = a;
      canvas.width = W; canvas.height = H;
      img = ctx.createImageData(W, H); px = img.data;
    }
  }
  function draw(ms) {
    size();
    var t = ms / 1000;
    for (var y = 0; y < H; y++) {
      var fy = (y / H) * 1.28 / A;
      for (var x = 0; x < W; x++) {
        var v = field((x / W) * 1.28, fy, t);
        v = sm(Math.min(1, Math.max(0, (v - 0.36) / 0.32)));
        var g = Math.round(255 * v), k = (W * y + x) * 4;
        px[k] = g; px[k + 1] = g; px[k + 2] = g; px[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  function loop(ms) {
    raf = 0;
    if (!visible || document.hidden) return;
    if (ms - last >= 50) { last = ms; draw(ms); }
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }

  draw(0);
  if (reduce) return;
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }, { threshold: 0 }).observe(canvas.parentElement);
  document.addEventListener('visibilitychange', start);
  start();
})();
