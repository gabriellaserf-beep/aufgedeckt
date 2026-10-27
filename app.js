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
  var SHAPES = {
    blume: function () { var p = []; for (var i = 0; i < 5; i++) { var w = i / 5 * 2 * Math.PI - Math.PI / 2; p.push(ell(Math.cos(w) * 0.64, Math.sin(w) * 0.64, 0.38, 0.2, w)); }
      p.push(ell(0, 0, 0.16, 0.16)); p.push([[0, 1.0], [0.04, 1.3], [0, 1.6]]); p.push(ell(0.28, 1.3, 0.26, 0.1, -0.55)); return p; },
    herz: function () { var a = []; for (var i = 0; i <= 80; i++) { var t = i / 80 * 2 * Math.PI, s = Math.sin(t);
      a.push([16 * s * s * s, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); } return [a]; },
    stern: function () { var a = []; for (var i = 0; i < 10; i++) { var r = i % 2 ? 0.42 : 1, w = i / 10 * 2 * Math.PI - Math.PI / 2; a.push([Math.cos(w) * r, Math.sin(w) * r]); } return [closed(a)]; },
    ente: function () { return [
      [[-0.95, -0.15], [-0.7, 0.05], [-0.3, 0.12], [0.2, 0.1], [0.55, -0.05], [0.7, 0.2], [0.55, 0.55], [0, 0.72], [-0.55, 0.62], [-0.85, 0.35], [-0.95, -0.15]],
      ell(0.62, -0.42, 0.27, 0.27), closed([[0.86, -0.46], [1.2, -0.38], [0.86, -0.28]]), [[-0.4, 0.3], [-0.05, 0.42], [0.3, 0.3]],
      [[-1.1, 0.95], [-0.7, 0.85], [-0.3, 0.95], [0.1, 0.85], [0.5, 0.95], [0.9, 0.85]] ]; },
    auto: function () { return [
      closed([[-1, 0.3], [-1, 0], [-0.62, -0.06], [-0.36, -0.42], [0.32, -0.42], [0.6, -0.06], [1, 0.02], [1, 0.3]]),
      [[-0.06, -0.42], [-0.06, -0.06]], ell(-0.55, 0.32, 0.2, 0.2), ell(0.56, 0.32, 0.2, 0.2) ]; },
    fisch: function () { return [ ell(-0.1, 0, 0.7, 0.4), closed([[0.55, 0], [1.05, -0.38], [1.05, 0.38]]), ell(-0.5, -0.08, 0.06, 0.06, 0, 12) ]; },
    haus: function () { return [ closed([[-0.6, 0], [0.6, 0], [0.6, 0.95], [-0.6, 0.95]]), [[-0.78, 0.06], [0, -0.7], [0.78, 0.06]], [[-0.15, 0.95], [-0.15, 0.5], [0.15, 0.5], [0.15, 0.95]] ]; },
    smiley: function () { return [ ell(0, 0, 1, 1), ell(-0.36, -0.3, 0.1, 0.14, 0, 12), ell(0.36, -0.3, 0.1, 0.14, 0, 12), ell(0, 0.08, 0.58, 0.48, 0, 48).slice(4, 21) ]; },
    kreuz: function () { return [[[-0.12, -1], [-0.12, 1]], [[0.12, 1], [0.12, -1]], [[-1, -0.12], [1, -0.12]], [[1, 0.12], [-1, 0.12]]]; },
    spirale: function () { var a = []; for (var i = 0; i <= 160; i++) { var t = i / 160 * 3.2 * 2 * Math.PI, r = 0.06 + t * 0.047; a.push([Math.cos(t) * r, Math.sin(t) * r]); } return [a]; },
    welle: function () { var a = [], b = []; for (var i = 0; i <= 60; i++) { var x = i / 60 * 4 - 2; a.push([x, Math.sin(x * 2.4) * 0.38 - 0.35]); b.push([x, Math.sin(x * 2.4 + 1.6) * 0.38 + 0.35]); } return [a, b]; }
  };
  var LAYOUTS = [["stapel", "Unordentlich"], ["verstreut", "Verstreut"], ["blume", "Blume"], ["herz", "Herz"], ["stern", "Stern"], ["ente", "Ente"], ["auto", "Auto"], ["fisch", "Fisch"], ["haus", "Haus"], ["smiley", "Smiley"], ["kreuz", "Kreuz"], ["spirale", "Spirale"], ["welle", "Welle"]];

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
    var pad = Math.min(D.W, D.H) * 0.03, aw = D.W - D.cw - 2 * pad, ah = D.H - D.ch - 2 * pad, sc = Math.min(aw / (x1 - x0), ah / (y1 - y0));
    var ox = pad + D.cw / 2 + (aw - (x1 - x0) * sc) / 2 - x0 * sc, oy = pad + D.ch / 2 + (ah - (y1 - y0) * sc) / 2 - y0 * sc;
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
    layout = layout || (state && state.layout) || "stapel";
    var order = shuffle(CARDS.map(function (_, i) { return i; })), n = order.length;
    return { total: CARDS.length, layout: layout, pos: arrange(layout, order), top: n + 1, up: [], done: [], notes: notes || {}, picks: (state && state.picks) || {} };
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
  var PROP_DEFS = (function () {
    var kb = '<svg viewBox="0 0 460 170"><defs><linearGradient id="pkb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d2a63"/><stop offset="1" stop-color="#25173d"/></linearGradient><linearGradient id="pkk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55408a"/><stop offset="1" stop-color="#3a2862"/></linearGradient></defs>' +
      '<rect x="2" y="2" width="456" height="166" rx="18" fill="url(#pkb)" stroke="rgba(89,213,220,0.45)" stroke-width="2"/>';
    var rows = [[14, 0], [14, 10], [13, 16], [12, 24]], y = 16;
    rows.forEach(function (r, ri) { var n = r[0], x0 = 16 + r[1], kw = (428 - r[1] - (n - 1) * 5) / n;
      for (var i = 0; i < n; i++) { var x = x0 + i * (kw + 5), col = (ri === 0 && i === 0) ? "#ff00fe" : (ri === 2 && i === n - 1) ? "#b5fd42" : "url(#pkk)";
        kb += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + kw.toFixed(1) + '" height="28" rx="5" fill="' + col + '"' + (col.charAt(0) === "#" ? ' fill-opacity="0.85"' : "") + '/><rect x="' + (x + 3).toFixed(1) + '" y="' + (y + 2) + '" width="' + (kw - 6).toFixed(1) + '" height="3" rx="1.5" fill="#ffffff" fill-opacity="0.12"/>'; }
      y += 33; });
    kb += '<rect x="120" y="' + y + '" width="220" height="26" rx="5" fill="url(#pkk)"/><rect x="124" y="' + (y + 2) + '" width="212" height="3" rx="1.5" fill="#ffffff" fill-opacity="0.12"/></svg>';
    return {
      keyboard: { w: 400, ar: 170 / 460, rot: [80, 100], svg: kb },
      mouse: { w: 66, ar: 1.75, rot: [-25, 25], svg: '<svg viewBox="0 0 80 140"><defs><radialGradient id="pms" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stop-color="#6a52a6"/><stop offset="1" stop-color="#2a1a44"/></radialGradient></defs><path d="M40 4 C 64 4, 76 24, 76 60 L 76 92 C 76 120, 62 136, 40 136 C 18 136, 4 120, 4 92 L 4 60 C 4 24, 16 4, 40 4 Z" fill="url(#pms)" stroke="rgba(89,213,220,0.5)" stroke-width="2"/><path d="M40 6 V 52 M5 52 H 75" stroke="rgba(246,244,251,0.18)" stroke-width="1.5"/><rect x="35" y="16" width="10" height="22" rx="5" fill="#59d5dc"/><ellipse cx="26" cy="34" rx="8" ry="16" fill="#ffffff" fill-opacity="0.08"/></svg>' },
      coffee: { w: 150, ar: 1, rot: [-40, 40], svg: '<svg viewBox="0 0 200 200"><defs><radialGradient id="pcm" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#e4d4fb"/><stop offset="1" stop-color="#9a78d6"/></radialGradient><radialGradient id="pcc" cx="0.45" cy="0.45" r="0.6"><stop offset="0" stop-color="#9a6238"/><stop offset="0.75" stop-color="#5a3219"/><stop offset="1" stop-color="#2e170a"/></radialGradient></defs>' +
        '<circle cx="96" cy="100" r="92" fill="#3b2760" stroke="rgba(246,244,251,0.2)" stroke-width="2"/><circle cx="96" cy="100" r="70" fill="none" stroke="rgba(246,244,251,0.12)" stroke-width="2"/>' +
        '<path d="M150 88 C 186 84, 186 116, 150 112" fill="none" stroke="#a987e0" stroke-width="14" stroke-linecap="round"/>' +
        '<circle cx="96" cy="100" r="60" fill="url(#pcm)"/><circle cx="96" cy="100" r="51" fill="#2a160c"/><circle cx="96" cy="100" r="48" fill="url(#pcc)"/><circle cx="96" cy="100" r="44" fill="none" stroke="#c89060" stroke-opacity="0.55" stroke-width="3"/>' +
        '<path d="M96 122 C 70 104, 74 82, 88 84 C 94 85, 96 90, 96 93 C 96 90, 98 85, 104 84 C 118 82, 122 104, 96 122 Z" fill="#f3dcc0" fill-opacity="0.92"/>' +
        '<path d="M52 78 A 52 52 0 0 1 80 50" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/>' +
        '<g transform="rotate(-38 40 160)"><ellipse cx="40" cy="160" rx="9" ry="14" fill="#59d5dc"/><rect x="36" y="172" width="8" height="40" rx="4" fill="#59d5dc"/></g></svg>' },
      pen: { w: 190, ar: 0.14, rot: [-70, 70], svg: '<svg viewBox="0 0 240 34"><defs><linearGradient id="ppn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a357a"/><stop offset="1" stop-color="#22143a"/></linearGradient></defs><rect x="4" y="7" width="182" height="20" rx="10" fill="url(#ppn)" stroke="rgba(89,213,220,0.5)" stroke-width="1.5"/><rect x="10" y="9" width="170" height="4" rx="2" fill="#ffffff" fill-opacity="0.14"/><path d="M186 8 L 226 17 L 186 26 Z" fill="#b5fd42"/><path d="M220 15.5 L 236 17 L 220 18.5 Z" fill="#f6f4fb"/><rect x="26" y="2" width="70" height="8" rx="4" fill="#59d5dc"/></svg>' },
      notebook: { w: 250, ar: 0.72, rot: [-30, 30], svg: (function () { var s = '<svg viewBox="0 0 300 216"><rect x="4" y="8" width="292" height="204" rx="10" fill="#3b2760"/><rect x="10" y="4" width="136" height="200" rx="6" fill="#ece6f7"/><rect x="154" y="4" width="136" height="200" rx="6" fill="#f6f4fb"/>';
        for (var i = 0; i < 10; i++) { var yy = 30 + i * 17; s += '<line x1="22" y1="' + yy + '" x2="136" y2="' + yy + '" stroke="#59d5dc" stroke-opacity="0.35" stroke-width="1.2"/><line x1="166" y1="' + yy + '" x2="280" y2="' + yy + '" stroke="#59d5dc" stroke-opacity="0.35" stroke-width="1.2"/>'; }
        s += '<path d="M26 44 c10 -8 20 6 30 -2 s 18 6 28 -2 s 14 4 22 0" fill="none" stroke="#6b4fb0" stroke-width="2.2" stroke-linecap="round"/><path d="M26 61 c12 -6 22 4 34 -2 s 16 4 26 -1" fill="none" stroke="#6b4fb0" stroke-width="2.2" stroke-linecap="round"/><path d="M26 95 c10 -6 18 4 26 -1" fill="none" stroke="#ff00fe" stroke-width="2.2" stroke-linecap="round"/><rect x="172" y="40" width="60" height="44" rx="4" fill="#b5fd42" fill-opacity="0.8" transform="rotate(-6 200 60)"/>';
        for (var j = 0; j < 9; j++) s += '<rect x="141" y="' + (16 + j * 21) + '" width="18" height="9" rx="4.5" fill="none" stroke="#9a8cb8" stroke-width="3"/>';
        return s + '</svg>'; })() },
      phone: { w: 84, ar: 2, rot: [-35, 35], svg: '<svg viewBox="0 0 110 220"><defs><linearGradient id="pph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a1f66"/><stop offset="0.6" stop-color="#7a1f8f"/><stop offset="1" stop-color="#ff00fe"/></linearGradient></defs><rect x="3" y="3" width="104" height="214" rx="18" fill="#120a1e" stroke="rgba(89,213,220,0.5)" stroke-width="2"/><rect x="9" y="9" width="92" height="202" rx="13" fill="url(#pph)"/><rect x="40" y="15" width="30" height="8" rx="4" fill="#120a1e"/><circle cx="55" cy="96" r="20" fill="none" stroke="#59d5dc" stroke-width="3"/><path d="M47 96 l6 6 l11 -12" fill="none" stroke="#b5fd42" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="25" y="138" width="60" height="6" rx="3" fill="#f6f4fb" fill-opacity="0.55"/><rect x="33" y="152" width="44" height="5" rx="2.5" fill="#f6f4fb" fill-opacity="0.3"/></svg>' },
      plant: { w: 150, ar: 1, rot: [0, 360], svg: (function () { var s = '<svg viewBox="0 0 200 200"><defs><linearGradient id="plf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fb7a0"/><stop offset="1" stop-color="#b5fd42"/></linearGradient></defs><circle cx="100" cy="100" r="62" fill="#3b2760" stroke="rgba(246,244,251,0.2)" stroke-width="2"/><circle cx="100" cy="100" r="52" fill="#24150f"/>';
        for (var i = 0; i < 9; i++) { var a = i * 40 + (i % 2) * 12, l = 62 + (i % 3) * 12; s += '<g transform="rotate(' + a + ' 100 100)"><ellipse cx="' + (100 + l / 2) + '" cy="100" rx="' + (l / 2) + '" ry="15" fill="url(#plf)" stroke="#1f6b5c" stroke-opacity="0.6" stroke-width="1.5"/><line x1="102" y1="100" x2="' + (100 + l - 6) + '" y2="100" stroke="#1f6b5c" stroke-opacity="0.5" stroke-width="1.5"/></g>'; }
        for (var k = 0; k < 6; k++) { var b = k * 60 + 30; s += '<g transform="rotate(' + b + ' 100 100)"><ellipse cx="118" cy="100" rx="18" ry="8" fill="#b5fd42"/></g>'; }
        return s + '</svg>'; })() },
      notes: { w: 104, ar: 1, rot: [-25, 25], svg: '<svg viewBox="0 0 120 120"><rect x="14" y="10" width="96" height="96" rx="4" fill="#59d5dc" transform="rotate(8 62 58)"/><rect x="8" y="12" width="96" height="96" rx="4" fill="#b5fd42"/><rect x="8" y="12" width="96" height="14" fill="#000" fill-opacity="0.06"/><path d="M20 46 h60 M20 62 h70 M20 78 h44" stroke="#2a1a44" stroke-opacity="0.55" stroke-width="3.5" stroke-linecap="round"/></svg>' }
    };
  })();
  var propLay = null;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function layoutProps() {
    var A = shuffle(["keyboard", "mouse", "pen"]), B = shuffle(["coffee", "notebook", "plant", "phone", "notes"]), flip = Math.random() < 0.5;
    propLay = [];
    [[A, flip ? 1 : 0], [B, flip ? 0 : 1]].forEach(function (g) {
      g[0].forEach(function (k, j) { var d = PROP_DEFS[k]; propLay.push({ k: k, side: g[1], slot: j, n: g[0].length, out: rnd(0.8, 1.08), rot: rnd(d.rot[0], d.rot[1]), gap: Math.random() }); });
    });
    placeProps();
  }
  function placeProps() {
    var z = $("#stage"), box = z && z.querySelector(".props"), dz = $("#deskZone"); if (!box || !propLay || !dz) return;
    var W = z.clientWidth, H = dz.clientHeight, s = Math.max(0.65, Math.min(1.1, W / 1000)), html = "";
    [0, 1].forEach(function (side) {
      var items = propLay.filter(function (p) { return p.side === side; }).sort(function (a, b) { return a.slot - b.slot; });
      var dims = items.map(function (p) { var d = PROP_DEFS[p.k], w = d.w * s, h = w * d.ar, r = p.rot * Math.PI / 180;
        return { p: p, w: w, h: h, vw: Math.abs(w * Math.cos(r)) + Math.abs(h * Math.sin(r)), vh: Math.abs(w * Math.sin(r)) + Math.abs(h * Math.cos(r)) }; });
      var sum = dims.reduce(function (t, d) { return t + d.vh; }, 0), free = Math.max(0, H - sum), gs = dims.map(function (d) { return 0.4 + d.p.gap; }), gt = gs.reduce(function (t, v) { return t + v; }, 0) + 0.7, y = free * 0.35 / gt;
      dims.forEach(function (d, i) {
        var cy = y + d.vh / 2, cx = side ? W - d.vw * (1 - d.p.out) + d.vw / 2 : -d.vw * d.p.out + d.vw / 2;
        y += d.vh + free * gs[i] / gt;
        html += '<div class="prop prop--' + d.p.k + '" style="width:' + d.w.toFixed(0) + "px;left:" + (cx - d.w / 2).toFixed(0) + "px;top:" + (cy - d.h / 2).toFixed(0) + "px;transform:rotate(" + d.p.rot.toFixed(0) + 'deg)">' + PROP_DEFS[d.p.k].svg + "</div>";
      });
    });
    box.innerHTML = html;
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
      b.innerHTML = '<span class="card__inner">' + backHTML() + frontHTML(idx) + "</span>";
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
    $("#deskZone").hidden = done >= total && total > 0;
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
  function renderPlayed() {
    var grid = $("#played"), ids = state.done.slice().reverse();
    $("#playedCount").textContent = ids.length ? "(" + ids.length + ")" : "";
    $("#playedEmpty").hidden = ids.length > 0;
    grid.innerHTML = "";
    ids.forEach(function (idx) {
      var k = cat(idx), hasNote = (state.notes[idx] || "").trim().length > 0;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mini" + (idx === justDone ? " is-new" : "");
      b.style.setProperty("--acc", k.farbe);
      b.setAttribute("aria-label", CARDS[idx].titel + (hasNote ? ", mit Notiz" : "") + " — öffnen");
      b.innerHTML = '<img src="' + esc(k.bild) + '" alt=""><span class="mini__cat">' + esc(k.name) + '</span><span class="mini__title">' + esc(hy(CARDS[idx].titel)) + "</span>" +
        (hasNote ? '<span class="mini__note">Notiz</span>' : "");
      b.addEventListener("click", function () { lastFocus = b; openReader(idx); });
      grid.appendChild(b);
    });
  }

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

  function openReader(idx) {
    var c = CARDS[idx], k = cat(idx);
    var played = state.done.indexOf(idx) >= 0;
    var no = played ? state.done.indexOf(idx) + 1 : state.done.length + 1;
    var o = $("#reader");
    o.innerHTML =
      '<div class="reader" role="dialog" aria-modal="true" aria-labelledby="rtitle">' +
        '<article class="big" style="--acc:' + k.farbe + '">' +
          '<span class="big__no">' + (played ? "Abgelegt · " : "") + no + " / " + state.total + "</span>" +
          (c.prompt ? '<div class="prompt"><span class="prompt__q">' + esc(c.prompt) + '</span><span class="prompt__dots">' + (c.gruppen || []).map(function (g) { return '<i style="background:' + g.farbe + '"></i>'; }).join("") + "</span></div>" : c.grafik && window.GRAFIK ? '<div class="big__media big__media--grafik">' + window.GRAFIK(c.grafik) + '</div>' : '<div class="big__media"><img src="' + esc(k.bild) + '" alt=""></div>') +
          '<span class="big__cat">' + esc(k.name) + (c.teil ? ' <span class="big__teil">· ' + esc(c.teil) + "</span>" : "") + "</span>" +
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
          '<textarea id="note" placeholder="Schreib auf, was dir dazu einfällt. Nur du siehst das.">' + esc(state.notes[idx] || "") + "</textarea>" +
          '<p class="notes__meta">Wird nur in diesem Browser gespeichert.</p>' +
          '<div class="row">' +
            (played
              ? '<button class="btn btn--primary" type="button" id="later">Fertig <span class="arr">→</span></button>'
              : '<button class="btn btn--primary" type="button" id="done">Karte ablegen <span class="arr">→</span></button>' +
                '<button class="btn btn--outline" type="button" id="later">Später weiter</button>') +
          "</div>" +
        "</div>" +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
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
    if (next) next.focus({ preventScroll: true }); else $("#finish h2") && $("#finish h2").focus();
  }

  /* ---------- Notizen ansehen und herunterladen ---------- */
  function notesText() {
    var lines = ["Aufgedeckt — meine Notizen", new Date().toLocaleDateString("de-DE"), ""];
    state.done.concat(state.up).forEach(function (i) {
      var n = (state.notes[i] || "").trim();
      lines.push("■ " + cat(i).name + " — " + CARDS[i].titel);
      if (CARDS[i].text) lines.push(CARDS[i].text.replace(/\*\*/g, ""));
      if (CARDS[i].text2) lines.push(CARDS[i].text2.replace(/\*\*/g, ""));
      (CARDS[i].liste || []).forEach(function (x) { lines.push("  • " + x.replace(/\*\*/g, "")); });
      if (state.picks[i] && state.picks[i].length) lines.push("Ausgewählt: " + state.picks[i].join(", "));
      lines.push(n ? n : "(keine Notiz)");
      lines.push("");
    });
    return lines.join("\n");
  }

  function download(msgEl) {
    var text = notesText();
    var name = "aufgedeckt-notizen.txt";
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

  function openNotes() {
    lastFocus = document.activeElement;
    var ids = state.done.concat(state.up);
    var o = $("#reader");
    o.innerHTML =
      '<div class="drawer" role="dialog" aria-modal="true" aria-labelledby="ntitle">' +
        '<span class="eyebrow">Gezogene Karten</span>' +
        '<h2 id="ntitle" tabindex="-1">Deine Notizen</h2>' +
        (ids.length ? '<ul class="drawer__list">' + ids.map(function (i) {
          return '<li style="--acc:' + cat(i).farbe + '"><button type="button" class="drawer__item" data-idx="' + i + '"><span class="cat">' + esc(cat(i).name) + '</span><span class="t">' + esc(hy(CARDS[i].titel)) + '</span><span class="n">' + esc(state.notes[i] || "Noch keine Notiz – tippen, um etwas zu schreiben") + '</span><span class="go">Öffnen <span class="arr">→</span></span></button></li>';
        }).join("") + "</ul>" : '<p class="empty">Du hast noch keine Karte aufgedeckt. Tipp eine leuchtende Karte an, um zu starten.</p>') +
        '<p class="msg" id="msg" aria-live="polite"></p>' +
        '<div class="row"><button class="btn btn--secondary" type="button" id="dl"' + (ids.length ? "" : " disabled") + '>Notizen herunterladen</button>' +
        '<button class="btn btn--outline" type="button" id="close">Schließen</button></div>' +
      "</div>";
    o.hidden = false; o.scrollTop = 0;
    $("#dl", o).addEventListener("click", function () { download($("#msg", o)); });
    o.querySelectorAll(".drawer__item").forEach(function (b) { b.addEventListener("click", function () { openReader(+b.dataset.idx); }); });
    $("#close", o).addEventListener("click", function () { closeOverlays(); });
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
    state.layout = state.layout || "stapel";
    save();
    render(); renderLayouts(); layoutProps();
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
