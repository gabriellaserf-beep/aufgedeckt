/*
  Grafiken für die Karten (eigene Zeichnungen in den pub.tech-Farben).
  In cards.js wählt "grafik" die Zeichnung, z. B. "felder:2" oder "stile:4".
*/
(function () {
  var INK = "#231639", PAPER = "#f6f4fb", MUTED = "#b3a8cf", LINE = "rgba(246,244,251,0.18)", AQUA = "#59d5dc", LIME = "#b5fd42";
  var F = 'font-family="Overpass, system-ui, sans-serif"';
  function svg(inner) { return '<svg class="grafik" viewBox="0 0 320 200" role="img" aria-hidden="true" ' + F + '>' + inner + "</svg>"; }
  function t(x, y, s, size, w, fill, anchor, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" font-weight="' + (w || 800) + '" fill="' + (fill || PAPER) + '" text-anchor="' + (anchor || "middle") + '" ' + (extra || "") + ">" + s + "</text>";
  }
  function lines(x, y, arr, size, w, fill, lh) { return arr.map(function (s, i) { return t(x, y + i * (lh || size * 1.15), s, size, w, fill); }).join(""); }
  function dim(on) { return on ? 1 : 0.2; }

  /* Konfliktfelder: Kreis mit vier Feldern und Konflikt-Stern in der Mitte */
  function felder(a) {
    var cx = 160, cy = 100, r = 96;
    var Q = [
      { n: ["Struktur"], c: "#0DADF2", d: "M" + cx + " " + cy + " L" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + cx + " " + (cy - r) + "Z", lx: cx - 46, ly: cy - 46 },
      { n: ["Inhalte"], c: "#F471DE", d: "M" + cx + " " + cy + " L" + cx + " " + (cy - r) + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy + "Z", lx: cx + 46, ly: cy - 46 },
      { n: ["Zwischen-", "menschlich"], c: "#35B680", d: "M" + cx + " " + cy + " L" + cx + " " + (cy + r) + " A" + r + " " + r + " 0 0 1 " + (cx - r) + " " + cy + "Z", lx: cx - 46, ly: cy + 42 },
      { n: ["Individuell"], c: "#F9851F", d: "M" + cx + " " + cy + " L" + (cx + r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + cx + " " + (cy + r) + "Z", lx: cx + 46, ly: cy + 50 }
    ];
    var order = [0, 1, 2, 3]; // Teil 1..4 = Struktur, Inhalte, Zwischenmenschlich, Individuell
    var out = Q.map(function (q, i) {
      var on = !a || a === order[i] + 1;
      return '<path d="' + q.d + '" fill="' + q.c + '" fill-opacity="' + (on ? 0.95 : 0.16) + '" stroke="#1a1029" stroke-width="2"/>' +
        lines(q.lx, q.ly, q.n, 10, 900, on ? INK : MUTED, 12);
    }).join("");
    var pts = [];
    for (var i = 0; i < 24; i++) { var rr = i % 2 ? 17 : 28, an = (i / 24) * Math.PI * 2 - Math.PI / 2; pts.push((cx + Math.cos(an) * rr * 1.25).toFixed(1) + "," + (cy + Math.sin(an) * rr * 0.9).toFixed(1)); }
    out += '<polygon points="' + pts.join(" ") + '" fill="' + PAPER + '" stroke="#1a1029" stroke-width="2.5"/>' + t(cx, cy + 4, "Konflikt", 11, 900, INK);
    return svg(out);
  }

  /* Konfliktstile: Matrix aus Kooperationswille und Konfrontationsbereitschaft */
  function stile(a) {
    var x0 = 84, y0 = 12, w = 104, h = 76, g = 4;
    var Q = [
      { k: 1, n: ["Vermeiden"], c: "#3e768a", x: x0, y: y0 + h + g },
      { k: 2, n: ["Entgegen-", "kommen"], c: "#9F9FF4", x: x0, y: y0 },
      { k: 3, n: ["Konfron-", "tieren"], c: "#F9851F", x: x0 + w + g, y: y0 + h + g },
      { k: 4, n: ["Koope-", "rieren"], c: LIME, x: x0 + w + g, y: y0 }
    ];
    var out = Q.map(function (q) {
      var on = !a || a === q.k;
      return '<rect x="' + q.x + '" y="' + q.y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + q.c + '" fill-opacity="' + (on ? 0.95 : 0.14) + '"/>' +
        lines(q.x + w / 2, q.y + h / 2 + (q.n.length > 1 ? -2 : 5), q.n, 13, 900, on ? INK : MUTED, 14);
    }).join("");
    var axX = x0 - 12, axY = y0 + 2 * h + g + 12;
    out += '<path d="M' + axX + " " + (axY) + " V" + (y0 - 2) + '" stroke="' + AQUA + '" stroke-width="2" marker-end="url(#ar)"/>' +
      '<path d="M' + axX + " " + axY + " H" + (x0 + 2 * w + g + 10) + '" stroke="' + AQUA + '" stroke-width="2" marker-end="url(#ar)"/>' +
      '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="' + AQUA + '"/></marker></defs>' +
      t(axX - 10, y0 + h + g / 2, "Kooperation", 10, 700, MUTED, "middle", 'transform="rotate(-90 ' + (axX - 10) + " " + (y0 + h + g / 2) + ')"') +
      t(x0 + w + g / 2, axY + 16, "Konfrontation", 10, 700, MUTED);
    return svg(out);
  }

  /* Eskalation: neun Stufen abwärts, drei Phasen */
  function eskalation(p) {
    var cols = ["#35B680", "#F9851F", "#f4005e"], out = "";
    for (var i = 0; i < 9; i++) {
      var ph = Math.floor(i / 3), on = !p || p === ph + 1;
      var x = 14 + i * 32, y = 14 + i * 17;
      out += '<rect x="' + x + '" y="' + y + '" width="44" height="22" rx="5" fill="' + cols[ph] + '" fill-opacity="' + (on ? 0.95 : 0.15) + '"/>' +
        t(x + 22, y + 16, String(i + 1), 13, 900, on ? INK : MUTED);
    }
    var labels = [["gemeinsam", "lösen"], ["gewinnen &", "verlieren"], ["alle", "verlieren"]];
    labels.forEach(function (l, k) {
      var on = !p || p === k + 1;
      out += lines([60, 155, 255][k], [100, 168, 30][k] + (k === 2 ? 0 : 0), l, 11, 800, on ? cols[k] : "rgba(179,168,207,0.45)", 12);
    });
    return svg(out);
  }

  /* Checkliste: große Ziffer mit zehn Segmenten */
  function checkliste(n) {
    var cx = 160, cy = 100, r = 72, out = "";
    if (!n) {
      return svg('<text x="160" y="178" font-size="220" font-weight="900" fill="url(#pq)" text-anchor="middle">“</text>' +
        '<defs><linearGradient id="pq" x1="0" x2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient></defs>');
    }
    for (var i = 0; i < 10; i++) {
      var a0 = (i / 10) * Math.PI * 2 - Math.PI / 2 + 0.06, a1 = ((i + 1) / 10) * Math.PI * 2 - Math.PI / 2 - 0.06;
      var d = "M" + (cx + Math.cos(a0) * r).toFixed(1) + " " + (cy + Math.sin(a0) * r).toFixed(1) + " A" + r + " " + r + " 0 0 1 " + (cx + Math.cos(a1) * r).toFixed(1) + " " + (cy + Math.sin(a1) * r).toFixed(1);
      out += '<path d="' + d + '" fill="none" stroke="' + (i < n ? "url(#pr)" : LINE) + '" stroke-width="' + (i === n - 1 ? 12 : 8) + '" stroke-linecap="round"/>';
    }
    out += '<defs><linearGradient id="pr" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="' + LIME + '"/><stop offset="1" stop-color="' + AQUA + '"/></linearGradient></defs>' +
      t(cx, cy + 22, (n < 10 ? "0" : "") + n, 62, 900, "url(#pr)") + t(cx, cy + 44, "von 10", 11, 700, MUTED);
    return svg(out);
  }

  /* Übung: CRASH sackt ab, COACH richtet sich auf, Pendel zwischen beiden */
  function uebung(k) {
    var out = "";
    if (k === 1 || k === 2) {
      var word = k === 1 ? "CRASH" : "COACH", col = k === 1 ? "#f4005e" : AQUA;
      for (var i = 0; i < 5; i++) {
        var x = 40 + i * 60, y = k === 1 ? 80 + i * 18 : 150 - i * 20, rot = k === 1 ? 8 + i * 4 : 0;
        out += '<g transform="rotate(' + rot + " " + x + " " + y + ')"><rect x="' + (x - 24) + '" y="' + (y - 34) + '" width="48" height="48" rx="12" fill="' + col + '" fill-opacity="' + (k === 1 ? 0.25 + i * 0.12 : 0.9) + '"/>' +
          t(x, y + 2, word[i], 32, 900, k === 1 ? PAPER : INK) + "</g>";
      }
      return svg(out);
    }
    out += '<circle cx="78" cy="100" r="52" fill="#f4005e" fill-opacity="0.22" stroke="#f4005e" stroke-width="2"/>' + t(78, 106, "CRASH", 17, 900, PAPER) +
      '<circle cx="242" cy="100" r="52" fill="' + AQUA + '" fill-opacity="0.9"/>' + t(242, 106, "COACH", 17, 900, INK) +
      '<path d="M128 78 Q160 52 192 78" fill="none" stroke="' + LIME + '" stroke-width="3" marker-end="url(#pa)"/>' +
      '<path d="M192 122 Q160 148 128 122" fill="none" stroke="' + LIME + '" stroke-width="3" marker-end="url(#pa)"/>' +
      '<defs><marker id="pa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="' + LIME + '"/></marker></defs>' +
      t(160, 106, "3×", 18, 900, LIME);
    return svg(out);
  }

  /* Playlist: Schallplatte mit Phasen-Nummer */
  function playlist(n) {
    var out = '<circle cx="120" cy="100" r="86" fill="#0c0814"/>';
    for (var r = 30; r < 84; r += 5) out += '<circle cx="120" cy="100" r="' + r + '" fill="none" stroke="rgba(246,244,251,' + (r % 10 ? 0.06 : 0.1) + ')" stroke-width="1"/>';
    out += '<path d="M60 40 A86 86 0 0 1 180 40" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="10" stroke-linecap="round"/>' +
      '<circle cx="120" cy="100" r="28" fill="#F471DE"/>' +
      t(120, 95, "PHASE", 7, 800, INK, "middle", 'letter-spacing="1"') + t(120, 114, String(n || ""), 20, 900, INK);
    for (var i = 0; i < 6; i++) {
      var on = i + 1 === n, h = [22, 38, 30, 46, 26, 34][i];
      out += '<rect x="' + (232 + i * 13) + '" y="' + (150 - h) + '" width="8" height="' + h + '" rx="4" fill="' + (on ? "#F471DE" : "rgba(244,113,222,0.25)") + '"/>';
    }
    out += t(266, 170, "6 Phasen", 10, 700, MUTED);
    return svg(out);
  }

  /* Bücher: Regal mit drei Stufen */
  function buecher(level) {
    var out = '<rect x="30" y="168" width="260" height="6" rx="3" fill="rgba(246,244,251,0.25)"/>';
    var names = ["Einsteiger", "Erfahrene", "Profi"], hs = [80, 108, 136], cs = ["#F9CE1F", "#F9851F", "#F471DE"];
    for (var i = 0; i < 3; i++) {
      var on = !level || level === i + 1, x = 52 + i * 80, h = hs[i];
      out += '<rect x="' + x + '" y="' + (168 - h) + '" width="56" height="' + h + '" rx="6" fill="' + cs[i] + '" fill-opacity="' + (on ? 0.95 : 0.16) + '"/>' +
        '<rect x="' + (x + 8) + '" y="' + (168 - h + 12) + '" width="40" height="3" rx="1.5" fill="' + (on ? INK : MUTED) + '" fill-opacity="0.6"/>' +
        '<rect x="' + (x + 8) + '" y="' + (168 - h + 20) + '" width="28" height="3" rx="1.5" fill="' + (on ? INK : MUTED) + '" fill-opacity="0.6"/>' +
        t(x + 28, 190, names[i], 10, on ? 900 : 700, on ? PAPER : MUTED);
    }
    return svg(out);
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
    return svg(out);
  }

  var MAP = { felder: felder, stile: stile, eskalation: eskalation, checkliste: checkliste, uebung: uebung, playlist: playlist, buecher: buecher, fuehrung: fuehrung };
  window.GRAFIK = function (spec) {
    if (!spec) return "";
    var p = String(spec).split(":"), fn = MAP[p[0]];
    return fn ? fn(p[1] ? parseInt(p[1], 10) : 0) : "";
  };
})();
