/* Gefühlskarten — Spiellogik. Keine Datenbank: der Spielstand und die Notizen bleiben im Browser (localStorage). */
(function () {
  "use strict";
  var KEY = "pt-gefuehlskarten-v1";
  var COLS = 6;
  var CARDS = window.KARTEN || [];
  var CATS = window.KATEGORIEN || {};
  var WORDMARK = ["M224.9,100.9c-3,0-5.5-1-7.5-2.9-2-1.9-3-4.4-3-7.4s1-5.4,3-7.4c2-2,4.5-3,7.5-3s5.5,1,7.6,3c2,2,3.1,4.5,3.1,7.4s-1,5.5-3.1,7.4c-2,1.9-4.6,2.9-7.6,2.9Z", "M26.6,123V40.4h17.4v3.9c2.6-3.5,6.4-5.3,11.6-5.3s9.5,1.2,13.1,3.7,6.5,6,8.5,10.7c2,4.6,3,10.2,3,16.6s-1,11.5-3.1,16.2c-2.1,4.6-5,8.2-8.7,10.9-3.7,2.6-8,3.9-12.9,3.9s-4.7-.4-6.6-1.3c-1.9-.9-3.5-2.1-4.8-3.8v19.5l-17.4,7.8ZM52.5,84.2c3.2,0,5.8-1.2,7.5-3.7,1.8-2.5,2.7-6,2.7-10.4s-.9-8.2-2.6-10.6-4.3-3.6-7.6-3.6-3.5.3-4.8.8c-1.3.5-2.6,1.3-3.7,2.5v21.6c.3,1,1.3,1.8,3,2.5,1.6.7,3.5,1,5.6,1Z", "M109.6,100.9c-6.1,0-11-2-14.7-5.9-3.7-4-5.5-9.2-5.5-15.8v-38.8h17.4v30.2c0,5,.7,8.5,2.1,10.5,1.4,2,3.7,3,7.1,3s6.1-1.1,7.7-3.2c1.6-2.1,2.4-5.5,2.4-10.1v-30.4h17.4v59.2h-17.4v-5.4c-1.7,2.2-4,3.9-6.9,5.1-2.8,1.2-6,1.8-9.5,1.8Z", "M183.9,100.9c-2.5,0-4.7-.5-6.3-1.4s-3.1-2.4-4.2-4.5v4.5h-17.4V23.7l17.4-7.8v28.7c1.3-1.9,2.9-3.3,4.8-4.2,1.9-1,4.2-1.4,6.7-1.4,4.8,0,9,1.3,12.7,4,3.7,2.6,6.6,6.3,8.7,10.9,2.1,4.7,3.2,10,3.2,16,0,9.7-2.3,17.3-6.8,22.8-4.5,5.5-10.8,8.2-18.8,8.2ZM182,84.2c3.2,0,5.8-1.2,7.5-3.7,1.8-2.5,2.7-6,2.7-10.5s-.9-8-2.7-10.4c-1.8-2.5-4.3-3.7-7.5-3.7s-3.5.3-5,.9c-1.5.6-2.7,1.5-3.6,2.6v21.5c1,1.2,2.1,2.1,3.4,2.6,1.3.5,3,.8,5.2.8Z", "M261.5,100.9c-5.1,0-8.9-1.4-11.4-4.1-2.5-2.7-3.7-6.8-3.7-12.3v-28.9h-8v-15.3h8v-16.2l17.2-8.2v24.4h12.6v15.3h-12.6v26.9c0,1.2.3,2,.9,2.7.6.6,1.5.9,2.7.9,3,0,6.2-.8,9.8-2.3l-2,14.5c-1.9.8-3.9,1.5-6.1,2-2.2.5-4.7.7-7.4.7Z", "M310.8,100.9c-5.9,0-10.9-1.2-15.1-3.7s-7.5-6-9.7-10.7-3.4-10.2-3.4-16.7,1.1-11.8,3.4-16.4,5.6-8.2,9.8-10.7c4.2-2.5,9.2-3.8,15-3.8s9.5,1,13.6,3c4,2,7.2,5.1,9.6,9.3,2.4,4.1,3.6,9.4,3.6,15.7s0,2.4,0,4c0,1.6-.2,3.2-.4,4.8h-37.6c0,2.1.5,4,1.4,5.5.9,1.6,2.2,2.8,3.9,3.6,1.7.8,3.7,1.3,6,1.3s5.5-.5,7.6-1.4c2-1,4-2.6,5.9-4.8l10,10c-2.8,3.4-6.1,6-9.9,8s-8.3,3-13.5,3ZM299.7,62.8h21.3c-.3-2-.9-3.7-1.8-5.1-.9-1.4-2.1-2.4-3.5-3-1.5-.7-3.2-1-5.3-1s-5.2.8-7.1,2.4c-1.9,1.6-3.1,3.9-3.5,6.7Z", "M373.9,100.9c-5.7,0-10.7-1.3-14.8-3.8-4.2-2.5-7.4-6.1-9.7-10.7-2.3-4.6-3.4-10.1-3.4-16.4s1.1-11.8,3.4-16.4c2.3-4.6,5.5-8.2,9.7-10.8,4.2-2.5,9.1-3.8,14.7-3.8s12.4,1.6,16.8,4.7c4.4,3.2,7.6,7.9,9.6,14.1l-16.6,5.4c-.9-2.4-2.2-4.3-3.9-5.6-1.7-1.3-3.6-2-5.7-2s-5.6,1.4-7.6,4.1c-2,2.7-3,6.1-3,10.3s1,7.6,2.9,10.2c1.9,2.7,4.4,4,7.4,4s4.3-.7,6-2.1c1.7-1.4,3-3.5,3.9-6.3l16.6,4.7c-2,6.8-5.2,11.9-9.6,15.3-4.4,3.4-10,5.1-16.8,5.1Z", "M410.1,99.5V24l17.4-8v29.9c1.9-2.3,4.2-4,6.9-5.1,2.7-1.1,5.8-1.7,9.3-1.7s7.8.9,10.8,2.6c3,1.8,5.4,4.3,7.1,7.5,1.7,3.3,2.5,7.1,2.5,11.6v38.8h-17.4v-30.2c0-5-.7-8.5-2.1-10.5-1.4-2-3.7-3-7.1-3s-6.1,1.1-7.7,3.2c-1.6,2.1-2.4,5.5-2.4,10.1v30.4h-17.4Z"];
  var LOGO_SVG = '<svg viewBox="0 0 490.7 139" role="img" aria-label="pub.tech">' + WORDMARK.map(function (d) { return '<path d="' + d + '"/>'; }).join("") + "</svg>";

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var state;
  var lastFocus = null;

  /* Weiche Trennstellen (&shy;) für lange Wörter aus TRENNUNGEN einsetzen */
  var HY = (window.TRENNUNGEN || []).map(function (w) { return [w.replace(/\|/g, ""), w.replace(/\|/g, "\u00ad")]; });
  function hy(s) { s = String(s == null ? "" : s); HY.forEach(function (p) { s = s.split(p[0]).join(p[1]); }); return s; }

  /* ---------- Speichern ---------- */
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.total === CARDS.length) {
      s.picks = s.picks || {}; s.notes = s.notes || {}; s.done = s.done || []; s.up = s.up || [];
      if (!s.pos) { var n = deal(s.notes); n.done = s.done; n.up = s.up.filter(function (i) { return s.done.indexOf(i) < 0; }); n.picks = s.picks; return n; }
      return s;
    } } } catch (e) {}
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- Neues Spiel: Karten lose auf dem Schreibtisch verteilen ---------- */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  /* ---------- Auslagen: Formen, die die Karten auf dem Tisch bilden ---------- */
  function ell(cx, cy, rx, ry, rot, n) { var c = Math.cos(rot || 0), s = Math.sin(rot || 0), a = []; n = n || 48;
    for (var i = 0; i <= n; i++) { var t = i / n * 2 * Math.PI, x = Math.cos(t) * rx, y = Math.sin(t) * ry; a.push([cx + x * c - y * s, cy + x * s + y * c]); } return a; }
  function closed(p) { return p.concat([p[0]]); }
  /* Formen: kräftige, einfache Umrisse. FILL-Formen werden flächig mit Karten gefüllt, die anderen entlang einer Linie gelegt. */
  var SHAPES = {
    herz: function () { var a = []; for (var i = 0; i <= 80; i++) { var t = i / 80 * 2 * Math.PI, s = Math.sin(t);
      a.push([16 * s * s * s, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); } return [a]; },
    stern: function () { var a = []; for (var i = 0; i < 10; i++) { var r = i % 2 ? 0.5 : 1, w = i / 10 * 2 * Math.PI - Math.PI / 2; a.push([Math.cos(w) * r, Math.sin(w) * r]); } return [closed(a)]; },
    plus: function () { return [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]]; },
    raute: function () { return [closed([[0, -1], [0.72, 0], [0, 1], [-0.72, 0]])]; },
    pfeil: function () { return [closed([[-1, -0.3], [0.15, -0.3], [0.15, -0.75], [1, 0], [0.15, 0.75], [0.15, 0.3], [-1, 0.3]])]; },
    kreis: function () { return [ell(0, 0, 1, 1, 0, 72)]; },
    unendlich: function () { var a = []; for (var i = 0; i <= 120; i++) { var t = i / 120 * 2 * Math.PI, d = 1 + Math.sin(t) * Math.sin(t); a.push([Math.cos(t) / d * 1.6, Math.sin(t) * Math.cos(t) / d * 1.6]); } return [a]; },
    spirale: function () { var a = []; for (var i = 0; i <= 160; i++) { var t = i / 160 * 2.4 * 2 * Math.PI, r = 0.12 + t * 0.058; a.push([Math.cos(t) * r, Math.sin(t) * r]); } return [a]; },
    welle: function () { var a = []; for (var i = 0; i <= 60; i++) { var x = i / 60 * 4 - 2; a.push([x, Math.sin(x * 2.2) * 0.5]); } return [a]; }
  };
  var FILL = {};
  function inPoly(x, y, P) { var c = false; for (var i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  var LAYOUTS = [["stapel", "Unordentlich"], ["verstreut", "Verstreut"], ["raster", "Raster"], ["herz", "Herz"], ["stern", "Stern"], ["plus", "Plus"], ["raute", "Raute"], ["pfeil", "Pfeil"], ["kreis", "Kreis"], ["unendlich", "Unendlich"], ["spirale", "Spirale"], ["welle", "Welle"]];

  function shapeClass(layout) { var d = $("#board"); if (d) d.classList.toggle("is-shape", !!SHAPES[layout]); }
  function deskSize() {
    var d = $("#board"), W = (d && d.clientWidth) || 1000, H = (d && d.clientHeight) || 700, cw = 90, ch = 126;
    if (d) { var t = document.createElement("div"); t.style.cssText = "position:absolute;width:var(--cw);height:var(--ch);visibility:hidden"; d.appendChild(t); cw = t.offsetWidth || cw; ch = t.offsetHeight || ch; d.removeChild(t); }
    return { W: W, H: H, cw: cw, ch: ch };
  }
  function jit(v) { return (Math.random() - 0.5) * v; }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }

  /* Verteilt die Karten (ids) nach Auslage und gibt neue Positionen zurück */
  function arrange(layout, ids) {
    var n = ids.length, pos = {};
    if (!n) return pos;
    if (layout === "raster") { var Dg = deskSize(), cols = Math.max(1, Math.round(Math.sqrt(n * (Dg.W / Dg.ch) / (Dg.H / Dg.cw) ))), rows = Math.ceil(n / cols);
      ids.forEach(function (idx, k) { var c2 = k % cols, r2 = Math.floor(k / cols); pos[idx] = { x: cols > 1 ? c2 / (cols - 1) : 0.5, y: rows > 1 ? r2 / (rows - 1) : 0.5, r: Math.round(jit(3)), z: k + 1 }; }); return pos; }
    if (layout === "verstreut") { ids.forEach(function (idx, k) { pos[idx] = { x: Math.random(), y: Math.random(), r: Math.round(jit(70)), z: k + 1 }; }); return pos; }
    if (!SHAPES[layout]) {
      var P = Math.max(3, Math.min(8, Math.ceil(n / 10))), pc = P <= 4 ? 2 : P <= 6 ? 3 : 4, pr = Math.ceil(P / pc), centers = [];
      for (var s = 0; s < P; s++) { var c = s % pc, r = Math.floor(s / pc), inRow = Math.min(pc, P - r * pc), off = (pc - inRow) / 2;
        centers.push({ x: (c + off + 0.5 + jit(0.7)) / pc, y: (r + 0.5 + jit(0.55)) / pr }); }
      ids.forEach(function (idx, k) { var ce = centers[k % P]; pos[idx] = { x: clamp01(ce.x + jit(0.17)), y: clamp01(ce.y + jit(0.2)), r: Math.round(jit(50)), z: k + 1 }; });
      return pos;
    }
    shapeClass(layout);
    var D = deskSize(), paths = SHAPES[layout](), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    paths.forEach(function (p) { p.forEach(function (q) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }); });
    var pad = Math.min(D.W, D.H) * (FILL[layout] ? 0.01 : 0.03), aw = D.W - D.cw - 2 * pad, ah = D.H - D.ch - 2 * pad, sc = Math.min(aw / (x1 - x0), ah / (y1 - y0));
    var ox = pad + D.cw / 2 + (aw - (x1 - x0) * sc) / 2 - x0 * sc, oy = pad + D.ch / 2 + (ah - (y1 - y0) * sc) / 2 - y0 * sc;
    if (FILL[layout]) {
      var P = paths[0].map(function (q) { return [ox + q[0] * sc, oy + q[1] * sc]; }), bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
      P.forEach(function (q) { bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]); by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]); });
      var pts = function (st) { var out = [], row = 0; for (var y = by0 + st * 0.5; y < by1; y += st * 0.86, row++) for (var x = bx0 + st * 0.5 + (row % 2) * st * 0.5; x < bx1; x += st) if (inPoly(x, y, P)) out.push([x, y]); return out; };
      var lo = 4, hi = Math.max(bx1 - bx0, by1 - by0), best = pts(lo);
      for (var it = 0; it < 22; it++) { var mid = (lo + hi) / 2, pp = pts(mid); if (pp.length >= n) { lo = mid; best = pp; } else hi = mid; }
      best = shuffle(best).slice(0, n);
      ids.forEach(function (idx, k) { var q = best[k] || best[k % best.length];
        pos[idx] = { x: clamp01((q[0] + jit(6) - D.cw / 2) / (D.W - D.cw)), y: clamp01((q[1] + jit(6) - D.ch / 2) / (D.H - D.ch)), r: Math.round(jit(8)), z: k + 1 }; });
      return pos;
    }
    var segs = [], L = 0;
    paths.forEach(function (p) { for (var i = 1; i < p.length; i++) { var a = [ox + p[i - 1][0] * sc, oy + p[i - 1][1] * sc], b = [ox + p[i][0] * sc, oy + p[i][1] * sc], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > 0) { segs.push({ a: a, b: b, l: l, s: L }); L += l; } } });
    var si = 0;
    ids.forEach(function (idx, k) {
      var d = (k + 0.5) / n * L; while (si < segs.length - 1 && segs[si].s + segs[si].l < d) si++;
      var g = segs[si], f = (d - g.s) / g.l, cx = g.a[0] + (g.b[0] - g.a[0]) * f + jit(4), cy = g.a[1] + (g.b[1] - g.a[1]) * f + jit(4);
      var r = Math.atan2(g.b[1] - g.a[1], g.b[0] - g.a[0]) * 180 / Math.PI - 90; while (r > 90) r -= 180; while (r <= -90) r += 180;
      pos[idx] = { x: clamp01((cx - D.cw / 2) / (D.W - D.cw)), y: clamp01((cy - D.ch / 2) / (D.H - D.ch)), r: Math.round(r + jit(8)), z: k + 1 };
    });
    return pos;
  }

  function deal(notes, layout) {
    layout = layout || (state && state.layout) || "stapel"; if (layout !== "stapel" && layout !== "verstreut" && layout !== "raster" && !SHAPES[layout]) layout = "stapel";
    var order = shuffle(CARDS.map(function (_, i) { return i; })), n = order.length;
    return { total: CARDS.length, layout: layout, pos: arrange(layout, order), top: n + 1, up: [], done: [], notes: notes || {}, picks: (state && state.picks) || {}, name: (state && state.name) || "" };
  }

  /* Auslage wechseln: offene Karten gleiten in die neue Form, Fortschritt bleibt */
  function setLayout(layout) {
    var open = shuffle(CARDS.map(function (_, i) { return i; }).filter(function (i) { return state.done.indexOf(i) < 0; }));
    var pos = arrange(layout, open);
    if (!SHAPES[layout]) shapeClass(layout);
    state.layout = layout; state.top = Math.max(state.top, open.length + 1);
    Object.keys(pos).forEach(function (k) { state.pos[k] = pos[k]; });
    save(); renderLayouts();
    var desk = $("#board"), reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { render(); return; }
    desk.classList.add("is-arranging");
    open.forEach(function (idx) { var el = desk.querySelector('.card[data-idx="' + idx + '"]'), p = state.pos[idx]; if (!el) return;
      el.style.left = "calc(" + p.x + " * (100% - var(--cw)))"; el.style.top = "calc(" + p.y + " * (100% - var(--ch)))";
      el.style.setProperty("--rot", p.r + "deg"); el.style.zIndex = isUp(idx) ? 5000 + p.z : p.z; });
    clearTimeout(setLayout.t); setLayout.t = setTimeout(function () { desk.classList.remove("is-arranging"); render(); }, 900);
  }
  function shapeIcon(id) {
    if (id === "stapel") return '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="9" height="12" rx="2" transform="rotate(-14 8 11)"/><rect x="10" y="7" width="9" height="12" rx="2" transform="rotate(12 14 13)"/></svg>';
    if (id === "raster") return '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="8" rx="1.5"/><rect x="3" y="13" width="7" height="8" rx="1.5"/><rect x="14" y="13" width="7" height="8" rx="1.5"/></svg>';
    if (id === "verstreut") return '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="6" height="8" rx="1.5" transform="rotate(-20 5 7)"/><rect x="15" y="2" width="6" height="8" rx="1.5" transform="rotate(18 18 6)"/><rect x="8" y="13" width="6" height="8" rx="1.5" transform="rotate(8 11 17)"/></svg>';
    var p = SHAPES[id](), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    p.forEach(function (q) { q.forEach(function (v) { x0 = Math.min(x0, v[0]); x1 = Math.max(x1, v[0]); y0 = Math.min(y0, v[1]); y1 = Math.max(y1, v[1]); }); });
    var s = 18 / Math.max(x1 - x0, y1 - y0), ox = 12 - (x0 + x1) / 2 * s, oy = 12 - (y0 + y1) / 2 * s;
    return '<svg viewBox="0 0 24 24">' + p.map(function (q) { return '<polyline points="' + q.map(function (v) { return (ox + v[0] * s).toFixed(1) + "," + (oy + v[1] * s).toFixed(1); }).join(" ") + '"/>'; }).join("") + "</svg>";
  }
  function layPop(open) {
    var p = $("#laypop"); p.hidden = !open; $("#layBtn").setAttribute("aria-expanded", String(!!open));
    if (open) { var on = p.querySelector(".lay.is-on") || p.querySelector(".lay"); if (on) on.focus(); }
  }
  function renderLayouts() {
    var el = $("#layouts"); if (!el) return;
    var cur = LAYOUTS.filter(function (l) { return l[0] === (state.layout || "stapel"); })[0] || LAYOUTS[0];
    $("#layIcon").innerHTML = shapeIcon(cur[0]); $("#layName").textContent = cur[1];
    $("#layBtn").setAttribute("aria-label", "Auslage: " + cur[1] + " – ändern");
    el.innerHTML = LAYOUTS.map(function (l) { var on = (state.layout || "stapel") === l[0];
      return '<button type="button" class="lay' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-l="' + l[0] + '">' + shapeIcon(l[0]) + "<span>" + l[1] + "</span></button>"; }).join("") +
      '<button type="button" class="lay lay--rand" data-l="zufall"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" class="dot"/><circle cx="15.5" cy="8.5" r="1.3" class="dot"/><circle cx="12" cy="12" r="1.3" class="dot"/><circle cx="8.5" cy="15.5" r="1.3" class="dot"/><circle cx="15.5" cy="15.5" r="1.3" class="dot"/></svg><span>Zufall</span></button>';
  }

  /* ---------- Schreibtisch-Gegenstände: liegen zufällig neben dem Tisch ---------- */
  /* Echte Maße (mm) der Gegenstände – so stimmen die Größen untereinander */
  var PROP_DEFS = {
    keyboard: { img: "obj-tastatur.webp", ar: 420 / 1100, mm: 440, rot: [82, 98] },
    mouse:    { img: "obj-maus.webp",     ar: 700 / 404,  mm: 64,  rot: [-22, 22] },
    pen:      { img: "obj-stift.webp",    ar: 637 / 700,  mm: 108, rot: [-45, 45] },
    coffee:   { img: "obj-kaffee.webp",   ar: 644 / 700,  mm: 165, rot: [0, 360] },
    notebook: { img: "obj-notizbuch.webp", ar: 604 / 700, mm: 300, rot: [-24, 24] },
    plant:    { img: "obj-pflanze.webp",  ar: 675 / 700,  mm: 230, rot: [0, 360] },
    notes:    { img: "obj-notizzettel.webp", ar: 660 / 700, mm: 84, rot: [-30, 30] },
    phone:    { img: "obj-handy.webp",    ar: 700 / 354,  mm: 92,  rot: [-35, 35] }
  };
  /* Kleine Impulse, die beim Drüberfahren über einen Gegenstand erscheinen */
  var PROP_TIPS = {
    coffee: [
      "Gönn dir eine Pause. Abstand bringt oft mehr als das nächste Argument.",
      "Kurz durchatmen. Ein Konflikt läuft dir nicht davon.",
      "Manchmal klärt sich bei einem Kaffee zu zweit mehr als im Meeting.",
      "Lad die andere Person auf einen Kaffee ein. Ein neutraler Ort entspannt.",
      "Erst runterkommen, dann reden. Mit Puls 120 hört niemand richtig zu.",
      "Zehn Minuten Pause sind kein Rückzug, sondern Klugheit.",
      "Wie geht es dir gerade wirklich? Nimm dir einen Schluck Zeit für die Antwort.",
      "Gute Gespräche brauchen kein Protokoll, manchmal nur zwei Tassen."
    ],
    keyboard: [
      "Bevor du auf Senden drückst: Würdest du es auch so sagen?",
      "Schwierige Themen lieber im Gespräch klären als im Chat.",
      "Schreib die wütende Mail. Und lösch sie dann.",
      "Großbuchstaben wirken wie Schreien. Auch wenn du es nicht so meinst.",
      "Ton ist im Text schwer zu lesen. Im Zweifel nachfragen, wie es gemeint war.",
      "Eine Nacht drüber schlafen, dann antworten. Das wirkt oft Wunder.",
      "Kurze Nachrichten wirken schnell schroff. Ein freundlicher Satz mehr hilft.",
      "Lieber eine klare Frage stellen als eine lange Vermutung schreiben."
    ],
    mouse: [
      "Ein Klick ist schnell gemacht. Ein Gespräch dauert länger, bringt aber mehr.",
      "Nicht alles muss sofort beantwortet werden. Erst sortieren, dann reagieren.",
      "Zoom raus: Wie wichtig ist das Thema in einem Monat noch?",
      "Scroll mal durch die andere Perspektive, bevor du urteilst.",
      "Rückgängig machen geht im Leben selten. Entschuldigen schon.",
      "Klick dich nicht durch Konflikte. Nimm dir bewusst Zeit dafür.",
      "Du musst nicht jede Diskussion gewinnen. Manchmal reicht es, sie gut zu führen."
    ],
    pen: [
      "Schreib auf, was dich bewegt. Was auf Papier steht, sortiert den Kopf.",
      "Formulier deinen Wunsch als Ich-Botschaft, bevor du ins Gespräch gehst.",
      "Notier drei Dinge, die du an der anderen Person schätzt.",
      "Was genau ist passiert? Schreib es ohne Bewertung auf.",
      "Welches Bedürfnis steckt hinter deinem Ärger? Schreib es auf.",
      "Plane deinen ersten Satz für das Gespräch. Der Anfang prägt den Rest.",
      "Halte fest, was du vom Gegenüber gelernt hast."
    ],
    notebook: [
      "Was hast du aus dem letzten Konflikt gelernt? Halt eine Erkenntnis fest.",
      "Fortschritt statt Sieg. Was ist heute ein kleines Stück besser geworden?",
      "Welche Situation hat dich heute getriggert? Und warum?",
      "Notier, was gut gelaufen ist. Auch kleine Schritte zählen.",
      "Wie würdest du die Situation aus Sicht der anderen Person beschreiben?",
      "Welche Vereinbarung wollt ihr in zwei Wochen nochmal anschauen?",
      "Schreib auf, was du beim nächsten Mal anders machen willst."
    ],
    plant: [
      "Beziehungen wachsen langsam. Ein bisschen Pflege jeden Tag reicht.",
      "Auch nach einem Streit kann etwas Neues wachsen.",
      "Vertrauen braucht Zeit, Licht und regelmäßige Aufmerksamkeit.",
      "Nicht jeder Konflikt ist Unkraut. Manche bringen das Team zum Wachsen.",
      "Gieß die guten Momente. Lob wirkt wie Wasser.",
      "Wurzeln sieht man nicht. Werte auch nicht. Frag nach ihnen.",
      "Gib Veränderung Zeit. Über Nacht wächst selten etwas."
    ],
    notes: [
      "Halt Vereinbarungen fest. Was aufgeschrieben ist, wird seltener vergessen.",
      "Ein ehrliches Danke auf einem Zettel wirkt Wunder.",
      "Wer macht was bis wann? Ein Zettel macht es verbindlich.",
      "Sammelt Ideen erst ohne Bewertung. Aussortieren kommt später.",
      "Ein Gedanke pro Zettel. Dann lässt sich alles neu sortieren.",
      "Kleb dir einen Satz an den Bildschirm, der dich ruhig bleiben lässt.",
      "Offene Punkte sichtbar machen nimmt Druck aus dem Kopf."
    ],
    phone: [
      "Leg das Handy weg und hör richtig zu. Volle Aufmerksamkeit ist ein Geschenk.",
      "Lieber kurz anrufen als zehn Nachrichten hin und her.",
      "Benachrichtigungen aus, Gespräch an.",
      "Wenn es emotional wird: Wechselt vom Chat ins Gespräch.",
      "Ein Sprachanruf trägt mehr Tonfall als jede Nachricht.",
      "Wen könntest du heute mal anrufen, einfach um nachzufragen?",
      "Gesehen, aber nicht geantwortet? Frag nach, statt dir eine Geschichte auszudenken."
    ]
  };
  /* nicht zweimal hintereinander denselben Spruch zeigen */
  var lastTip = {};
  var PROP_NAMES = { coffee: "Kaffeepause", keyboard: "Tastatur", mouse: "Maus", pen: "Stift", notebook: "Notizbuch", plant: "Pflanze", notes: "Post-its", phone: "Handy" };
  function propTip(el) {
    var t = $("#propTip"); if (!t) { t = document.createElement("div"); t.id = "propTip"; t.className = "proptip"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    if (!el) { t.classList.remove("is-on"); return; }
    var k = el.dataset.k, list = PROP_TIPS[k] || [], n = Math.floor(Math.random() * list.length);
    if (list.length > 1 && n === lastTip[k]) n = (n + 1) % list.length;
    lastTip[k] = n; var txt = list[n] || "";
    t.innerHTML = '<span class="proptip__k">' + esc(PROP_NAMES[k] || "") + '</span><span class="proptip__t">' + esc(txt) + "</span>";
    var r = el.getBoundingClientRect(), vw = document.documentElement.clientWidth, l = Math.max(r.left, 0), rr = Math.min(r.right, vw), cx = (l + rr) / 2;
    t.style.visibility = "hidden"; t.classList.add("is-on");
    var tw = t.offsetWidth, th = t.offsetHeight, x = Math.max(12, Math.min(vw - tw - 12, cx - tw / 2)), y = r.top - th - 12;
    if (y < 12) y = r.bottom + 12;
    t.style.left = x + "px"; t.style.top = y + "px"; t.style.visibility = "";
  }
  var propLay = null;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function layoutProps() {
    var A = ["keyboard", "mouse"].concat(Math.random() < 0.5 ? ["pen"] : []), B = shuffle(["coffee", "notebook", "plant", "notes", "phone"]);
    if (A.length === 2) B.push("pen");
    if (Math.random() < 0.5) A.reverse();
    var flip = Math.random() < 0.5;
    propLay = [];
    [[A, flip ? 1 : 0], [B, flip ? 0 : 1]].forEach(function (g) {
      g[0].forEach(function (k, j) { var d = PROP_DEFS[k]; propLay.push({ k: k, side: g[1], slot: j, out: rnd(0.55, 0.9), rot: rnd(d.rot[0], d.rot[1]), gap: Math.random(), prio: k === "keyboard" || k === "coffee" ? 0 : k === "mouse" ? 0.05 : Math.random() + 0.1 }); });
    });
    placeProps();
  }
  function placeProps() {
    var z = $("#stage"), box = z && z.querySelector(".props"), dz = $("#deskZone"); if (!box || !propLay || !dz) return;
    var W = z.clientWidth, H = dz.clientHeight || ($(".stage__main") && $(".stage__main").clientHeight) || 600, k = 1.0 * Math.max(0.7, Math.min(1.15, W / 1000)), html = "";
    [0, 1].forEach(function (side) {
      var all = propLay.filter(function (p) { return p.side === side; }).map(function (p) { var d = PROP_DEFS[p.k], w = d.mm * k, h = w * d.ar, r = p.rot * Math.PI / 180;
        return { p: p, w: w, h: h, vw: Math.abs(w * Math.cos(r)) + Math.abs(h * Math.sin(r)), vh: Math.abs(w * Math.sin(r)) + Math.abs(h * Math.cos(r)) }; });
      /* nur so viele Gegenstände, wie realistisch neben den Tisch passen */
      var used = 0, keep = [];
      all.slice().sort(function (a, b) { return a.p.prio - b.p.prio; }).forEach(function (d) { if (used + d.vh <= H * 1.02 || !keep.length) { keep.push(d); used += d.vh; } });
      var dims = all.filter(function (d) { return keep.indexOf(d) >= 0; });
      var free = Math.max(0, H - used), gs = dims.map(function (d) { return 0.3 + d.p.gap; }), gt = gs.reduce(function (t, v) { return t + v; }, 0) + 0.4, y = free * 0.2 / gt;
      dims.forEach(function (d, i) {
        var cy = y + d.vh / 2, ins = Math.min(d.vw * (1 - d.p.out), 46), cx = side ? W - ins + d.vw / 2 : ins - d.vw / 2;
        y += d.vh + free * gs[i] / gt;
        html += '<img class="prop prop--' + d.p.k + '" data-k="' + d.p.k + '" src="' + PROP_DEFS[d.p.k].img + '" alt="" draggable="false" style="width:' + d.w.toFixed(0) + "px;left:" + (cx - d.w / 2).toFixed(0) + "px;top:" + (cy - d.h / 2).toFixed(0) + "px;transform:rotate(" + d.p.rot.toFixed(0) + 'deg)">';
      });
    });
    box.innerHTML = html;
    if (!box.dataset.tips) { box.dataset.tips = "1";
      box.addEventListener("mouseover", function (e) { var el = e.target.closest(".prop"); if (el) propTip(el); });
      box.addEventListener("mouseout", function (e) { var el = e.target.closest(".prop"); if (el && !el.contains(e.relatedTarget)) propTip(null); });
      window.addEventListener("scroll", function () { propTip(null); }, { passive: true }); }
  }

  /* ---------- Hilfen ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function cat(i) { return CATS[CARDS[i].kategorie] || { name: "", bild: "", farbe: "#59d5dc" }; }
  function isUp(i) { return state.up.indexOf(i) >= 0; }

  /* ---------- Darstellung ---------- */
  function backHTML() {
    return '<span class="face back"><span class="back__pills back__pills--t"><i></i><i></i><i></i></span><span class="back__mark">' + LOGO_SVG + '</span><span class="back__pills back__pills--b"><i></i><i></i><i></i></span></span>';
  }
  function frontHTML(i) {
    var k = cat(i);
    return '<span class="face front" style="--acc:' + k.farbe + '"><img src="' + esc(k.bild) + '" alt="" draggable="false"><span class="front__cat">' + esc(k.name) + "</span></span>";
  }

  function render() {
    var desk = $("#board");
    desk.innerHTML = ""; shapeClass(state.layout);
    var open = CARDS.map(function (_, i) { return i; }).filter(function (i) { return state.done.indexOf(i) < 0; });
    open.forEach(function (idx) {
      var p = state.pos[idx], up = isUp(idx);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "card is-playable" + (up ? " is-up" : "");
      b.dataset.idx = idx;
      b.style.left = "calc(" + p.x + " * (100% - var(--cw)))";
      b.style.top = "calc(" + p.y + " * (100% - var(--ch)))";
      b.style.zIndex = up ? 5000 + p.z : p.z;
      b.style.setProperty("--rot", p.r + "deg");
      b.innerHTML = '<span class="card__inner">' + backHTML() + frontHTML(idx) + "</span>" +
        (up ? '<span class="card__drop" role="button" tabindex="0" aria-label="Karte ablegen" title="Karte ablegen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>' : "");
      if (up) { var dr = b.querySelector(".card__drop"), drop = function (e) { e.preventDefault(); e.stopPropagation(); dropCard(idx, b); };
        dr.addEventListener("click", drop); dr.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") drop(e); });
        dr.addEventListener("pointerdown", function (e) { e.stopPropagation(); }); }
      b.setAttribute("aria-label", up ? "Aufgedeckte Karte: " + CARDS[idx].titel + " — öffnen" : "Verdeckte Karte aufdecken");
      dragable(b, idx);
      desk.appendChild(b);
    });
    var done = state.done.length, total = state.total;
    $("#track").style.transform = "scaleX(" + (total ? done / total : 0) + ")";
    $("#count").textContent = done + " / " + total;
    $("#randomBtn").disabled = open.filter(function (i) { return !isUp(i); }).length === 0;
    renderPlayed();
    $("#finish").hidden = done < total || total === 0;
    var wasHidden = $("#deskZone").hidden;
    $("#deskZone").hidden = done >= total && total > 0;
    if (wasHidden !== $("#deskZone").hidden) placeProps();
  }

  /* Karten lassen sich verschieben; ein kurzer Klick deckt auf */
  function dragable(b, idx) {
    var sx, sy, ox, oy, moved = false, active = false, rect;
    b.addEventListener("pointerdown", function (e) {
      if (e.button && e.button !== 0) return;
      if (e.pointerType === "mouse") e.preventDefault();
      active = true; moved = false; sx = e.clientX; sy = e.clientY;
      rect = $("#board").getBoundingClientRect(); ox = b.offsetLeft; oy = b.offsetTop;
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
    });
    b.addEventListener("pointermove", function (e) {
      if (!active) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      if (!moved) { moved = true; b.classList.add("is-drag"); b.style.zIndex = (isUp(idx) ? 5000 : 0) + (++state.top); }
      var W = rect.width - b.offsetWidth, H = rect.height - b.offsetHeight;
      b.style.left = Math.max(0, Math.min(W, ox + dx)) + "px"; b.style.top = Math.max(0, Math.min(H, oy + dy)) + "px";
    });
    function end() {
      if (!active) return; active = false;
      if (moved) {
        b.classList.remove("is-drag");
        var W = rect.width - b.offsetWidth, H = rect.height - b.offsetHeight;
        state.pos[idx].x = W > 0 ? b.offsetLeft / W : 0; state.pos[idx].y = H > 0 ? b.offsetTop / H : 0; state.pos[idx].z = state.top;
        save();
      }
    }
    b.addEventListener("pointerup", end);
    b.addEventListener("pointercancel", end);
    b.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; return; } flip(idx, b); });
  }

  /* Zufällige verdeckte Karte ziehen */
  function drawRandom() {
    var hidden = CARDS.map(function (_, i) { return i; }).filter(function (i) { return state.done.indexOf(i) < 0 && !isUp(i); });
    if (!hidden.length) return;
    var idx = hidden[Math.floor(Math.random() * hidden.length)];
    var el = document.querySelector('.card[data-idx="' + idx + '"]');
    if (!el) return;
    el.style.zIndex = ++state.top + 5000;
    el.classList.add("is-picked");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () { flip(idx, el); }, reduce ? 0 : 450);
  }

  /* ---------- Abgelegte Karten: offen sichtbar, jederzeit wieder zu öffnen ---------- */
  var justDone = null;
  /* Abgelegte Karten: thematisch gruppiert, jede Kategorie als kleiner aufgefächerter Stapel */
  function renderPlayed() {
    var grid = $("#played"), ids = state.done.slice();
    $("#playedCount").textContent = ids.length ? "(" + ids.length + ")" : "";
    $("#playedEmpty").hidden = ids.length > 0;
    grid.innerHTML = "";
    var order = Object.keys(CATS), groups = {};
    ids.forEach(function (i) { (groups[CARDS[i].kategorie] = groups[CARDS[i].kategorie] || []).push(i); });
    var newCat = justDone != null ? CARDS[justDone].kategorie : null;
    /* zuletzt benutztes Thema steht immer oben */
    var last = {}; ids.forEach(function (i, pos) { last[CARDS[i].kategorie] = pos; });
    Object.keys(groups).sort(function (x, y) { return last[y] - last[x]; }).forEach(function (key) {
      var list = groups[key]; if (!list) return;
      list.sort(function (x, y) { return x - y; });
      var k = CATS[key] || cat(list[0]);
      var sec = document.createElement("section");
      var openG = !!(state.openGroups && state.openGroups[key]);
      sec.className = "pgrp" + (key === newCat ? " is-new" : "") + (openG ? " is-open" : "");
      sec.style.setProperty("--acc", k.farbe);
      sec.innerHTML = '<button type="button" class="pgrp__head" aria-expanded="' + openG + '" title="' + (openG ? "Zuklappen" : "Alle Karten anzeigen") + '"><img src="' + esc(k.bild) + '" alt=""><span class="pgrp__name">' + esc(hy(k.name)) + '</span><span class="pgrp__count">' + list.length + '</span><svg class="pgrp__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button>';
      sec.querySelector(".pgrp__head").addEventListener("click", function () {
        state.openGroups = state.openGroups || {}; if (state.openGroups[key]) delete state.openGroups[key]; else state.openGroups[key] = true;
        save(); renderPlayed();
      });
      var fan = document.createElement("div"); fan.className = openG ? "pgrp__list" : "pgrp__fan";
      list.forEach(function (idx, n) {
        var hasNote = (state.notes[idx] || "").trim().length > 0;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "mini" + (idx === justDone ? " is-new" : "");
        b.style.setProperty("--acc", k.farbe); b.style.setProperty("--i", n); b.style.setProperty("--r", ((n % 3) - 1) * 1.5 + "deg"); b.style.zIndex = n + 1;
        b.title = CARDS[idx].titel;
        b.setAttribute("aria-label", CARDS[idx].titel + (hasNote ? ", mit Notiz" : "") + " — öffnen");
        b.innerHTML = '<span class="mini__teil">' + esc(shortTeil(CARDS[idx].teil) || "") + '</span><span class="mini__title">' + esc(hy(CARDS[idx].titel)) + "</span>" + (hasNote ? '<span class="mini__note" aria-hidden="true"></span>' : "");
        b.addEventListener("click", function () { lastFocus = b; openReader(idx); });
        fan.appendChild(b);
      });
      sec.appendChild(fan); grid.appendChild(sec);
    });
    fitFans();
  }
  /* Überlappung so wählen, dass jeder Stapel in die Breite passt */
  function fitFans() {
    document.querySelectorAll(".pgrp__fan").forEach(function (f) {
      var n = f.children.length; if (!n) return;
      var w = f.clientWidth, cw = f.children[0].offsetWidth || 76, ov = n > 1 ? Math.min(8, (w - cw) / (n - 1) - cw) : 0;
      f.style.setProperty("--ov", Math.max(-cw + 3, ov) + "px");
    });
  }
  window.addEventListener("resize", function () { clearTimeout(fitFans.t); fitFans.t = setTimeout(fitFans, 120); });

  /* Hervorhebung: **Wort** in cards.js wird in Black gesetzt */
  function md(s) { return esc(hy(s)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }

  /* Listenpunkte:
     "3. Titel – Text"          → Zahlen-Kasten + Titel in Black
     "C – Wort – Erklärung"     → Buchstaben-Kasten (CRASH, COACH, SAG ES, LEAF)
     "„Buchtitel“ – Autor: …"   → Titel in Black, Autor, Beschreibung
     "Stichwort: Text"          → Stichwort in Black */
  function split2(rest) { var cut = rest.search(/ – |: /); return cut > 0 ? [rest.slice(0, cut), rest.slice(cut + (rest.charAt(cut) === ":" ? 2 : 3))] : [rest, ""]; }
  function badgeItem(label, col, head, tail) {
    return '<li class="is-num"><span class="num"' + (col ? ' style="--nc:' + col + '"' : "") + ">" + esc(label) + "</span><span><strong>" + md(head) + "</strong>" + (tail ? '<span class="num__text">' + md(tail) + "</span>" : "") + "</span></li>";
  }
  function listItem(c, x, i) {
    var F = window.GRAFIK_FARBE || function () { return null; }, m, p;
    if ((m = /^(\d+)\.\s+(.*)$/.exec(x))) { p = split2(m[2]); return badgeItem(m[1], F(c, parseInt(m[1], 10), i), p[0], p[1]); }
    if ((m = /^([A-Z])\s–\s(.*)$/.exec(x))) { p = split2(m[2]); return badgeItem(m[1], F(c, 0, i), p[0], p[1]); }
    if ((m = /^„([^“]+)“\s–\s([^:]+):\s(.*)$/.exec(x))) {
      var q = encodeURIComponent(m[1] + " " + m[2]).replace(/%20/g, "+");
      return '<li class="is-book"><strong>' + md(m[1]) + '</strong><span class="by">' + md(m[2]) + '</span><span class="desc">' + md(m[3]) + "</span>" +
        '<a class="shop" href="https://www.amazon.de/s?k=' + q + '&i=stripbooks" target="_blank" rel="noopener noreferrer">Bei Amazon ansehen <span aria-hidden="true">↗</span><span class="sr"> (öffnet in neuem Tab)</span></a></li>';
    }
    if ((m = /^([^„:]{2,70}):\s(.*)$/.exec(x))) return '<li><strong>' + md(m[1]) + "</strong> " + '<span class="li__rest">' + md(m[2]) + "</span></li>";
    return "<li>" + md(x) + "</li>";
  }

  /* Wortkarten: Gruppen mit antippbaren Wörtern */
  function pickedHTML(idx) {
    var l = state.picks[idx] || [];
    return l.length ? "<strong>Deine Auswahl:</strong> " + l.map(esc).join(" · ") : "Tipp die Wörter an, die gerade auf dich zutreffen.";
  }
  function renderScale(c, idx) {
    var v = (state.picks[idx] || [])[0], out = '<div class="scale" role="group" aria-label="Skala von 1 bis 10">';
    for (var i = 1; i <= 10; i++) out += '<button type="button" class="scale__n' + (String(i) === v ? " is-on" : "") + '" aria-pressed="' + (String(i) === v) + '" data-v="' + i + '" style="--sc:' + (i <= 3 ? "#f4005e" : i <= 6 ? "#F9851F" : i <= 8 ? "#59d5dc" : "#b5fd42") + '">' + i + "</button>";
    return out + '</div><div class="scale__legend"><span>läuft gar nicht</span><span>läuft super</span></div>';
  }
  function renderGroups(c, idx) {
    var l = state.picks[idx] || [];
    return '<p class="picked" aria-live="polite">' + pickedHTML(idx) + "</p>" + c.gruppen.map(function (g) {
      return '<section class="grp" style="--gc:' + g.farbe + '"><h3 class="grp__name">' + esc(hy(g.name)) + '</h3><div class="grp__chips">' +
        g.woerter.map(function (w) { var on = l.indexOf(w) >= 0; return '<button type="button" class="chip' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-w="' + esc(w) + '">' + esc(hy(w)) + "</button>"; }).join("") +
        "</div></section>";
    }).join("");
  }

  /* ---------- Aufdecken und Lesen ---------- */
  function flip(idx, el) {
    lastFocus = el;
    /* Karte zuerst ganz nach oben auf den Stapel holen, dann umdrehen */
    state.top++; if (state.pos[idx]) state.pos[idx].z = state.top;
    el.style.zIndex = 9000 + state.top;
    if (isUp(idx)) { save(); openReader(idx); return; }
    state.up.push(idx); save();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.classList.add("is-lift");
    setTimeout(function () { el.classList.add("is-up"); }, reduce ? 0 : 300);
    setTimeout(function () { render(); openReader(idx); }, reduce ? 0 : 950);
  }

  /* Karten einer Reihe (z. B. „Harvard-Methode“, „1 / 3 … 3 / 3“) gehören zusammen */
  function groupKey(i) {
    var c = CARDS[i], t = c.teil || "";
    if (t.indexOf(" · ") > 0) return c.kategorie + "|" + t.split(" · ")[0];
    if (c.kategorie === "fuehrung" || (c.kategorie === "uebung" && !/\d\s*\/\s*\d/.test(t))) return "solo|" + i;
    return c.kategorie;
  }
  function siblings(i) { var g = groupKey(i); return CARDS.map(function (_, j) { return j; }).filter(function (j) { return j !== i && groupKey(j) === g; }); }
  function shortTeil(t) { t = t || ""; return t.indexOf(" · ") > 0 ? t.split(" · ").slice(1).join(" · ") : t; }
  function seriesHTML(idx) {
    var sib = siblings(idx); if (!sib.length) return "";
    var all = CARDS.map(function (_, j) { return j; }).filter(function (j) { return groupKey(j) === groupKey(idx); });
    var open = sib.filter(function (j) { return state.done.indexOf(j) < 0 && !isUp(j); }).length;
    return '<section class="series" aria-label="Dazugehörige Karten"><h3 class="series__head">Gehört dazu<span>' +
      (open ? ' <b class="big__sep" aria-hidden="true">·</b> ' + open + (open === 1 ? " Karte" : " Karten") + " noch verdeckt" : ' <b class="big__sep" aria-hidden="true">·</b> alle aufgedeckt') + '</span></h3><div class="series__row">' +
      all.map(function (j) {
        var me = j === idx, done = state.done.indexOf(j) >= 0, up = isUp(j) || done || me;
        return '<div class="sib' + (me ? " is-me" : "") + '"><button type="button" class="card sib__card' + (up ? " is-up" : "") + '" data-j="' + j + '"' + (me ? ' disabled aria-current="true"' : "") +
          ' aria-label="' + esc(up ? CARDS[j].titel + (me ? " (diese Karte)" : " öffnen") : "Dazugehörige Karte aufdecken") + '"><span class="card__inner">' + backHTML() + frontHTML(j) + "</span></button>" +
          '<span class="sib__teil">' + esc(shortTeil(CARDS[j].teil) || String(all.indexOf(j) + 1)) + (done && !me ? " ✓" : "") + "</span></div>";
      }).join("") + "</div></section>";
  }
  function openSibling(j, btn) {
    var go = function () {
      if (state.done.indexOf(j) < 0 && !isUp(j)) state.up.push(j);
      state.top++; if (state.pos[j]) state.pos[j].z = state.top;
      save(); render(); openReader(j);
    };
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (btn && !btn.classList.contains("is-up") && !reduce) { btn.classList.add("is-up"); setTimeout(go, 650); } else go();
  }

  /* ---------- Animationen der Grafiken: Aufbau nacheinander, Linien zeichnen sich, aktive Teile leben ---------- */
  function animateGrafik(box, spec) {
    if (!box) return;
    var svgEl = box.querySelector("svg"); if (!svgEl) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var type = String(spec || "").split(":")[0], DARK = /^(none|#2d1e4a|#220736|#0c0814|#1a1029|#231639|rgba\(.*)$/i;
    var kids = [].slice.call(svgEl.children).filter(function (e) { return e.tagName !== "defs"; });
    var hasT = function (e) { return !!e.getAttribute("transform"); };
    kids.forEach(function (e, i) { e.classList.add(hasT(e) ? "ga-fade" : "ga-in"); e.style.animationDelay = (Math.min(i, 40) * 28) + "ms"; });
    /* Linien ohne Füllung zeichnen sich */
    svgEl.querySelectorAll("path, polyline, line").forEach(function (e, i) {
      var f = e.getAttribute("fill"); if (f && f !== "none") return; if (!e.getTotalLength) return;
      var L = 0; try { L = e.getTotalLength(); } catch (x) {} if (!L || L < 20) return;
      e.style.strokeDasharray = L; e.style.strokeDashoffset = L; e.classList.add("ga-draw"); e.style.animationDelay = (200 + i * 60) + "ms";
      if (e.classList.contains("ga-in")) e.classList.remove("ga-in");
    });
    /* aktive, farbige Elemente pulsieren sanft */
    var live = [];
    svgEl.querySelectorAll("rect, circle, ellipse, g").forEach(function (e) {
      var f = e.getAttribute("fill") || ""; if (e.tagName === "g") { if (/translate|rotate/.test(e.getAttribute("transform") || "")) live.push(e); return; }
      if (!f || DARK.test(f) || f === "url(#bkS)" || hasT(e)) return;
      var w = +e.getAttribute("width") || (+e.getAttribute("r") || 0) * 2; if (w >= 30) live.push(e);
    });
    var delay = kids.length * 28 + 600;
    if (type === "playlist") {
      var c0 = svgEl.querySelector("circle"), cx = c0 ? c0.getAttribute("cx") : 112, cy = c0 ? c0.getAttribute("cy") : 62;
      svgEl.querySelectorAll("path").forEach(function (e) { e.style.transformOrigin = cx + "px " + cy + "px"; e.classList.add("ga-spin"); });
      svgEl.querySelectorAll("rect").forEach(function (e, i) { e.classList.add("ga-eq"); e.style.animationDelay = delay + i * 130 + "ms"; e.style.animationDuration = (0.7 + (i % 3) * 0.18) + "s"; });
      return;
    }
    if (type === "thermo") { svgEl.querySelectorAll("rect:not([transform])").forEach(function (e, i) { e.classList.add("ga-grow"); e.style.animationDelay = (150 + i * 40) + "ms"; }); }
    live.slice(0, 4).forEach(function (e, i) { e.classList.add(e.tagName === "g" ? "ga-float" : "ga-pulse"); e.style.setProperty("--gd", delay + i * 300 + "ms"); });
  }

  function openReader(idx) {
    var c = CARDS[idx], k = cat(idx);
    var played = state.done.indexOf(idx) >= 0;
    var no = played ? state.done.indexOf(idx) + 1 : state.done.length + 1;
    var o = $("#reader");
    o.innerHTML =
      '<div class="reader" role="dialog" aria-modal="true" aria-labelledby="rtitle">' +
        '<article class="big" style="--acc:' + k.farbe + '">' +
          '<span class="big__no">' + (played ? "Abgelegt · " : "") + no + " / " + state.total + "</span>" +
          (c.prompt ? '<div class="prompt"><span class="prompt__q">' + esc(c.prompt) + '</span><span class="prompt__dots">' + (c.gruppen || []).map(function (g) { return '<i style="background:' + g.farbe + '"></i>'; }).join("") + "</span></div>" : c.grafik && window.GRAFIK ? '<div class="big__media big__media--grafik g-' + String(c.grafik).split(":")[0] + '">' + window.GRAFIK(c.grafik) + '</div>' : '<div class="big__media"><img src="' + esc(k.bild) + '" alt=""></div>') +
          '<span class="big__cat"><span class="big__cname">' + esc(k.name) + "</span>" + (c.teil ? ' <span class="big__sep" aria-hidden="true">·</span> <span class="big__teil">' + esc(c.teil).split(" · ").join('</span> <span class="big__sep" aria-hidden="true">·</span> <span class="big__teil">') + "</span>" : "") + "</span>" +
          '<h2 class="big__title" id="rtitle">' + esc(hy(c.titel)) + "</h2>" +
          (c.text ? '<p class="big__text">' + md(c.text) + "</p>" : "") +
          (c.liste && c.liste.length ? '<ul class="big__list">' + c.liste.map(function (x, i) { return listItem(c, x, i); }).join("") + "</ul>" : "") +
          (c.gruppen ? renderGroups(c, idx) : "") +
          (c.skala ? renderScale(c, idx) : "") +
          (c.text2 ? '<p class="big__text">' + md(c.text2) + "</p>" : "") +
          (c.link ? '<a class="big__link" href="' + esc(c.link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(c.link.text) + ' <span aria-hidden="true">↗</span><span class="sr"> (öffnet in neuem Tab)</span></a>' : "") +
          (c.impuls ? '<p class="big__hint">' + md(c.impuls) + "</p>" : "") +
        "</article>" +
        '<div class="notes">' +
          '<label class="notes__label" for="note">Deine Notizen</label>' +
          '<textarea id="note" placeholder="' + esc(greet("Was fällt dir dazu ein, {n}? Nur du siehst das.")) + '">' + esc(state.notes[idx] || "") + "</textarea>" +
          '<p class="notes__meta">Wird nur in diesem Browser gespeichert.</p>' +
          '<div class="row">' +
            (played
              ? '<button class="btn btn--primary" type="button" id="later">Fertig <span class="arr">→</span></button>'
              : '<button class="btn btn--primary" type="button" id="done">Karte ablegen <span class="arr">→</span></button>' +
                '<button class="btn btn--outline" type="button" id="later">Später weiter</button>') +
          "</div>" +
          seriesHTML(idx) +
        "</div>" +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
    animateGrafik(o.querySelector(".big__media--grafik"), c.grafik);
    o.querySelectorAll(".sib__card[data-j]").forEach(function (b) { if (!b.disabled) b.addEventListener("click", function () { openSibling(+b.dataset.j, b); }); });
    var ta = $("#note", o);
    ta.addEventListener("input", function () { state.notes[idx] = ta.value; save(); });
    o.querySelectorAll(".scale__n").forEach(function (b) {
      b.addEventListener("click", function () {
        var on = !b.classList.contains("is-on");
        o.querySelectorAll(".scale__n").forEach(function (x) { x.classList.remove("is-on"); x.setAttribute("aria-pressed", "false"); });
        if (on) { b.classList.add("is-on"); b.setAttribute("aria-pressed", "true"); state.picks[idx] = [b.dataset.v]; } else delete state.picks[idx];
        save();
      });
    });
    o.querySelectorAll(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        var w = b.dataset.w, list = state.picks[idx] || (state.picks[idx] = []), k = list.indexOf(w);
        if (k >= 0) list.splice(k, 1); else list.push(w);
        b.classList.toggle("is-on", k < 0); b.setAttribute("aria-pressed", k < 0 ? "true" : "false");
        var sel = o.querySelector(".picked"); if (sel) sel.innerHTML = pickedHTML(idx);
        save();
      });
    });
    if (!played) $("#done", o).addEventListener("click", function () { finishCard(idx); });
    $("#later", o).addEventListener("click", closeOverlays);
    setTimeout(function () { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }, 50);
  }

  /* Aufgedeckte Karte direkt vom Tisch ablegen, ohne sie zu öffnen */
  function dropCard(idx, el) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el && !reduce) { el.classList.add("is-dropping"); setTimeout(function () { finishCard(idx); }, 380); } else finishCard(idx);
  }
  function finishCard(idx) {
    state.up = state.up.filter(function (i) { return i !== idx; });
    state.done.push(idx);
    save();
    justDone = idx;
    closeOverlays(true);
    render();
    justDone = null;
    var pg = $("#played"); if (pg) pg.scrollTop = 0;
    var next = document.querySelector(".card.is-playable");
    if (next) next.focus({ preventScroll: true }); else if ($("#finish h2")) { $("#finish h2").focus({ preventScroll: true }); $("#finish").scrollIntoView({ block: "center", behavior: "smooth" }); }
  }

  /* ---------- Notizen ansehen und herunterladen ---------- */
  /* Karten nach Kategorie gruppieren (Reihenfolge wie in KATEGORIEN, innerhalb nach Reihe) */
  function byCategory(ids) {
    var g = {}; ids.forEach(function (i) { (g[CARDS[i].kategorie] = g[CARDS[i].kategorie] || []).push(i); });
    return Object.keys(CATS).concat(Object.keys(g).filter(function (k) { return !CATS[k]; })).filter(function (k) { return g[k]; })
      .map(function (k) { return { key: k, ids: g[k].sort(function (x, y) { return x - y; }) }; });
  }
  function notesText(ids) {
    ids = ids || state.done.concat(state.up);
    var lines = ["Aufgedeckt — meine Notizen", new Date().toLocaleDateString("de-DE"), ""];
    byCategory(ids).forEach(function (grp) {
      var name = (CATS[grp.key] || cat(grp.ids[0])).name;
      lines.push("════ " + name.toUpperCase() + " (" + grp.ids.length + ") ════", "");
      grp.ids.forEach(function (i) {
        var n = (state.notes[i] || "").trim(), c = CARDS[i];
        lines.push("■ " + c.titel + (c.teil ? "  [" + c.teil + "]" : ""));
        if (c.text) lines.push(c.text.replace(/\*\*/g, ""));
        if (c.text2) lines.push(c.text2.replace(/\*\*/g, ""));
        (c.liste || []).forEach(function (x) { lines.push("  • " + x.replace(/\*\*/g, "")); });
        if (state.picks[i] && state.picks[i].length) lines.push("Ausgewählt: " + state.picks[i].join(", "));
        lines.push(n ? "Notiz: " + n : "(keine Notiz)");
        lines.push("");
      });
    });
    lines.push("", "", MARK_A, "Mit dieser Datei kannst du dein Spiel auf jedem Gerät fortsetzen: Aufgedeckt öffnen und die Datei hochladen.", "Bitte die Zeile darunter nicht verändern.", packState(), MARK_B);
    return lines.join("\n");
  }

  /* ---------- Spielstand in der Datei: einlesen und wieder herstellen ---------- */
  var MARK_A = "───── SPIELSTAND (nicht verändern) ─────", MARK_B = "───── ENDE SPIELSTAND ─────";
  function packState() { try { return "AUFGEDECKT1:" + btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { return ""; } }
  function unpackState(text) {
    var m = /AUFGEDECKT1:([A-Za-z0-9+\/=]+)/.exec(text || ""), s = null;
    try { s = m ? JSON.parse(decodeURIComponent(escape(atob(m[1])))) : JSON.parse(text); } catch (e) { return null; }
    if (!s || typeof s !== "object" || !s.pos || !Array.isArray(s.done)) return null;
    if (s.total !== CARDS.length) { /* Kartenanzahl geändert: Notizen behalten, neu verteilen */
      var keep = { notes: s.notes || {}, picks: s.picks || {}, name: s.name || "" }; state = state || {}; state.picks = keep.picks; state.name = keep.name;
      var n = deal(keep.notes); n.picks = keep.picks; n.name = keep.name; n.done = (s.done || []).filter(function (i) { return i < CARDS.length; }); return n;
    }
    s.notes = s.notes || {}; s.picks = s.picks || {}; s.up = s.up || []; s.layout = s.layout || "stapel"; s.name = s.name || "";
    return s;
  }
  function nm() { return (state && state.name || "").trim(); }
  function greet(t) { return nm() ? t.replace("{n}", nm()) : t.replace(/,?\s*\{n\}/, ""); }
  function toast(msg) {
    var t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.remove("is-on"); void t.offsetWidth; t.classList.add("is-on");
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("is-on"); }, 3600);
  }
  function applyName() {
    var g = $("#hello"); if (g) {
      g.innerHTML = nm() ? esc(nm().charAt(0).toUpperCase()) : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="3.6"/><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4"/></svg>';
      g.classList.toggle("is-named", !!nm());
      g.title = nm() ? "Hallo, " + nm() + " – Name ändern oder Spielstand laden" : "Name eingeben oder Spielstand laden";
      g.setAttribute("aria-label", g.title); }
    var f = $("#finish h2"); if (f) f.textContent = greet("Gut gemacht, {n}");
  }
  function openWelcome(first) {
    lastFocus = document.activeElement;
    var o = $("#reader");
    o.innerHTML =
      '<div class="confirm welcome" role="dialog" aria-modal="true" aria-labelledby="wtitle">' +
        '<span class="logo welcome__logo">' + LOGO_SVG + "</span>" +
        '<span class="eyebrow">' + (first ? "Willkommen" : "Dein Profil") + '</span>' +
        '<h2 id="wtitle" tabindex="-1"><span class="prism">Aufgedeckt</span></h2>' +
        "<p>Wie dürfen wir dich nennen? Dein Name bleibt nur in diesem Browser und steht in deiner Notizen-Datei.</p>" +
        '<label class="wfield"><span>Dein Vorname</span><input id="wname" type="text" autocomplete="given-name" maxlength="40" placeholder="z. B. Kim" value="' + esc(nm()) + '"></label>' +
        '<button class="btn btn--primary" type="button" id="wgo">' + (first ? "Los geht’s" : "Speichern") + ' <span class="arr">→</span></button>' +
        '<div class="wor"><span>oder</span></div>' +
        '<label class="wupload"><input id="wfile" type="file" accept=".txt,.json,text/plain,application/json">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-4 4m4-4 4 4"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>' +
          "<span><strong>Spielstand laden</strong><small>Die heruntergeladene Notizen-Datei auswählen. Name, Karten und Notizen kommen zurück.</small></span></label>" +
        '<p class="msg" id="wmsg" aria-live="polite"></p>' +
        (first ? '<button class="wskip" type="button" id="wskip">Ohne Namen weiter</button>' : '<button class="wskip" type="button" id="wskip">Abbrechen</button>') +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
    var inp = $("#wname", o);
    function go() {
      state.name = inp.value.trim(); state.welcomed = true; save(); applyName(); closeOverlays(true);
      if (state.name) toast(first ? "Schön, dass du da bist, " + state.name + "." : "Hallo, " + state.name + ".");
    }
    $("#wgo", o).addEventListener("click", go);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    $("#wskip", o).addEventListener("click", function () { if (first) { state.welcomed = true; save(); } closeOverlays(true); });
    $("#wfile", o).addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var s = unpackState(String(r.result));
        if (!s) { $("#wmsg", o).textContent = "In dieser Datei steckt kein Spielstand. Nimm die Datei, die du über „Notizen herunterladen“ gespeichert hast."; return; }
        s.welcomed = true; state = s; save(); closeOverlays(true); render(); renderLayouts(); layoutProps(); applyName();
        var nc = state.done.length, nn = Object.keys(state.notes).filter(function (k) { return (state.notes[k] || "").trim(); }).length;
        toast(greet("Willkommen zurück, {n}.") + " " + nc + (nc === 1 ? " Karte" : " Karten") + " und " + nn + (nn === 1 ? " Notiz" : " Notizen") + " geladen.");
      };
      r.readAsText(f);
    });
    setTimeout(function () { inp.focus(); }, 60);
  }

  function download(msgEl, ids) {
    var text = notesText(ids);
    var name = "aufgedeckt-" + (nm() ? nm().toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-") + "-" : "") + "notizen.txt";
    var done = function (ok) { if (msgEl) msgEl.textContent = ok ? "Datei gespeichert." : "Speichern wurde abgebrochen."; };
    var fallback = function () {
      try {
        var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        done(true);
      } catch (e) { done(false); }
    };
    if (window.__ptDownloads) {
      window.__ptDownloads.save({ filename: name, data: text }).then(function () { done(true); }, function () { done(false); });
    } else fallback();
  }

  /* Notizen: nach Thema gruppiert, filterbar nach Thema und Notiz, mit Suche */
  var nf = { cat: "", mode: "alle", q: "" };
  function hasNote(i) { return (state.notes[i] || "").trim().length > 0; }
  function openNotes() {
    lastFocus = document.activeElement;
    var all = state.done.concat(state.up);
    var o = $("#reader");
    if (nf.cat && !all.some(function (i) { return CARDS[i].kategorie === nf.cat; })) nf.cat = "";
    var cats = byCategory(all);
    o.innerHTML =
      '<div class="drawer drawer--notes" role="dialog" aria-modal="true" aria-labelledby="ntitle">' +
        '<div class="drawer__top"><div><span class="eyebrow">' + esc(nm() ? nm() + "s Karten" : "Gezogene Karten") + '</span><h2 id="ntitle" tabindex="-1">Deine Notizen</h2></div>' +
        '<button class="ibtn ibtn--icon drawer__x" type="button" id="close" aria-label="Schließen" title="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
        (all.length ?
        '<div class="nfilter">' +
          '<label class="nsearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" id="nq" placeholder="In Titeln und Notizen suchen" value="' + esc(nf.q) + '" aria-label="Suchen"></label>' +
          '<div class="nseg" role="group" aria-label="Notizen filtern">' + [["alle", "Alle"], ["mit", "Mit Notiz"], ["ohne", "Ohne Notiz"]].map(function (m) {
            var n = all.filter(function (i) { return m[0] === "alle" || (m[0] === "mit") === hasNote(i); }).length;
            return '<button type="button" class="nseg__b' + (nf.mode === m[0] ? " is-on" : "") + '" data-m="' + m[0] + '" aria-pressed="' + (nf.mode === m[0]) + '">' + m[1] + " <span>" + n + "</span></button>"; }).join("") + "</div>" +
          '<div class="ncats" role="group" aria-label="Nach Thema filtern"><button type="button" class="ncat' + (!nf.cat ? " is-on" : "") + '" data-c="" aria-pressed="' + !nf.cat + '">Alle Themen</button>' +
            cats.map(function (g) { var k = CATS[g.key] || cat(g.ids[0]), on = nf.cat === g.key;
              return '<button type="button" class="ncat' + (on ? " is-on" : "") + '" data-c="' + g.key + '" aria-pressed="' + on + '" style="--acc:' + k.farbe + '"><img src="' + esc(k.bild) + '" alt="">' + esc(k.name) + " <span>" + g.ids.length + "</span></button>"; }).join("") +
          "</div>" +
        "</div>" +
        '<div class="nlist" id="nlist"></div>'
        : '<p class="empty">Du hast noch keine Karte aufgedeckt. Tipp eine leuchtende Karte an, um zu starten.</p>') +
        '<p class="msg" id="msg" aria-live="polite"></p>' +
        '<button class="wskip" type="button" id="profile">' + (nm() ? "Name ändern oder anderen Spielstand laden" : "Name eingeben oder Spielstand laden") + "</button>" +
        '<div class="row"><button class="btn btn--secondary" type="button" id="dl"' + (all.length ? "" : " disabled") + '>Notizen herunterladen</button>' +
        '<button class="btn btn--outline" type="button" id="close2">Schließen</button></div>' +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
    var shown = [];
    function list() {
      var q = nf.q.trim().toLowerCase();
      shown = all.filter(function (i) {
        if (nf.cat && CARDS[i].kategorie !== nf.cat) return false;
        if (nf.mode === "mit" && !hasNote(i)) return false;
        if (nf.mode === "ohne" && hasNote(i)) return false;
        if (q && (CARDS[i].titel + " " + (CARDS[i].teil || "") + " " + (state.notes[i] || "") + " " + ((state.picks[i] || []).join(" "))).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      var el = $("#nlist", o); if (!el) return;
      el.innerHTML = shown.length ? byCategory(shown).map(function (g) {
        var k = CATS[g.key] || cat(g.ids[0]);
        return '<section class="ngrp" style="--acc:' + k.farbe + '"><h3 class="ngrp__head"><img src="' + esc(k.bild) + '" alt="">' + esc(hy(k.name)) + "<span>" + g.ids.length + "</span></h3><ul>" +
          g.ids.map(function (i) {
            var n = (state.notes[i] || "").trim(), pk = state.picks[i] || [];
            return '<li><button type="button" class="nitem' + (n ? "" : " is-empty") + '" data-idx="' + i + '">' +
              '<span class="nitem__meta">' + esc(shortTeil(CARDS[i].teil) || "") + (state.done.indexOf(i) < 0 ? ' <em>noch offen</em>' : "") + "</span>" +
              '<span class="nitem__t">' + esc(hy(CARDS[i].titel)) + "</span>" +
              (pk.length ? '<span class="nitem__picks">' + pk.map(function (w) { return "<i>" + esc(w) + "</i>"; }).join("") + "</span>" : "") +
              '<span class="nitem__n">' + (n ? esc(n) : "Noch keine Notiz – tippen, um etwas zu schreiben") + "</span>" +
              '<span class="nitem__go">Öffnen <span class="arr">→</span></span></button></li>';
          }).join("") + "</ul></section>";
      }).join("") : '<p class="empty">Keine Karten passen zu diesem Filter.</p>';
      el.querySelectorAll(".nitem").forEach(function (b) { b.addEventListener("click", function () { openReader(+b.dataset.idx); }); });
      var filtered = nf.cat || nf.mode !== "alle" || q;
      $("#dl", o).textContent = filtered ? "Auswahl herunterladen (" + shown.length + ")" : "Notizen herunterladen";
      $("#dl", o).disabled = !shown.length;
    }
    if (all.length) {
      list();
      $("#nq", o).addEventListener("input", function (e) { nf.q = e.target.value; list(); });
      o.querySelectorAll(".nseg__b").forEach(function (b) { b.addEventListener("click", function () {
        nf.mode = b.dataset.m; o.querySelectorAll(".nseg__b").forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); }); list(); }); });
      o.querySelectorAll(".ncat").forEach(function (b) { b.addEventListener("click", function () {
        nf.cat = b.dataset.c; o.querySelectorAll(".ncat").forEach(function (x) { var on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); }); list(); }); });
    }
    $("#dl", o).addEventListener("click", function () { download($("#msg", o), all.length ? shown : []); });
    $("#close", o).addEventListener("click", function () { closeOverlays(); });
    $("#close2", o).addEventListener("click", function () { closeOverlays(); });
    $("#profile", o).addEventListener("click", function () { openWelcome(false); });
    $("#ntitle", o).focus();
  }

  function askRestart() {
    lastFocus = document.activeElement;
    var o = $("#reader");
    o.innerHTML =
      '<div class="confirm" role="dialog" aria-modal="true" aria-labelledby="ctitle">' +
        '<h2 id="ctitle" tabindex="-1">Neu mischen?</h2>' +
        "<p>Alle Karten kommen zurück auf den Tisch. Deine Notizen bleiben gespeichert.</p>" +
        '<div class="row"><button class="btn btn--primary" type="button" id="yes">Neu mischen <span class="arr">→</span></button>' +
        '<button class="btn btn--outline" type="button" id="no">Abbrechen</button></div>' +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
    $("#yes", o).addEventListener("click", function () { state = deal(state.notes); save(); closeOverlays(true); render(); layoutProps(); });
    $("#no", o).addEventListener("click", function () { closeOverlays(); });
    $("#ctitle", o).focus();
  }

  function closeOverlays(skipFocus) {
    var o = $("#reader"); o.hidden = true; o.innerHTML = "";
    if (skipFocus !== true && lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    render();
  }

  /* ---------- Start ---------- */
  function start() {
    document.querySelectorAll("[data-logo]").forEach(function (el) { el.innerHTML = LOGO_SVG; });
    $("#stage").insertAdjacentHTML("afterbegin", '<div class="props" aria-hidden="true"></div>');
    state = load() || deal();
    state.layout = state.layout || "stapel"; if (["stapel", "verstreut", "raster"].indexOf(state.layout) < 0 && !SHAPES[state.layout]) state.layout = "stapel";
    save();
    render(); renderLayouts(); layoutProps(); applyName();
    $("#hello").addEventListener("click", function () { openWelcome(false); });
    /* Handy: „Mischen“ wandert in die zweite Zeile, damit oben Platz für den Namen bleibt */
    var mq = window.matchMedia("(max-width: 640px)"), placeMix = function () {
      var r = $("#restartBtn"); if (mq.matches) $(".laypick").appendChild(r); else $(".icons").appendChild(r); };
    placeMix(); if (mq.addEventListener) mq.addEventListener("change", placeMix); else mq.addListener(placeMix);
    if (!state.welcomed) openWelcome(true); else if (nm()) setTimeout(function () { toast("Schön, dass du wieder da bist, " + nm() + "."); }, 500);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(placeProps, 150); });
    $("#layouts").addEventListener("click", function (e) { var b = e.target.closest(".lay"); if (!b) return; if (b.dataset.l === "zufall") { $("#layRandom").click(); return; } setLayout(b.dataset.l); layPop(false); });
    $("#layBtn").addEventListener("click", function (e) { e.stopPropagation(); layPop($("#laypop").hidden); });
    $("#layRandom").addEventListener("click", function () { var opts = LAYOUTS.filter(function (l) { return l[0] !== state.layout; }); setLayout(opts[Math.floor(Math.random() * opts.length)][0]); layPop(false);
      var d = $("#layRandom"); d.classList.remove("is-roll"); void d.offsetWidth; d.classList.add("is-roll"); });
    document.addEventListener("click", function (e) { if (!$("#laypop").hidden && !e.target.closest("#laypop")) layPop(false); });
    $("#notesBtn").addEventListener("click", openNotes);
    $("#restartBtn").addEventListener("click", askRestart);
    $("#randomBtn").addEventListener("click", drawRandom);
    $("#finishNotes").addEventListener("click", openNotes);
    $("#finishRestart").addEventListener("click", function () { state = deal(state.notes); save(); render(); });
    $("#reader").addEventListener("click", function (e) { if (e.target.id === "reader") closeOverlays(); });
    document.addEventListener("keydown", function (e) { if (e.key !== "Escape") return; if (!$("#laypop").hidden) { layPop(false); $("#layBtn").focus(); } else if (!$("#reader").hidden) closeOverlays(); });
    // In einer Claude-Vorschau: Downloads über die Plattform anbieten (auf GitHub Pages gibt es das nicht, dann normaler Download).
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("downloads").then(function (d) { if (d) window.__ptDownloads = d; }, function () {});
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
