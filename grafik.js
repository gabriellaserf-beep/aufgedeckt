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
  function felder(a) {
    var W = 134, H = 76, G = 8, x0 = 160 - W - G / 2, y0 = 18;
    var Q = [
      { n: "Struktur", c: "#0DADF2", x: x0, y: y0, top: true },
      { n: "Inhalte", c: "#F471DE", x: 160 + G / 2, y: y0, top: true },
      { n: "Zwischenmenschlich", c: "#35B680", x: x0, y: y0 + H + G, top: false },
      { n: "Individuell", c: "#F9851F", x: 160 + G / 2, y: y0 + H + G, top: false }
    ];
    var out = '<defs><linearGradient id="fpr" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient>' +
      '<filter id="fgl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter></defs>';
    Q.forEach(function (q, i) {
      var on = !a || a === i + 1;
      if (on && a) out += '<rect x="' + q.x + '" y="' + q.y + '" width="' + W + '" height="' + H + '" rx="16" fill="' + q.c + '" opacity="0.45" filter="url(#fgl)"/>';
      out += '<rect x="' + q.x + '" y="' + q.y + '" width="' + W + '" height="' + H + '" rx="16" fill="' + (on ? q.c : "#2d1e4a") + '" stroke="' + q.c + '" stroke-opacity="' + (on ? 1 : 0.55) + '" stroke-width="1.5"/>' +
        (function () {
          var left = q.x < 160, tx = left ? q.x + 16 : q.x + W - 16, parts = q.n === "Zwischenmenschlich" ? ["Zwischen-", "menschlich"] : [q.n];
          var ty = q.top ? q.y + 30 : q.y + H - 16 - (parts.length - 1) * 15;
          return parts.map(function (p, k) { return t(tx, ty + k * 15, p, 13, 900, on ? INK : q.c, left ? "start" : "end"); }).join("");
        })();
    });
    out += '<circle cx="160" cy="' + (y0 + H + G / 2) + '" r="34" fill="#1a1029"/>' +
      '<circle cx="160" cy="' + (y0 + H + G / 2) + '" r="28" fill="url(#fpr)"/>' + t(160, y0 + H + G / 2 + 4, "Konflikt", 10.5, 900, INK);
    return svg(out, "0 8 320 180");
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
      for (var k = 0; k <= i; k++) out += '<rect x="' + (x + 12 + k * 3.6) + '" y="' + (sy + 13 - (k + 1) * 2.6) + '" width="2.2" height="' + ((k + 1) * 2.6) + '" rx="0.8" fill="' + (on ? INK : MUTED) + '"/>';
      out += t(x + seg / 2 + 6, sy + 13.6, nm, 8.5, 900, on ? INK : MUTED);
    });
    return svg(out, "0 6 320 134");
  }

  /* Führung: zehn Schritte auf einem Weg */
  function fuehrung() {
    var out = '<path id="fw" d="M20 160 C 90 160, 70 40, 160 70 S 240 170, 300 40" fill="none" stroke="rgba(181,253,66,0.3)" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>';
    var P = [[20, 160], [52, 150], [78, 110], [104, 76], [140, 66], [176, 84], [206, 122], [238, 136], [270, 98], [300, 40]];
    P.forEach(function (p, i) {
      out += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 9 ? 15 : 12) + '" fill="' + (i === 9 ? LIME : "#2d1e4a") + '" stroke="' + LIME + '" stroke-width="2"/>' +
        t(p[0], p[1] + 4, String(i + 1), 11, 900, i === 9 ? INK : PAPER);
    });
    out += '<path d="M300 25 V8 L318 14 L300 20" fill="' + LIME + '" stroke="' + LIME + '" stroke-width="2" stroke-linejoin="round"/>';
    return svg('<g transform="translate(-8 22) scale(0.94 0.86)">' + out + '</g>');
  }

  /* Harvard-Methode: vier Prinzipien als verbundene Kreise */
  function harvard(n) {
    var L = "#b794e8", P = [["Menschen &", "Problem trennen"], ["Interessen", "statt Positionen"], ["Optionen", "für beide"], ["Objektive", "Kriterien"]], out = "";
    out += '<defs><radialGradient id="hvG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="' + L + '" stop-opacity="0.55"/><stop offset="1" stop-color="' + L + '" stop-opacity="0"/></radialGradient></defs>';
    out += '<path d="M46 84 H274" fill="none" stroke="rgba(183,148,232,0.4)" stroke-width="1.2" stroke-linecap="round"/>';
    P.forEach(function (p, i) {
      var x = 46 + i * 76, on = !n || n === i + 1, act = n === i + 1;
      if (act) out += '<circle cx="' + x + '" cy="84" r="34" fill="url(#hvG)"/>';
      out += '<circle cx="' + x + '" cy="84" r="' + (act ? 19 : 16) + '" fill="' + (act ? L : "#220736") + '" stroke="' + L + '" stroke-opacity="' + (on ? 1 : 0.5) + '" stroke-width="' + (act ? 0 : 1.2) + '"/>' +
        t(x, 84 + (act ? 6 : 5), String(i + 1), act ? 16 : 13, 900, act ? INK : (on ? L : MUTED)) +
        lines(x, 124, p, 8.5, act ? 900 : 700, act ? PAPER : MUTED, 10.5);
    });
    out += t(160, 168, "hart in der Sache", 9, 700, MUTED, "end") + '<circle cx="166" cy="165" r="1.6" fill="' + MUTED + '"/>' + t(172, 168, "fair zu den Menschen", 9, 700, MUTED, "start");
    return svg(out, "0 44 320 134");
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
    var out = "";
    [[-6, 70, 64], [3, 160, 56], [-3, 250, 66]].forEach(function (p, i) {
      var on = !n || n === i + 1, w = 74, h = 62;
      out += '<g transform="rotate(' + p[0] + " " + p[1] + " " + p[2] + ')">' +
        '<rect x="' + (p[1] - w / 2) + '" y="' + (p[2] - h / 2) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + (on ? PAPER : "#2d1e4a") + '" stroke="' + PAPER + '" stroke-opacity="' + (on ? 1 : 0.45) + '" stroke-width="1.5"/>' +
        t(p[1], p[2] + 16, "?", 46, 900, on ? INK : "rgba(246,244,251,0.55)") + "</g>";
    });
    out += '<defs><linearGradient id="rfl" x1="0" x2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient></defs>' +
      '<path d="M40 112 H280" stroke="url(#rfl)" stroke-width="2" stroke-linecap="round" opacity="0.7"/>';
    return svg(out, "0 18 320 100");
  }

  /* Boxenstop: Thermometer 1–10, quer liegend */
  function thermo() {
    var out = '<defs><linearGradient id="th" x1="0" x2="1"><stop offset="0" stop-color="#f4005e"/><stop offset="0.45" stop-color="#F9851F"/><stop offset="0.75" stop-color="' + AQUA + '"/><stop offset="1" stop-color="' + LIME + '"/></linearGradient></defs>' +
      '<rect x="52" y="44" width="236" height="22" rx="11" fill="#1a1029" stroke="rgba(246,244,251,0.35)" stroke-width="1.5"/>' +
      '<circle cx="44" cy="55" r="20" fill="#1a1029" stroke="rgba(246,244,251,0.35)" stroke-width="1.5"/>' +
      '<circle cx="44" cy="55" r="13" fill="#f4005e"/>' +
      '<rect x="44" y="49" width="244" height="12" rx="6" fill="url(#th)"/>';
    for (var i = 1; i <= 10; i++) { var x = 60 + (i - 1) * 24.5; out += '<path d="M' + x + ' 72 V80" stroke="' + MUTED + '" stroke-width="1.5"/>' + t(x, 96, String(i), 11, 900, PAPER); }
    return svg(out, "0 26 320 82");
  }

  var MAP = { felder: felder, stile: stile, eskalation: eskalation, checkliste: checkliste, uebung: uebung, playlist: playlist, buecher: buecher, fuehrung: fuehrung, harvard: harvard, batna: batna, leaf: leaf, sages: sages, ablauf: ablauf, reflexion: reflexion, thermo: thermo };
  window.GRAFIK_FARBE = function (c, n, i) {
    if (c.kategorie === "eskalation" && n) return ["#35B680", "#F9851F", "#f4005e"][Math.min(2, Math.floor((n - 1) / 3))];
    if (c.grafik === "uebung:1") return "#f4005e";
    if (c.grafik === "uebung:2") return AQUA;
    if (/^sages/.test(c.grafik || "") && i != null) return i < 3 ? "#b794e8" : AQUA;
    if (/^leaf/.test(c.grafik || "")) return LIME;
    if (c.kategorie === "reflexion") return PAPER;
    return null;
  };
  window.GRAFIK = function (spec) {
    if (!spec) return "";
    var p = String(spec).split(":"), fn = MAP[p[0]];
    return fn ? fn(p[1] ? parseInt(p[1], 10) : 0) : "";
  };
})();
