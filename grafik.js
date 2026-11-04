/*
  Grafiken für die Karten (eigene Zeichnungen in den pub.tech-Farben).
  In cards.js wählt "grafik" die Zeichnung, z. B. "felder:2" oder "stile:4".
*/
(function () {
  var INK = "#231639", PAPER = "#f6f4fb", MUTED = "#b3a8cf", LINE = "rgba(246,244,251,0.18)", AQUA = "#59d5dc", LIME = "#b5fd42";
  var F = 'font-family="Overpass, system-ui, sans-serif"';
  function svg(inner, vb) { return '<svg class="grafik" viewBox="' + (vb || "0 0 320 200") + '" role="img" aria-hidden="true" ' + F + '>' + inner + "</svg>"; }
  function t(x, y, s, size, w, fill, anchor, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" font-weight="' + (w || 800) + '" fill="' + (fill || PAPER) + '" text-anchor="' + (anchor || "middle") + '" ' + (extra || "") + ">" + s + "</text>";
  }
  function lines(x, y, arr, size, w, fill, lh) { return arr.map(function (s, i) { return t(x, y + i * (lh || size * 1.15), s, size, w, fill); }).join(""); }
  function dim(on) { return on ? 1 : 0.2; }

  /* Konfliktfelder: vier Kacheln, in der Mitte der Konflikt */
  /* Konfliktfelder: Ring aus vier Segmenten um den Konflikt, wie ein Kompass */
  function felder(a) {
    var cx = 160, cy = 92, R = 54, Q = [
      { n: ["Struktur"], c: "#0DADF2", a0: 180, a1: 270, lx: 62, ly: 34, an: "end" },
      { n: ["Inhalte"], c: "#F471DE", a0: 270, a1: 360, lx: 258, ly: 34, an: "start" },
      { n: ["Zwischen-", "menschlich"], c: "#35B680", a0: 90, a1: 180, lx: 62, ly: 148, an: "end" },
      { n: ["Individuell"], c: "#F9851F", a0: 0, a1: 90, lx: 258, ly: 152, an: "start" }
    ];
    var P = function (r, d) { var w = d * Math.PI / 180; return [cx + Math.cos(w) * r, cy + Math.sin(w) * r]; };
    var arc = function (r, d0, d1) { var p0 = P(r, d0), p1 = P(r, d1); return "M" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) + " A" + r + " " + r + " 0 0 1 " + p1[0].toFixed(1) + " " + p1[1].toFixed(1); };
    var out = '<defs><linearGradient id="fpr" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient>' +
      '<filter id="fgl" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter></defs>';
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 20) + '" fill="none" stroke="rgba(246,244,251,0.12)" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>';
    Q.forEach(function (q, i) {
      var on = !a || a === i + 1, act = a === i + 1, m = (q.a0 + q.a1) / 2, pm = P(R + (act ? 13 : 10), m), po = P(R + 24, m);
      if (act) out += '<path d="' + arc(R, q.a0 + 6, q.a1 - 6) + '" fill="none" stroke="' + q.c + '" stroke-width="18" opacity="0.55" filter="url(#fgl)"/>';
      out += '<path d="' + arc(R, q.a0 + 6, q.a1 - 6) + '" fill="none" stroke="' + q.c + '" stroke-opacity="' + (on ? 1 : 0.45) + '" stroke-width="' + (act ? 14 : on && !a ? 8 : 3) + '" stroke-linecap="round"/>';
      var lx = q.lx, ly = q.ly, edgeX = q.an === "end" ? lx + 6 : lx - 6;
      out += '<path d="M' + po[0].toFixed(1) + " " + po[1].toFixed(1) + " L" + edgeX + " " + (ly - 4 + (q.n.length - 1) * 6) + '" fill="none" stroke="' + q.c + '" stroke-opacity="' + (on ? 0.6 : 0.25) + '" stroke-width="1"/>' +
        '<circle cx="' + po[0].toFixed(1) + '" cy="' + po[1].toFixed(1) + '" r="2.4" fill="' + q.c + '" fill-opacity="' + (on ? 1 : 0.5) + '"/>' +
        lines(lx, ly, q.n, act ? 12 : 10.5, act ? 900 : 800, on ? (act ? PAPER : q.c) : "rgba(179,168,207,0.6)", 12).replace(/text-anchor="middle"/g, 'text-anchor="' + q.an + '"');
    });
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="31" fill="#220736" stroke="rgba(246,244,251,0.12)"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="25" fill="url(#fpr)"/>' + t(cx, cy + 3.5, "Konflikt", 9.5, 900, INK);
    return svg(out, "-24 12 368 166");
  }

  /* Konfliktstile: Matrix aus Kooperationswille und Konfrontationsbereitschaft */
  function stile(a) {
    var x0 = 104, y0 = 16, w = 84, h = 54, g = 7;
    var Q = [
      { k: 1, n: ["Vermeiden"], c: "#3e768a", x: x0, y: y0 + h + g },
      { k: 2, n: ["Entgegen-", "kommen"], c: "#9F9FF4", x: x0, y: y0 },
      { k: 3, n: ["Konfron-", "tieren"], c: "#F9851F", x: x0 + w + g, y: y0 + h + g },
      { k: 4, n: ["Koope-", "rieren"], c: LIME, x: x0 + w + g, y: y0 }
    ];
    var out = Q.map(function (q) {
      var on = !a || a === q.k;
      return '<rect x="' + q.x + '" y="' + q.y + '" width="' + w + '" height="' + h + '" rx="8" fill="' + (on ? q.c : "#220736") + '" stroke="' + q.c + '" stroke-opacity="' + (on ? 1 : 0.5) + '" stroke-width="1"/>' +
        lines(q.x + w / 2, q.y + h / 2 + (q.n.length > 1 ? -1.5 : 4), q.n, 10.5, 900, on ? INK : q.c, 11.5);
    }).join("");
    var axX = x0 - 12, axY = y0 + 2 * h + g + 10, my = y0 + h + g / 2;
    out += '<path d="M' + axX + " " + axY + " V" + (y0 - 4) + '" stroke="' + AQUA + '" stroke-width="1.4" marker-end="url(#ar)"/>' +
      '<path d="M' + axX + " " + axY + " H" + (x0 + 2 * w + g + 12) + '" stroke="' + AQUA + '" stroke-width="1.4" marker-end="url(#ar)"/>' +
      '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="' + AQUA + '"/></marker></defs>' +
      '<g transform="translate(' + (axX - 9) + " " + my + ') rotate(-90)">' + t(0, 0, "Kooperation", 9, 700, MUTED) + "</g>" +
      t(x0 + w + g / 2, axY + 15, "Konfrontation", 9, 700, MUTED);
    return svg(out, "60 4 260 156");
  }

  /* Eskalation: neun Stufen abwärts, drei Phasen */
  function eskalation(p) {
    var cols = ["#35B680", "#F9851F", "#f4005e"], out = "";
    for (var i = 0; i < 9; i++) {
      var ph = Math.floor(i / 3), on = !p || p === ph + 1;
      var x = 14 + i * 32, y = 14 + i * 17;
      out += '<rect x="' + x + '" y="' + y + '" width="44" height="22" rx="6" fill="' + (on ? cols[ph] : "#2d1e4a") + '" stroke="' + cols[ph] + '" stroke-opacity="' + (on ? 1 : 0.6) + '" stroke-width="1.5"/>' +
        t(x + 22, y + 16, String(i + 1), 13, 900, on ? INK : cols[ph]);
    }
    var labels = [["gemeinsam", "lösen"], ["gewinnen &", "verlieren"], ["alle", "verlieren"]];
    labels.forEach(function (l, k) {
      var on = !p || p === k + 1;
      /* Begriff direkt links unter die drei Stufen seiner Phase */
      out += lines(42 + k * 96, 84 + k * 51, l, 11, 800, on ? cols[k] : "rgba(179,168,207,0.45)", 12);
    });
    return svg(out);
  }

  /* Checkliste: große Ziffer mit zehn Segmenten */
  function checkliste(n) {
    var cx = 160, cy = 64, r = 52, out = "";
    var defs = '<defs><linearGradient id="pr" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient></defs>';
    if (!n) return svg(defs + '<text x="160" y="150" font-size="170" font-weight="900" fill="url(#pr)" text-anchor="middle">“</text>', "0 22 320 88");
    for (var i = 0; i < 10; i++) {
      var a0 = (i / 10) * Math.PI * 2 - Math.PI / 2 + 0.07, a1 = ((i + 1) / 10) * Math.PI * 2 - Math.PI / 2 - 0.07;
      var d = "M" + (cx + Math.cos(a0) * r).toFixed(1) + " " + (cy + Math.sin(a0) * r).toFixed(1) + " A" + r + " " + r + " 0 0 1 " + (cx + Math.cos(a1) * r).toFixed(1) + " " + (cy + Math.sin(a1) * r).toFixed(1);
      out += '<path d="' + d + '" fill="none" stroke="' + (i < n ? "url(#pr)" : LINE) + '" stroke-width="' + (i === n - 1 ? 10 : 6) + '" stroke-linecap="round"/>';
    }
    out += defs + t(cx, cy + 15, (n < 10 ? "0" : "") + n, 44, 900, "url(#pr)") + t(cx, cy + 31, "von 10", 9, 700, MUTED);
    return svg(out, "40 4 240 120");
  }

  /* Übung: CRASH (in sich zusammengesunken) und COACH (aufgerichtet), dazu das Pendel */
  function figure(x, col, up) {
    if (up) return '<g fill="none" stroke="' + col + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="' + x + '" cy="30" r="12" fill="' + col + '" stroke="none"/>' +
      '<path d="M' + x + ' 48 V96"/><path d="M' + x + ' 58 L' + (x - 24) + ' 40"/><path d="M' + x + ' 58 L' + (x + 24) + ' 40"/>' +
      '<path d="M' + x + ' 96 L' + (x - 14) + ' 132"/><path d="M' + x + ' 96 L' + (x + 14) + ' 132"/></g>';
    return '<g fill="none" stroke="' + col + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="' + (x + 13) + '" cy="56" r="11" fill="' + col + '" stroke="none"/>' +
      '<path d="M' + (x + 7) + ' 66 Q' + (x - 12) + ' 78 ' + (x - 6) + ' 100"/><path d="M' + (x + 3) + ' 72 Q' + (x + 12) + ' 90 ' + (x + 10) + ' 110"/>' +
      '<path d="M' + (x - 6) + ' 100 L' + (x - 14) + ' 132"/><path d="M' + (x - 6) + ' 100 L' + (x + 6) + ' 132"/></g>';
  }
  function uebung(k) {
    if (k === 1 || k === 2) {
      var up = k === 2, col = up ? AQUA : "#f4005e", word = up ? "COACH" : "CRASH", sub = up ? "Lösungs-Trance" : "Problem-Trance";
      var out = '<defs><filter id="ug" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>' +
        '<ellipse cx="92" cy="80" rx="46" ry="54" fill="' + col + '" opacity="0.28" filter="url(#ug)"/>' +
        '<path d="M44 136 H140" stroke="' + col + '" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>' + figure(92, col, up) +
        t(168, 84, word, 38, 900, col, "start", 'letter-spacing="-0.5"') + t(170, 106, sub + (up ? "  ↑" : "  ↓"), 12, 800, MUTED, "start");
      return svg(out, "0 8 320 136");
    }
    var o = '<circle cx="78" cy="100" r="46" fill="#2d1e4a" stroke="#f4005e" stroke-width="2"/>' + t(78, 106, "CRASH", 16, 900, "#f4005e") +
      '<circle cx="242" cy="100" r="46" fill="' + AQUA + '"/>' + t(242, 106, "COACH", 16, 900, INK) +
      '<path d="M128 80 Q160 56 192 80" fill="none" stroke="' + LIME + '" stroke-width="3" marker-end="url(#pa)"/>' +
      '<path d="M192 120 Q160 144 128 120" fill="none" stroke="' + LIME + '" stroke-width="3" marker-end="url(#pa)"/>' +
      '<defs><marker id="pa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="' + LIME + '"/></marker></defs>' +
      t(160, 106, "3×", 18, 900, LIME);
    return svg(o, "0 48 320 104");
  }

  /* Playlist: Schallplatte mit Phasen-Nummer */
  function playlist(n) {
    var cx = 112, cy = 62, out = '<circle cx="' + cx + '" cy="' + cy + '" r="58" fill="#0c0814"/>';
    for (var r = 22; r < 56; r += 4) out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="rgba(246,244,251,' + (r % 8 ? 0.06 : 0.11) + ')" stroke-width="1"/>';
    out += '<path d="M' + (cx - 40) + ' ' + (cy - 42) + ' A58 58 0 0 1 ' + (cx + 40) + ' ' + (cy - 42) + '" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="7" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="20" fill="#F471DE"/>' + t(cx, cy - 4, "PHASE", 6, 800, INK, "middle", 'letter-spacing="1"') + t(cx, cy + 11, String(n || ""), 16, 900, INK);
    for (var i = 0; i < 6; i++) {
      var on = i + 1 === n, h = [20, 34, 26, 40, 22, 30][i];
      out += '<rect x="' + (200 + i * 14) + '" y="' + (98 - h) + '" width="9" height="' + h + '" rx="4.5" fill="' + (on ? "#F471DE" : "#2d1e4a") + '" stroke="#F471DE" stroke-opacity="' + (on ? 1 : 0.5) + '" stroke-width="1.2"/>';
    }
    out += t(238, 116, n + " von 6 Phasen", 10, 800, MUTED);
    return svg(out, "0 0 320 126");
  }

  /* Bücher: Regal mit drei Stufen */
  /* Bücher: drei Themen als Buchrücken im Regal – das aktive Buch wird herausgezogen und leuchtet.
     Darunter die Stufe als Schalter. */
  function buecher(n) {
    var topic = Math.floor(n / 10), level = n % 10, LIL = "#c9c4f2", Y = "#F9CE1F", O = "#F9851F";
    var books = [{ l: ["Gewaltfreie", "Kommuni-", "kation"], h: 74 }, { l: ["DISG &", "Persönlich-", "keitstypen"], h: 82 }, { l: ["Kommuni-", "kation"], h: 70 }];
    var shelf = 98, out = '<defs><linearGradient id="bkA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="0.45" stop-color="' + Y + '"/><stop offset="1" stop-color="' + O + '"/></linearGradient>' +
      '<linearGradient id="bkS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="0.25" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
      '<filter id="bkG" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10"/></filter></defs>';
    /* Regalbrett */
    out += '<rect x="22" y="' + shelf + '" width="276" height="6" rx="3" fill="rgba(201,196,242,0.28)"/><rect x="22" y="' + (shelf + 6) + '" width="276" height="10" fill="url(#bkF)" opacity="0"/>';
    books.forEach(function (b, j) {
      var on = topic === j + 1, w = 72, cx = 70 + j * 90, x = cx - w / 2, y = shelf - b.h - (on ? 0 : 5), tr = on ? ' transform="translate(0 -12) rotate(-5 ' + cx + " " + shelf + ')"' : "";
      var g = "<g" + tr + ">";
      if (on) g += '<rect x="' + (x + 6) + '" y="' + (y + 10) + '" width="' + (w - 12) + '" height="' + (b.h - 10) + '" rx="8" fill="' + O + '" opacity="0.7" filter="url(#bkG)"/>';
      g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + b.h + '" rx="7" fill="' + (on ? "url(#bkA)" : "#220736") + '" stroke="' + (on ? "#ffe9a0" : LIL) + '" stroke-opacity="' + (on ? 1 : 0.35) + '" stroke-width="1.4"/>';
      if (on) g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + b.h + '" rx="7" fill="url(#bkS)"/>';
      var bc = on ? INK : LIL, bo = on ? 0.55 : 0.3;
      g += '<rect x="' + (x + 8) + '" y="' + (y + 9) + '" width="' + (w - 16) + '" height="2" rx="1" fill="' + bc + '" fill-opacity="' + bo + '"/>' +
        '<rect x="' + (x + 8) + '" y="' + (y + b.h - 11) + '" width="' + (w - 16) + '" height="2" rx="1" fill="' + bc + '" fill-opacity="' + bo + '"/>';
      var ty = y + b.h / 2 - (b.l.length - 1) * 5.2 + 3.2;
      g += lines(cx, ty, b.l, 9, 900, on ? INK : "rgba(201,196,242,0.6)", 10.4);
      out += g + "</g>";
    });
    /* Stufen-Schalter */
    var names = ["Einsteiger", "Erfahrene", "Profi"], sx = 52, sw = 216, seg = sw / 3, sy = 116;
    out += '<rect x="' + sx + '" y="' + sy + '" width="' + sw + '" height="20" rx="10" fill="rgba(26,16,41,0.6)" stroke="rgba(246,244,251,0.16)"/>';
    names.forEach(function (nm, i) {
      var on = level === i + 1, x = sx + i * seg;
      if (on) out += '<rect x="' + (x + 2) + '" y="' + (sy + 2) + '" width="' + (seg - 4) + '" height="16" rx="8" fill="' + Y + '"/>';
      var iw = i * 3.6 + 2.2, tw = nm.length * 4.2, gx = x + seg / 2 - (iw + 4 + tw) / 2, base = sy + 13.1;
      out += '<g data-cx="' + (x + seg / 2) + '">';
      for (var k = 0; k <= i; k++) out += '<rect x="' + (gx + k * 3.6) + '" y="' + (base - (k + 1) * 2.4) + '" width="2.2" height="' + ((k + 1) * 2.4) + '" rx="0.8" fill="' + (on ? INK : MUTED) + '"/>';
      out += t(gx + iw + 4, base, nm, 8.5, 900, on ? INK : MUTED, "start") + '</g>';
    });
    return svg(out, "0 6 320 134");
  }

  /* Führung: zehn Schritte auf einem Weg */
  function fuehrung() {
    /* Ein ruhig ansteigender Weg; die zehn Stationen liegen exakt auf der Kurve */
    var B = [[30, 150], [130, 150], [170, 50], [286, 46]];
    var at = function (u) { var v = 1 - u; return [0, 1].map(function (k) { return v * v * v * B[0][k] + 3 * v * v * u * B[1][k] + 3 * v * u * u * B[2][k] + u * u * u * B[3][k]; }); };
    var d = "M" + B[0] + " C" + B[1] + " " + B[2] + " " + B[3];
    var out = '<defs><linearGradient id="fwG" x1="0" x2="1"><stop offset="0" stop-color="' + LIME + '" stop-opacity="0.15"/><stop offset="1" stop-color="' + LIME + '" stop-opacity="0.9"/></linearGradient>' +
      '<radialGradient id="fwH" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="' + LIME + '" stop-opacity="0.5"/><stop offset="1" stop-color="' + LIME + '" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="' + d + '" fill="none" stroke="url(#fwG)" stroke-width="1.6" stroke-linecap="round"/>';
    /* Stationen gleichmäßig über die Bogenlänge verteilen */
    var S = [], L = [0], prev = at(0); for (var k = 1; k <= 400; k++) { var q = at(k / 400); L.push(L[k - 1] + Math.hypot(q[0] - prev[0], q[1] - prev[1])); prev = q; }
    for (var i = 0; i < 10; i++) { var tgt = L[400] * i / 9, j = 0; while (j < 400 && L[j] < tgt) j++; S.push(at(j / 400)); }
    S.forEach(function (p, i) {
      var last = i === 9, x = p[0].toFixed(1), y = p[1].toFixed(1);
      if (last) out += '<circle cx="' + x + '" cy="' + y + '" r="24" fill="url(#fwH)"/>';
      out += '<circle cx="' + x + '" cy="' + y + '" r="' + (last ? 11 : 7.5) + '" fill="' + (last ? LIME : "#220736") + '" stroke="' + LIME + '" stroke-opacity="' + (last ? 1 : 0.35 + i * 0.06) + '" stroke-width="1.2"/>' +
        t(x, (+y + (last ? 3.6 : 2.9)).toFixed(1), String(i + 1), last ? 10 : 7.5, 900, last ? INK : PAPER);
    });
    var f = S[9]; out += '<path d="M' + (f[0] + 0.5) + ' ' + (f[1] - 11) + ' V' + (f[1] - 30) + ' L' + (f[0] + 16) + ' ' + (f[1] - 25) + ' L' + (f[0] + 0.5) + ' ' + (f[1] - 20) + '" fill="' + LIME + '" stroke="' + LIME + '" stroke-width="1.2" stroke-linejoin="round"/>' +
      t(30, 170, "Start", 8.5, 700, MUTED, "start") + t(286, 74, "Ziel", 8.5, 700, LIME, "middle");
    return svg(out, "6 6 308 176");
  }

  /* Harvard-Methode: vier Prinzipien als verbundene Kreise */
  function harvard(n) {
    var L = "#b794e8", P = [["Menschen"], ["Interessen"], ["Optionen"], ["Kriterien"]], out = "";
    out += '<defs><radialGradient id="hvG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="' + L + '" stop-opacity="0.55"/><stop offset="1" stop-color="' + L + '" stop-opacity="0"/></radialGradient></defs>';
    out += '<path d="M46 84 H274" fill="none" stroke="rgba(183,148,232,0.4)" stroke-width="1.2" stroke-linecap="round"/>';
    P.forEach(function (p, i) {
      var x = 46 + i * 76, on = !n || n === i + 1, act = n === i + 1;
      if (act) out += '<circle cx="' + x + '" cy="84" r="34" fill="url(#hvG)"/>';
      out += '<circle cx="' + x + '" cy="84" r="' + (act ? 19 : 16) + '" fill="' + (act ? L : "#220736") + '" stroke="' + L + '" stroke-opacity="' + (on ? 1 : 0.5) + '" stroke-width="' + (act ? 0 : 1.2) + '"/>' +
        t(x, 84 + (act ? 6 : 5), String(i + 1), act ? 16 : 13, 900, act ? INK : (on ? L : MUTED)) +
        lines(x, 124, p, 9.5, act ? 900 : 700, act ? PAPER : MUTED, 11);
    });
    return svg(out, "0 40 320 100");
  }

  /* BATNA: Weggabelung zwischen Einigung und Plan B */
  function batna(n) {
    var L = "#b794e8";
    var out = '<path d="M24 136 C 96 136, 112 100, 150 100" fill="none" stroke="' + PAPER + '" stroke-opacity="0.45" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M150 100 C 186 100, 196 58, 222 56" fill="none" stroke="' + L + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M150 100 C 186 100, 196 142, 222 144" fill="none" stroke="' + LIME + '" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="' + (n ? "0" : "2 7") + '"/>' +
      '<circle cx="150" cy="100" r="6" fill="#220736" stroke="' + PAPER + '" stroke-width="2"/>' +
      '<circle cx="224" cy="56" r="4.5" fill="' + L + '"/><circle cx="224" cy="144" r="4.5" fill="' + LIME + '"/>' +
      t(240, 50, "Ziel", 8.5, 700, MUTED, "start") + t(240, 64, "Einigung", 13, 900, L, "start") +
      t(240, 138, "Plan B", 8.5, 700, MUTED, "start") + t(240, 152, "BATNA", 13, 900, LIME, "start") +
      t(24, 156, "Verhandlung", 9.5, 700, MUTED, "start");
    return svg(out, "10 30 300 140");
  }

  /* LEAF: vier Blätter */
  function leaf(n) {
    var L = [["L", "Listen"], ["E", "Empathize"], ["A", "Apologize"], ["F", "Find a Solution"]], out = "";
    out += '<path d="M40 150 Q160 120 290 150" fill="none" stroke="#35B680" stroke-width="3" stroke-linecap="round"/>';
    L.forEach(function (l, i) {
      var x = 62 + i * 66, y = 92 - (i % 2) * 14;
      out += '<g transform="rotate(' + (-18 + i * 12) + " " + x + " " + y + ')"><path d="M' + x + " " + (y + 40) + " C " + (x - 36) + " " + (y + 10) + ", " + (x - 22) + " " + (y - 36) + ", " + x + " " + (y - 46) + " C " + (x + 22) + " " + (y - 36) + ", " + (x + 36) + " " + (y + 10) + ", " + x + " " + (y + 40) + 'Z" fill="' + LIME + '" fill-opacity="' + (n ? 0.95 : 0.85 - i * 0.12) + '"/>' +
        '<path d="M' + x + " " + (y + 40) + " V" + (y - 38) + '" stroke="' + INK + '" stroke-opacity="0.25" stroke-width="1.5"/></g>' +
        t(x, y + 8, l[0], 26, 900, INK) + t(x, 178, l[1], 9.5, 800, MUTED);
    });
    return svg(out, "0 26 320 162");
  }

  /* SAG ES: Buchstaben-Kacheln, deine Sicht und die andere Sicht */
  function sages(n) {
    var W = ["S", "A", "G", "E", "S"], out = "";
    W.forEach(function (c, i) {
      var grp = i < 3 ? 1 : 2, on = !n || n === grp, x = 22 + i * 58 + (i > 2 ? 10 : 0);
      var gc = grp === 1 ? "#b794e8" : AQUA;
      out += '<rect x="' + x + '" y="52" width="50" height="62" rx="12" fill="' + (on ? gc : "#2d1e4a") + '" stroke="' + gc + '" stroke-opacity="' + (on ? 1 : 0.6) + '" stroke-width="1.5"/>' + t(x + 25, 96, c, 34, 900, on ? INK : gc);
    });
    out += '<path d="M22 130 H186" stroke="#b794e8" stroke-width="2" stroke-opacity="' + (!n || n === 1 ? 1 : 0.3) + '"/>' + t(104, 150, "meine Sicht", 11, 800, !n || n === 1 ? PAPER : MUTED) +
      '<path d="M206 130 H298" stroke="' + AQUA + '" stroke-width="2" stroke-opacity="' + (!n || n === 2 ? 1 : 0.3) + '"/>' + t(252, 150, "deine Sicht & Lösung", 11, 800, !n || n === 2 ? PAPER : MUTED);
    return svg(out, "0 40 320 120");
  }

  /* Gesprächsablauf: acht Stationen, je zwei pro Karte */
  function ablauf(n) {
    var S = ["Einstieg", "Wahr-|nehmung", "Sicht|Gegenüber", "Verständnis", "Lösung", "Kriterien", "Verein-|barung", "Abschluss"], out = "";
    out += '<path d="M36 92 H284" stroke="rgba(183,148,232,0.35)" stroke-width="3"/>';
    S.forEach(function (s, i) {
      var x = 36 + i * 35.4, on = !n || Math.floor(i / 2) + 1 === n, y = i % 2 ? 128 : 60;
      out += '<circle cx="' + x + '" cy="92" r="' + (on ? 11 : 7) + '" fill="' + (on ? "#b794e8" : "#2d1e4a") + '" stroke="#b794e8" stroke-width="2"/>' +
        '<path d="M' + x + " " + (i % 2 ? 103 : 81) + " V" + (i % 2 ? 112 : 72) + '" stroke="#b794e8" stroke-opacity="' + (on ? 1 : 0.3) + '" stroke-width="1.5"/>' +
        lines(x, i % 2 ? 126 : 50 - (s.indexOf("|") >= 0 ? 12 : 0), s.split("|"), 10, on ? 900 : 700, on ? PAPER : MUTED, 12);
    });
    return svg(out, "0 26 320 120");
  }

  /* Weiterdenken: drei schräg gelegte Notizzettel mit Fragezeichen */
  function reflexion(n) {
    var C = [AQUA, "#b794e8", "#ff7af8"], defs = "", out = "";
    [[-6, 70, 66], [3, 160, 60], [-3, 250, 68]].forEach(function (p, i) {
      var on = !n || n === i + 1, w = 72, h = 62, c = C[i], x = p[1] - w / 2, y = p[2] - h / 2;
      defs += '<linearGradient id="rfG' + i + '" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="0.75"/></linearGradient>' +
        '<linearGradient id="rfD' + i + '" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="' + c + '" stop-opacity="0.22"/><stop offset="1" stop-color="#1a1029" stop-opacity="0.9"/></linearGradient>';
      var g = '<g transform="rotate(' + p[0] + ' ' + p[1] + ' ' + p[2] + ')"' + (on ? ' data-live="1" style="filter:drop-shadow(0 0 14px ' + c + '88)"' : '') + '>';
      g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="url(#' + (on ? 'rfG' : 'rfD') + i + ')" stroke="' + c + '" stroke-opacity="' + (on ? 1 : 0.55) + '" stroke-width="1.4"/>';
      if (on) g += '<path d="M' + (x + 6) + ' ' + (y + 6) + ' H' + (x + w * 0.55) + ' L' + (x + 6) + ' ' + (y + h * 0.6) + ' Z" fill="#ffffff" fill-opacity="0.35"/>';
      g += t(p[1], p[2] + 15, "?", 44, 900, on ? INK : c, "middle", on ? '' : ' fill-opacity="0.75"');
      /* Nummer */
      g += '<circle cx="' + (x + w - 4) + '" cy="' + (y + 4) + '" r="8" fill="' + (on ? INK : "#1a1029") + '" stroke="' + c + '" stroke-width="1.2"/>' + t(x + w - 4, y + 7.3, String(i + 1), 9, 900, c);
      out += g + '</g>';
      if (on) [[-47, -21, 2.4, 0.9], [-8, -44, 1.4, 0.6], [49, 9, 1.7, 0.75]].forEach(function (s) {
        var sx = p[1] + s[0], sy = p[2] + s[1], r = s[2];
        out += '<path d="M' + sx + ' ' + (sy - r * 2) + ' Q' + sx + ' ' + sy + ' ' + (sx + r * 2) + ' ' + sy + ' Q' + sx + ' ' + sy + ' ' + sx + ' ' + (sy + r * 2) + ' Q' + sx + ' ' + sy + ' ' + (sx - r * 2) + ' ' + sy + ' Q' + sx + ' ' + sy + ' ' + sx + ' ' + (sy - r * 2) + ' Z" fill="' + c + '" fill-opacity="' + s[3] + '"/>';
      });
    });
    return svg('<defs>' + defs + '</defs>' + out, "0 18 320 104");
  }


  /* Boxenstop: Thermometer 1–10, quer liegend */
  function thermo() {
    var out = '<defs><linearGradient id="th" x1="0" x2="1"><stop offset="0" stop-color="#f4005e"/><stop offset="0.45" stop-color="#F9851F"/><stop offset="0.75" stop-color="' + AQUA + '"/><stop offset="1" stop-color="' + LIME + '"/></linearGradient></defs>' +
      /* Röhre + Kolben als ein Umriss: erst beide Umrisse, dann die Überschneidung innen abdecken */
      '<circle cx="44" cy="55" r="20" fill="#1a1029" stroke="rgba(246,244,251,0.35)" stroke-width="1.5"/>' +
      '<rect x="52" y="44" width="236" height="22" rx="11" fill="#1a1029" stroke="rgba(246,244,251,0.35)" stroke-width="1.5"/>' +
      '<circle cx="44" cy="55" r="19.2" fill="#1a1029"/>' +
      '<rect x="50" y="44.8" width="22" height="20.4" fill="#1a1029"/>' +
      /* Füllstand, dann der rote Kolben davor */
      '<rect x="44" y="49" width="244" height="12" rx="6" fill="url(#th)"/>' +
      '<circle cx="44" cy="55" r="13" fill="#f4005e"/>' +
      '<ellipse cx="39" cy="50" rx="4.5" ry="2.6" transform="rotate(-30 39 50)" fill="#ffffff" fill-opacity="0.45"/>';
    for (var i = 1; i <= 10; i++) { var x = 60 + (i - 1) * 24.5; out += '<path d="M' + x + ' 72 V80" stroke="' + MUTED + '" stroke-width="1.5"/>' + t(x, 96, String(i), 11, 900, PAPER); }
    return svg(out, "0 26 320 82");
  }


  /* Eisbergmodell: facettierter Eisberg, kleine Spitze über Wasser, großer Teil darunter */
  function eisberg() {
    var W = 70, L = "#b794e8", defs =
      '<linearGradient id="ebSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + AQUA + '" stop-opacity="0.32"/><stop offset="0.5" stop-color="#6b3fa8" stop-opacity="0.18"/><stop offset="1" stop-color="#1a1029" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="ebHi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9fbfd"/></linearGradient>' +
      '<linearGradient id="ebSh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + AQUA + '"/><stop offset="1" stop-color="#3a9aa3"/></linearGradient>' +
      '<linearGradient id="ebU1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + AQUA + '" stop-opacity="0.7"/><stop offset="1" stop-color="' + L + '" stop-opacity="0.18"/></linearGradient>' +
      '<linearGradient id="ebU2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + AQUA + '" stop-opacity="0.45"/><stop offset="1" stop-color="' + L + '" stop-opacity="0.1"/></linearGradient>' +
      '<clipPath id="ebClip"><rect x="8" y="' + W + '" width="304" height="130"/></clipPath>';
    var out = '<rect x="8" y="' + W + '" width="304" height="124" fill="url(#ebSea)"/>';
    /* Unterwasser-Teil: Facetten */
    out += '<g style="filter:drop-shadow(0 0 10px ' + AQUA + '55)">' +
      '<path d="M126 ' + W + ' L198 ' + W + ' L230 98 L244 136 L222 170 L166 186 L110 172 L86 132 L100 96 Z" fill="url(#ebU2)"/>' +
      '<path d="M126 ' + W + ' L162 ' + W + ' L150 118 L100 96 Z" fill="url(#ebU1)"/>' +
      '<path d="M162 ' + W + ' L198 ' + W + ' L230 98 L190 124 Z" fill="url(#ebU1)" fill-opacity="0.8"/>' +
      '<path d="M150 118 L190 124 L222 170 L166 186 Z" fill="url(#ebU1)" fill-opacity="0.55"/>' +
      '<path d="M100 96 L150 118 L110 172 L86 132 Z" fill="url(#ebU2)"/>' +
      '<path d="M126 ' + W + ' L198 ' + W + ' L230 98 L244 136 L222 170 L166 186 L110 172 L86 132 L100 96 Z M150 118 L190 124 M100 96 L150 118 L162 ' + W + ' M190 124 L230 98 M150 118 L110 172 M190 124 L222 170 M150 118 L166 186" fill="none" stroke="' + AQUA + '" stroke-opacity="0.45" stroke-width="0.8" stroke-linejoin="round"/></g>';
    /* Spitze über Wasser: hell, facettiert */
    out += '<g style="filter:drop-shadow(0 0 8px rgba(255,255,255,0.45))">' +
      '<path d="M130 ' + W + ' L148 40 L158 48 L170 26 L184 50 L194 ' + W + ' Z" fill="url(#ebSh)"/>' +
      '<path d="M130 ' + W + ' L148 40 L158 48 L170 26 L164 ' + W + ' Z" fill="url(#ebHi)"/>' +
      '<path d="M158 48 L170 26 L176 56 Z" fill="#ffffff" fill-opacity="0.6"/></g>';
    /* Wasserlinie mit Welle */
    var wave = "M8 " + W;
    for (var x = 8; x < 312; x += 16) wave += " q4 -3 8 0 t8 0";
    out += '<path d="' + wave + '" fill="none" stroke="' + AQUA + '" stroke-width="1.6" stroke-linecap="round" style="filter:drop-shadow(0 0 4px ' + AQUA + ')"/>';
    /* Ebenen-Titel */
    out += t(14, W - 10, "sichtbare Ebene", 9, 900, PAPER, "start") + t(14, W + 16, "weniger sichtbare Ebene", 9, 900, AQUA, "start");
    /* Beschriftungen mit Punkt + Linie */
    function lab(ax, ay, lx, ly, txt, col) {
      var left = lx < 160, ex = lx + (left ? 6 : -6);
      return '<path d="M' + ax + ' ' + ay + ' L' + ex + ' ' + ly + '" fill="none" stroke="' + col + '" stroke-opacity="0.7" stroke-width="0.9"/>' +
        '<circle cx="' + ax + '" cy="' + ay + '" r="2.4" fill="' + INK + '" stroke="#fff" stroke-width="1.1"/>' +
        '<circle cx="' + ex + '" cy="' + ly + '" r="1.5" fill="' + col + '"/>' +
        t(lx + (left ? 0 : 4), ly + 3.5, txt, 9.5, 800, col, left ? "end" : "start");
    }
    out += lab(178, 46, 236, 34, "Aussagen,", PAPER) + t(240, 49, "Forderungen", 9.5, 800, PAPER, "start") +
      lab(124, 106, 70, 120, "Interessen", AQUA) + lab(118, 146, 70, 158, "Bedürfnisse", AQUA) +
      lab(206, 108, 252, 104, "Werte", L) + lab(200, 162, 252, 168, "Motive", L);
    return svg('<defs>' + defs + '</defs>' + out, "6 18 308 176");
  }

  /* Empathie: Gehirn (kognitiv), Herz (emotional), Zielscheibe mit Pfeil (intentional) */
  function empathie() {
    var C = [["#b794e8", "kognitiv", "denken"], ["#ff7af8", "emotional", "fühlen"], [AQUA, "intentional", "wollen"]], defs = "", out = "";
    C.forEach(function (c, i) {
      var s = c[0];
      defs += '<linearGradient id="emG' + i + '" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="0.35" stop-color="' + s + '"/><stop offset="1" stop-color="' + s + '" stop-opacity="0.6"/></linearGradient>' +
        '<radialGradient id="emB' + i + '" cx="0.5" cy="0.35" r="0.7"><stop offset="0" stop-color="' + s + '" stop-opacity="0.28"/><stop offset="1" stop-color="#1a1029" stop-opacity="0.95"/></radialGradient>';
    });
    defs += '<marker id="emA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#ffffff"/></marker>';
    /* Verbindungen */
    out += '<path d="M100 74 H122 M198 74 H220" stroke="rgba(246,244,251,0.35)" stroke-width="1.2" stroke-dasharray="1 4" stroke-linecap="round"/>';
    C.forEach(function (c, i) {
      var x = 62 + i * 98, y = 74, s = c[0], g = 'url(#emG' + i + ')', icon = "";
      if (i === 0) {
        /* Gehirn in Seitenansicht (nach Vorlage nachgezeichnet): Glanzfläche + dunkle Windungen, wie beim Herz */
        icon = '<path d="M-17.7 -14.9 L-19.1 -13.5 L-19.9 -12.2 L-20.2 -10.9 L-20.2 -9.1 L-22.8 -7.2 L-23.7 -6.0 L-24.5 -3.9 L-24.5 -1.7 L-23.9 0.1 L-22.8 1.7 L-21.7 2.7 L-19.5 3.6 L-16.6 3.6 L-14.6 2.7 L-14.0 2.8 L-13.6 3.2 L-13.5 4.9 L-12.7 6.5 L-11.3 8.2 L-9.6 9.1 L-8.0 9.4 L-6.5 9.4 L-4.5 8.9 L-3.0 8.0 L-2.5 8.2 L-1.0 10.7 L3.4 16.6 L4.3 18.6 L4.5 19.7 L4.9 20.1 L5.6 20.2 L8.0 20.2 L8.9 19.9 L9.4 19.3 L9.8 18.6 L8.3 15.1 L8.3 14.7 L8.7 14.4 L9.4 14.2 L10.5 14.6 L12.9 14.6 L14.6 14.2 L16.8 13.1 L18.8 11.1 L20.1 8.7 L20.4 7.2 L20.4 4.1 L22.4 2.8 L23.9 1.0 L24.5 -0.6 L24.5 -2.7 L24.1 -3.9 L22.8 -6.0 L20.2 -7.6 L20.2 -8.9 L20.4 -9.1 L20.2 -11.4 L19.7 -12.7 L18.4 -14.4 L16.4 -15.5 L13.3 -15.8 L12.4 -17.3 L11.3 -18.4 L10.0 -19.1 L7.6 -19.5 L4.7 -18.8 L2.8 -19.9 L2.3 -19.9 L1.6 -20.2 L-0.3 -20.2 L-1.7 -19.9 L-4.1 -18.2 L-4.5 -18.2 L-6.0 -19.1 L-7.4 -19.5 L-10.0 -19.3 L-12.0 -18.2 L-13.6 -16.0 L-16.0 -15.7Z" fill="' + g + '" fill-rule="evenodd"/>' +
          '<path d="M-2.8 6.3 L-2.7 6.9 L-1.9 6.9 L-2.1 6.3Z M19.3 3.2 L17.1 3.0 L16.0 2.5 L14.6 1.2 L14.2 1.2 L13.6 1.6 L13.6 2.3 L14.0 2.7 L13.8 3.2 L12.5 4.5 L10.7 5.4 L8.3 5.4 L8.2 5.2 L8.2 3.9 L7.8 3.6 L7.2 3.6 L6.7 4.1 L6.7 4.7 L6.1 6.0 L5.6 6.7 L4.5 7.6 L2.8 8.3 L1.0 8.3 L0.8 8.2 L0.3 8.2 L-0.6 7.6 L-1.0 7.6 L-1.0 8.0 L-0.5 9.1 L0.3 9.6 L1.2 9.6 L1.4 9.8 L3.0 9.6 L3.6 10.2 L4.7 12.0 L6.5 13.5 L6.9 14.0 L7.2 14.0 L8.2 13.3 L8.2 12.7 L7.1 12.2 L5.4 10.5 L4.7 9.2 L5.6 8.7 L7.4 6.7 L8.2 6.7 L8.3 6.9 L10.5 6.9 L10.7 6.7 L12.0 6.5 L14.0 5.2 L15.3 3.8 L17.7 4.7 L19.1 4.7Z M5.2 -4.7 L4.1 -6.1 L2.5 -7.2 L0.8 -7.8 L-1.4 -7.8 L-1.6 -7.6 L-2.1 -7.6 L-4.3 -6.5 L-5.4 -5.4 L-6.3 -3.9 L-8.7 -3.9 L-10.3 -3.4 L-11.3 -2.8 L-12.4 -1.9 L-13.1 -1.0 L-14.2 1.2 L-14.2 1.6 L-13.6 1.6 L-13.1 1.9 L-12.7 1.9 L-12.2 0.3 L-10.5 -1.6 L-9.6 -2.1 L-8.5 -2.5 L-7.4 -2.5 L-7.2 -2.7 L-7.1 -2.5 L-6.0 -2.5 L-4.5 -1.7 L-3.8 -1.9 L-3.6 -2.8 L-4.5 -3.4 L-4.7 -3.9 L-3.0 -5.6 L-1.4 -6.3 L0.8 -6.3 L2.7 -5.4 L4.1 -3.8 L4.9 -3.8 L5.2 -4.3Z M19.0 -8.2 L17.1 -8.0 L16.0 -7.6 L15.3 -7.1 L15.3 -6.3 L15.7 -6.0 L16.2 -6.0 L17.9 -6.7 L19.1 -6.7Z M-7.6 -13.1 L-8.5 -13.3 L-8.7 -13.1 L-9.4 -13.1 L-10.5 -12.5 L-11.6 -11.4 L-12.2 -10.3 L-12.2 -9.8 L-12.7 -9.4 L-14.2 -9.4 L-15.1 -9.1 L-15.8 -9.4 L-17.5 -9.6 L-17.7 -9.8 L-18.6 -9.8 L-19.0 -9.6 L-19.0 -8.3 L-17.5 -8.3 L-16.8 -8.0 L-17.9 -5.8 L-17.9 -3.6 L-17.3 -2.3 L-16.4 -2.3 L-16.2 -2.5 L-16.4 -5.6 L-15.7 -6.9 L-14.7 -7.6 L-14.0 -8.0 L-12.5 -8.2 L-11.1 -7.6 L-10.5 -7.1 L-9.6 -7.1 L-9.2 -7.4 L-9.4 -8.2 L-10.9 -9.2 L-10.7 -10.2 L-9.8 -11.3 L-8.5 -11.8 L-7.6 -11.8 L-7.2 -12.2 L-7.2 -12.7Z M-12.9 -14.9 L-12.9 -14.6 L-12.5 -14.6 L-12.0 -14.2 L-11.3 -14.2 L-10.9 -14.6 L-10.9 -15.1 L-11.4 -15.7 L-12.2 -15.7Z M-5.2 -17.1 L-5.8 -15.7 L-5.8 -14.6 L-5.4 -14.2 L-4.9 -14.2 L-4.5 -14.4 L-4.3 -14.7 L-4.3 -15.7 L-3.9 -16.4 L-3.9 -16.9Z M4.5 -17.7 L3.0 -17.9 L2.7 -17.5 L1.9 -16.2 L1.6 -14.9 L0.1 -14.0 L-1.4 -12.4 L-1.9 -11.1 L-1.9 -10.2 L-1.7 -10.0 L-0.8 -10.0 L0.1 -12.0 L1.0 -12.9 L2.5 -13.6 L4.3 -13.6 L6.1 -12.7 L6.9 -12.0 L7.8 -9.8 L8.2 -9.6 L9.1 -9.6 L10.3 -9.1 L11.6 -7.8 L12.2 -6.5 L12.2 -4.7 L11.6 -3.4 L10.3 -2.1 L9.2 -1.6 L7.1 -1.6 L6.1 -2.1 L5.4 -2.1 L5.0 -1.7 L4.9 -0.8 L4.1 0.3 L3.4 1.0 L1.7 1.9 L-0.5 2.1 L-1.7 1.7 L-2.1 1.4 L-2.8 1.4 L-3.2 1.7 L-3.0 2.7 L-1.2 3.4 L0.6 3.6 L0.8 3.4 L1.7 3.4 L2.8 3.0 L4.1 2.3 L5.4 1.0 L6.1 -0.3 L9.1 -0.1 L10.3 -0.5 L11.1 -0.8 L12.4 -1.9 L12.9 -2.7 L13.5 -3.9 L13.5 -4.5 L13.6 -4.7 L13.6 -6.5 L13.3 -7.8 L12.4 -9.2 L10.7 -10.5 L8.9 -11.1 L8.0 -12.9 L6.7 -14.2 L5.0 -14.9 L3.4 -15.1 L3.2 -15.3 L3.6 -16.2 L4.5 -17.3Z" fill="#2a0f45" fill-opacity="0.6" fill-rule="evenodd"/>' +
          '<ellipse cx="-12" cy="-12" rx="5" ry="2.6" transform="rotate(-30 -12 -12)" fill="#ffffff" fill-opacity="0.4"/>';
      }
      if (i === 1) {
        /* Herz mit Glanz und Pulslinie */
        icon = '<path d="M0 20 C-30 2 -20 -24 0 -10 C20 -24 30 2 0 20 Z" fill="' + g + '"/>' +
          '<ellipse cx="-10" cy="-8" rx="5" ry="3" transform="rotate(-35 -10 -8)" fill="#ffffff" fill-opacity="0.55"/>' +
          '<path d="M-18 2 H-8 L-4 -6 L1 9 L5 -2 H18" fill="none" stroke="#2a0f45" stroke-opacity="0.6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
      }
      if (i === 2) {
        /* Zielscheibe mit Pfeil */
        icon = '<circle r="21" fill="none" stroke="' + s + '" stroke-opacity="0.45" stroke-width="1.2"/>' +
          '<circle r="16" fill="' + g + '" fill-opacity="0.35"/><circle r="16" fill="none" stroke="' + s + '" stroke-width="1.6"/>' +
          '<circle r="9" fill="' + g + '"/><circle r="3.5" fill="#ffffff"/>' +
          '<path d="M22 -22 L3 -3" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" marker-end="url(#emA)"/>' +
          '<path d="M22 -22 l2 -6 M22 -22 l6 -2 M18 -18 l2 -6 M18 -18 l6 -2" stroke="' + s + '" stroke-width="1.6" stroke-linecap="round"/>';
      }
      out += '<g style="filter:drop-shadow(0 0 10px ' + s + '55)"><circle cx="' + x + '" cy="' + y + '" r="34" fill="url(#emB' + i + ')" stroke="' + s + '" stroke-width="1.4"/></g>' +
        '<g transform="translate(' + x + ' ' + y + ')" style="filter:drop-shadow(0 0 5px ' + s + '88)">' + icon + '</g>' +
        t(x, y + 54, c[1], 10, 900, s) + t(x, y + 67, c[2], 8.5, 700, MUTED);
    });
    return svg('<defs>' + defs + '</defs>' + out, "10 30 300 126");
  }

  /* Emotionsregulation: Irritation → leuchtender Bus mit Passagieren → Reaktion */
  function bus() {
    var Y = "#F9CE1F", O = "#F9851F", L = "#b794e8", defs =
      '<marker id="bsA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="' + LIME + '"/></marker>' +
      '<linearGradient id="bsBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe98a"/><stop offset="0.45" stop-color="' + Y + '"/><stop offset="1" stop-color="' + O + '"/></linearGradient>' +
      '<linearGradient id="bsGl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a1d5c"/><stop offset="1" stop-color="#160a26"/></linearGradient>' +
      '<linearGradient id="bsShine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="bsBeam" cx="0" cy="0.5" r="1"><stop offset="0" stop-color="#fff6c8" stop-opacity="0.7"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient>';
    var out = '';
    /* Pfeile */
    out += '<path d="M12 106 H58" fill="none" stroke="' + LIME + '" stroke-width="1.6" marker-end="url(#bsA)"/>' + t(35, 96, "Irritation", 9.5, 800, LIME) +
      '<path d="M262 106 H308" fill="none" stroke="' + LIME + '" stroke-width="1.6" marker-end="url(#bsA)"/>' + t(285, 96, "Reaktion", 9.5, 800, LIME);
    /* Fahrtlinien hinten */
    out += '<path d="M58 76 h10 M60 86 h8 M58 124 h10" stroke="' + Y + '" stroke-opacity="0.5" stroke-width="1.4" stroke-linecap="round"/>';
    /* Scheinwerferkegel */
    out += '<path d="M246 110 L276 98 L276 124 Z" fill="url(#bsBeam)"/>';
    /* Schatten */
    out += '<ellipse cx="158" cy="146" rx="88" ry="5" fill="#000" fill-opacity="0.35"/>';
    /* Karosserie */
    out += '<g style="filter:drop-shadow(0 0 12px ' + O + '66)">' +
      '<path d="M72 136 V74 Q72 58 88 58 H224 Q238 58 243 72 L250 98 Q252 104 252 110 V136 Z" fill="url(#bsBody)"/>' +
      '<path d="M76 70 Q76 62 88 62 H222 Q232 62 236 70 Z" fill="url(#bsShine)"/>' +
      '<rect x="72" y="114" width="180" height="4" fill="' + O + '" fill-opacity="0.8"/>' +
      '<rect x="72" y="120" width="180" height="1.4" fill="#ffffff" fill-opacity="0.35"/></g>';
    /* Fenster mit Passagieren */
    var P = [L, AQUA, "#ff7af8"];
    for (var i = 0; i < 3; i++) {
      var x = 82 + i * 36;
      out += '<rect x="' + x + '" y="68" width="30" height="34" rx="6" fill="url(#bsGl)" stroke="#fff3b0" stroke-opacity="0.6" stroke-width="1"/>' +
        '<g style="filter:drop-shadow(0 0 4px ' + P[i] + ')"><circle cx="' + (x + 15) + '" cy="81" r="5.5" fill="' + P[i] + '"/><path d="M' + (x + 6) + ' 102 Q' + (x + 15) + ' 86 ' + (x + 24) + ' 102 Z" fill="' + P[i] + '"/></g>' +
        '<path d="M' + (x + 4) + ' 72 L' + (x + 12) + ' 72 L' + (x + 4) + ' 84 Z" fill="#ffffff" fill-opacity="0.18"/>';
    }
    /* Fahrerfenster + du am Steuer */
    out += '<path d="M192 68 H228 Q231 68 232 71 L240 102 H192 Z" fill="url(#bsGl)" stroke="#fff3b0" stroke-opacity="0.6" stroke-width="1"/>' +
      '<g style="filter:drop-shadow(0 0 6px ' + LIME + ')"><circle cx="208" cy="81" r="5.5" fill="' + LIME + '"/><path d="M199 102 Q208 86 217 102 Z" fill="' + LIME + '"/>' +
      '<circle cx="222" cy="92" r="5.5" fill="none" stroke="' + LIME + '" stroke-width="1.6"/><path d="M222 86.5 V97.5 M216.5 92 H227.5" stroke="' + LIME + '" stroke-width="0.8"/></g>' +
      '<path d="M196 72 L204 72 L196 84 Z" fill="#ffffff" fill-opacity="0.18"/>';
    /* Tür-/Detaillinien, Scheinwerfer, Rücklicht */
    out += '<rect x="246" y="104" width="6" height="7" rx="2" fill="#fffbe0" style="filter:drop-shadow(0 0 5px #fff6c8)"/>' +
      '<rect x="72" y="104" width="4" height="8" rx="1.5" fill="#ff5a5a"/>';
    /* Räder */
    [102, 218].forEach(function (cx) {
      out += '<circle cx="' + cx + '" cy="136" r="12" fill="#1a1029" stroke="' + Y + '" stroke-width="2"/>' +
        '<circle cx="' + cx + '" cy="136" r="6" fill="none" stroke="#ffe98a" stroke-opacity="0.7" stroke-width="1"/>' +
        '<circle cx="' + cx + '" cy="136" r="2.6" fill="' + Y + '"/>';
    });
    /* Beschriftung du am Steuer */
    out += '<path d="M208 74 L236 46" fill="none" stroke="' + LIME + '" stroke-opacity="0.7" stroke-width="0.9"/>' +
      '<circle cx="208" cy="74" r="2.2" fill="' + INK + '" stroke="#fff" stroke-width="1"/><circle cx="236" cy="46" r="1.5" fill="' + LIME + '"/>' +
      t(240, 49.5, "du am Steuer", 9, 800, LIME, "start");
    return svg('<defs>' + defs + '</defs>' + out, "6 34 308 120");
  }

  /* Systemtheorie: Schiebepuzzle, ein Feld fehlt, ein Teil ist in Bewegung */
  function puzzle() {
    var cols = [AQUA, "#b794e8", "#ff7af8", LIME, AQUA, "#b794e8", "#ff7af8", LIME], out = "", k = 0, sz = 40, g = 4, x0 = 98, y0 = 34;
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      if (r === 2 && c === 2) continue;
      var mov = r === 2 && c === 1, x = x0 + c * (sz + g) + (mov ? 14 : 0), y = y0 + r * (sz + g), col = cols[k++];
      out += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" rx="7" fill="' + (mov ? col : "#220736") + '" fill-opacity="' + (mov ? 0.9 : 1) + '" stroke="' + col + '" stroke-opacity="' + (mov ? 1 : 0.55) + '" stroke-width="1.2"/>' +
        '<circle cx="' + (x + sz / 2) + '" cy="' + (y + sz / 2) + '" r="5" fill="' + (mov ? INK : col) + '" fill-opacity="' + (mov ? 0.5 : 0.6) + '"/>';
    }
    out += '<defs><marker id="pzA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="' + LIME + '"/></marker></defs>' +
      '<rect x="' + (x0 - 6) + '" y="' + (y0 - 6) + '" width="' + (3 * sz + 2 * g + 12) + '" height="' + (3 * sz + 2 * g + 12) + '" rx="12" fill="none" stroke="rgba(246,244,251,0.25)" stroke-width="1"/>' +
      '<path d="M' + (x0 + sz + g + 6) + ' ' + (y0 + 2 * (sz + g) + sz + 16) + ' h16" stroke="' + LIME + '" stroke-width="1.4" stroke-linecap="round" marker-end="url(#pzA)"/>';
    return svg(out, "40 22 240 162");
  }

  /* Persönlichkeit: Silhouette, in fünf Splitter zerlegt – Motive, Annahmen, Schemata, Normen, Regeln */
  function persoenlichkeit() {
    var BUST = "M98 172 C98 130 122 112 160 112 C198 112 222 130 222 172 Z",
      P = [
        { n: "Motive",   c: "#ff7af8", dx: 0,  dy: -6, head: true, ax: 182, ay: 62,  lx: 244, ly: 52 },
        { n: "Annahmen", c: "#b794e8", dx: -6, dy: -3, clip: "90,100 160,100 160,143 90,149",  ax: 128, ay: 130, lx: 76, ly: 112 },
        { n: "Schemata", c: AQUA,      dx: 6,  dy: -3, clip: "160,100 230,100 230,137 160,143", ax: 192, ay: 128, lx: 244, ly: 112 },
        { n: "Normen",   c: LIME,      dx: -6, dy: 4,  clip: "90,149 160,143 160,180 90,180",  ax: 124, ay: 160, lx: 76, ly: 168 },
        { n: "Regeln",   c: "#F9CE1F", dx: 6,  dy: 4,  clip: "160,143 230,137 230,180 160,180", ax: 196, ay: 158, lx: 244, ly: 168 }
      ], defs = "", out = "";
    out += '<circle cx="160" cy="110" r="78" fill="none" stroke="rgba(246,244,251,0.12)" stroke-width="1" stroke-dasharray="2 5"/>' +
      '<circle cx="160" cy="110" r="62" fill="url(#psAura)"/>';
    defs += '<radialGradient id="psAura"><stop offset="0" stop-color="#b794e8" stop-opacity="0.28"/><stop offset="1" stop-color="#b794e8" stop-opacity="0"/></radialGradient>';
    P.forEach(function (p, i) {
      defs += '<linearGradient id="psG' + i + '" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.35" stop-color="' + p.c + '"/><stop offset="1" stop-color="' + p.c + '" stop-opacity="0.55"/></linearGradient>';
      var shape;
      if (p.head) shape = '<circle cx="160" cy="76" r="27" fill="url(#psG' + i + ')" stroke="' + p.c + '" stroke-width="1.2"/>';
      else {
        defs += '<clipPath id="psC' + i + '"><polygon points="' + p.clip + '"/></clipPath>';
        shape = '<g clip-path="url(#psC' + i + ')"><path d="' + BUST + '" fill="url(#psG' + i + ')" stroke="' + p.c + '" stroke-width="2.4"/></g>';
      }
      out += '<g transform="translate(' + p.dx + ' ' + p.dy + ')" style="filter:drop-shadow(0 0 6px ' + p.c + '66)">' + shape + '</g>';
      var ax = p.ax + p.dx, ay = p.ay + p.dy, left = p.lx < 160, ex = p.lx + (left ? 6 : -6);
      out += '<path d="M' + ax + ' ' + ay + ' L' + ex + ' ' + p.ly + '" fill="none" stroke="' + p.c + '" stroke-opacity="0.7" stroke-width="0.9"/>' +
        '<circle cx="' + ax + '" cy="' + ay + '" r="2.6" fill="' + INK + '" stroke="#fff" stroke-width="1.2"/>' +
        '<circle cx="' + ex + '" cy="' + p.ly + '" r="1.6" fill="' + p.c + '"/>' +
        t(p.lx + (left ? 0 : 4), p.ly + 3.5, p.n, 10, 900, p.c, left ? "end" : "start");
    });
    return svg('<defs>' + defs + '</defs>' + out, "6 28 308 156");
  }

  var MAP = { felder: felder, stile: stile, eskalation: eskalation, checkliste: checkliste, uebung: uebung, playlist: playlist, buecher: buecher, fuehrung: fuehrung, harvard: harvard, batna: batna, leaf: leaf, sages: sages, ablauf: ablauf, reflexion: reflexion, thermo: thermo, eisberg: eisberg, empathie: empathie, bus: bus, puzzle: puzzle, persoenlichkeit: persoenlichkeit };
  window.GRAFIK_FARBE = function (c, n, i) {
    if (c.kategorie === "eskalation" && n) return ["#35B680", "#F9851F", "#f4005e"][Math.min(2, Math.floor((n - 1) / 3))];
    if (c.grafik === "uebung:1") return "#f4005e";
    if (c.grafik === "uebung:2") return AQUA;
    if (/^sages/.test(c.grafik || "") && i != null) return i < 3 ? "#b794e8" : AQUA;
    if (/^leaf/.test(c.grafik || "")) return LIME;
    if (c.kategorie === "reflexion") return PAPER;
    return null;
  };
  /* Einheitlicher Look: flache Farbflächen bekommen Glanzverlauf + Leuchten, dunkle Flächen werden getöntes Glas */
  var DARKS = /^#(220736|2d1e4a|1a1029|231639|0c0814|170a28)$/i, POLISH = /^(checkliste|uebung|felder|stile|playlist|buecher|fuehrung|eskalation|harvard|batna|leaf|sages|ablauf|thermo|puzzle)$/;
  function mix(hex, to, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, T = to ? 255 : 0;
    r = Math.round(r + (T - r) * k); g = Math.round(g + (T - g) * k); b = Math.round(b + (T - b) * k);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function polish(s) {
    var defs = {}, cnt = 0;
    s = s.replace(/<(rect|circle|ellipse|path|polygon)\b([^>]*?)(\/?)>/g, function (m, tag, attrs, sl) {
      var fm = attrs.match(/\sfill="(#[0-9a-fA-F]{6})"/); if (!fm) return m;
      var c = fm[1].toLowerCase(), sm = attrs.match(/\sstroke="(#[0-9a-fA-F]{6})"/), id;
      if (c === "#ffffff" || c === "#f6f4fb") return m;
      if (DARKS.test(c)) {
        if (!sm) return m;
        var sc = sm[1].toLowerCase(); id = "pd" + sc.slice(1);
        defs[id] = '<linearGradient id="' + id + '" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0" stop-color="' + sc + '" stop-opacity="0.26"/><stop offset="1" stop-color="#1a1029" stop-opacity="0.92"/></linearGradient>';
        return "<" + tag + attrs.replace(fm[0], ' fill="url(#' + id + ')"') + sl + ">";
      }
      id = "pg" + c.slice(1);
      defs[id] = '<linearGradient id="' + id + '" x1="0" y1="0" x2="0.45" y2="1"><stop offset="0" stop-color="' + mix(c, 1, 0.5) + '"/><stop offset="0.45" stop-color="' + c + '"/><stop offset="1" stop-color="' + mix(c, 0, 0.28) + '"/></linearGradient>';
      var big = true, w = attrs.match(/\swidth="([\d.]+)"/), r = attrs.match(/\sr="([\d.]+)"/);
      if ((w && +w[1] < 10) || (r && +r[1] < 5)) big = false;
      var out = attrs.replace(fm[0], ' fill="url(#' + id + ')"');
      if (big && !/\sstyle=/.test(out) && !/\sfilter=/.test(out) && cnt++ < 24) out += ' style="filter:drop-shadow(0 0 6px ' + c + '70)"';
      return "<" + tag + out + sl + ">";
    });
    var d = Object.keys(defs).map(function (k) { return defs[k]; }).join("");
    return d ? s.replace(/(<svg[^>]*>)/, "$1<defs>" + d + "</defs>") : s;
  }
  window.GRAFIK = function (spec) {
    if (!spec) return "";
    var p = String(spec).split(":"), fn = MAP[p[0]];
    if (!fn) return "";
    var out = fn(p[1] ? parseInt(p[1], 10) : 0);
    return POLISH.test(p[0]) ? polish(out) : out;
  };
})();
