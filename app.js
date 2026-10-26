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

  /* ---------- Speichern ---------- */
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.cols && s.total === CARDS.length) return s; } } catch (e) {}
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- Neues Spiel: mischen und wie bei Patience austeilen ---------- */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function deal(notes) {
    var order = shuffle(CARDS.map(function (_, i) { return i; }));
    var cols = []; for (var c = 0; c < COLS; c++) cols.push([]);
    var r = 0, k = 0;
    while (k < order.length) {
      for (var col = r % COLS; col < COLS && k < order.length; col++) cols[col].push(order[k++]);
      r++;
    }
    return { total: CARDS.length, cols: cols, up: [], done: [], notes: notes || {} };
  }

  /* ---------- Hilfen ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function cat(i) { return CATS[CARDS[i].kategorie] || { name: "", bild: "", farbe: "#59d5dc" }; }
  function topOf(col) { return col.length ? col[col.length - 1] : null; }
  function isUp(i) { return state.up.indexOf(i) >= 0; }

  /* ---------- Darstellung ---------- */
  function backHTML() {
    return '<span class="face back"><span class="back__pills back__pills--t"><i></i><i></i><i></i></span><span class="back__mark">' + LOGO_SVG + '</span><span class="back__pills back__pills--b"><i></i><i></i><i></i></span></span>';
  }
  function frontHTML(i) {
    var k = cat(i);
    return '<span class="face front" style="--acc:' + k.farbe + '"><img src="' + esc(k.bild) + '" alt=""><span class="front__cat">' + esc(k.name) + "</span></span>";
  }

  function render() {
    var board = $("#board");
    board.innerHTML = "";
    state.cols.forEach(function (col, ci) {
      var el = document.createElement("div");
      el.className = "col";
      el.style.minHeight = "calc(var(--ch) + " + Math.max(0, col.length - 1) + " * var(--stack))";
      el.innerHTML = '<span class="col__slot" aria-hidden="true"></span>';
      col.forEach(function (idx, pos) {
        var top = pos === col.length - 1;
        var b = document.createElement(top ? "button" : "div");
        b.className = "card" + (top ? " is-playable" : "") + (top && isUp(idx) ? " is-up" : "");
        b.style.top = "calc(" + pos + " * var(--stack))";
        b.innerHTML = '<span class="card__inner">' + backHTML() + frontHTML(idx) + "</span>";
        if (top) {
          b.type = "button";
          b.dataset.idx = idx;
          b.setAttribute("aria-label", isUp(idx) ? "Aufgedeckte Karte: " + CARDS[idx].titel + " — öffnen" : "Verdeckte Karte in Spalte " + (ci + 1) + " aufdecken");
          b.addEventListener("click", function () { flip(idx, b); });
        } else {
          b.setAttribute("aria-hidden", "true");
        }
        el.appendChild(b);
      });
      board.appendChild(el);
    });

    var done = state.done.length, total = state.total;
    $("#track").style.transform = "scaleX(" + (total ? done / total : 0) + ")";
    $("#count").textContent = done + " von " + total + " Karten";
    var pile = $("#pile");
    pile.classList.toggle("has-cards", done > 0);
    if (done) pile.style.setProperty("--acc", cat(state.done[done - 1]).farbe);
    $("#pileText").textContent = done ? done + (done === 1 ? " Karte abgelegt" : " Karten abgelegt") : "Noch keine Karte abgelegt";
    $("#finish").hidden = done < total || total === 0;
    $("#board").hidden = done >= total && total > 0;
  }

  /* ---------- Aufdecken und Lesen ---------- */
  function flip(idx, el) {
    lastFocus = el;
    if (isUp(idx)) { openReader(idx); return; }
    state.up.push(idx); save();
    el.classList.add("is-up");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () { render(); openReader(idx); }, reduce ? 0 : 650);
  }

  function openReader(idx) {
    var c = CARDS[idx], k = cat(idx);
    var o = $("#reader");
    o.innerHTML =
      '<div class="reader" role="dialog" aria-modal="true" aria-labelledby="rtitle">' +
        '<article class="big" style="--acc:' + k.farbe + '">' +
          '<span class="big__no">' + (state.done.length + 1) + " / " + state.total + "</span>" +
          '<div class="big__media"><img src="' + esc(k.bild) + '" alt=""></div>' +
          '<span class="big__cat">' + esc(k.name) + (c.teil ? ' <span class="big__teil">· ' + esc(c.teil) + "</span>" : "") + "</span>" +
          '<h2 class="big__title" id="rtitle">' + esc(c.titel) + "</h2>" +
          (c.text ? '<p class="big__text">' + esc(c.text) + "</p>" : "") +
          (c.liste && c.liste.length ? '<ul class="big__list">' + c.liste.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
          (c.impuls ? '<p class="big__hint">' + esc(c.impuls) + "</p>" : "") +
        "</article>" +
        '<div class="notes">' +
          '<label class="notes__label" for="note">Deine Notizen</label>' +
          '<textarea id="note" placeholder="Schreib auf, was dir dazu einfällt. Nur du siehst das.">' + esc(state.notes[idx] || "") + "</textarea>" +
          '<p class="notes__meta">Wird nur in diesem Browser gespeichert.</p>' +
          '<div class="row">' +
            '<button class="btn btn--primary" type="button" id="done">Karte ablegen <span class="arr">→</span></button>' +
            '<button class="btn btn--outline" type="button" id="later">Später weiter</button>' +
          "</div>" +
        "</div>" +
      "</div>";
    o.hidden = false;
    var ta = $("#note", o);
    ta.addEventListener("input", function () { state.notes[idx] = ta.value; save(); });
    $("#done", o).addEventListener("click", function () { finishCard(idx); });
    $("#later", o).addEventListener("click", closeOverlays);
    setTimeout(function () { ta.focus({ preventScroll: true }); }, 50);
  }

  function finishCard(idx) {
    state.cols.forEach(function (col) { if (topOf(col) === idx) col.pop(); });
    state.up = state.up.filter(function (i) { return i !== idx; });
    state.done.push(idx);
    save();
    closeOverlays(true);
    render();
    var next = document.querySelector(".card.is-playable");
    if (next) next.focus({ preventScroll: true }); else $("#finish h2") && $("#finish h2").focus();
  }

  /* ---------- Notizen ansehen und herunterladen ---------- */
  function notesText() {
    var lines = ["Aufgedeckt — meine Notizen", new Date().toLocaleDateString("de-DE"), ""];
    state.done.concat(state.up).forEach(function (i) {
      var n = (state.notes[i] || "").trim();
      lines.push("■ " + cat(i).name + " — " + CARDS[i].titel);
      if (CARDS[i].text) lines.push(CARDS[i].text);
      (CARDS[i].liste || []).forEach(function (x) { lines.push("  – " + x); });
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
          return '<li style="--acc:' + cat(i).farbe + '"><span class="cat">' + esc(cat(i).name) + '</span><span class="t">' + esc(CARDS[i].titel) + '</span><span class="n">' + esc(state.notes[i] || "Keine Notiz") + "</span></li>";
        }).join("") + "</ul>" : '<p class="empty">Du hast noch keine Karte aufgedeckt. Tipp eine leuchtende Karte an, um zu starten.</p>') +
        '<p class="msg" id="msg" aria-live="polite"></p>' +
        '<div class="row"><button class="btn btn--secondary" type="button" id="dl"' + (ids.length ? "" : " disabled") + '>Notizen herunterladen</button>' +
        '<button class="btn btn--outline" type="button" id="close">Schließen</button></div>' +
      "</div>";
    o.hidden = false;
    $("#dl", o).addEventListener("click", function () { download($("#msg", o)); });
    $("#close", o).addEventListener("click", function () { closeOverlays(); });
    $("#ntitle", o).focus();
  }

  function askRestart() {
    lastFocus = document.activeElement;
    var o = $("#reader");
    o.innerHTML =
      '<div class="confirm" role="dialog" aria-modal="true" aria-labelledby="ctitle">' +
        '<h2 id="ctitle" tabindex="-1">Neu mischen?</h2>' +
        "<p>Alle Karten kommen zurück in die Auslage. Deine Notizen bleiben gespeichert.</p>" +
        '<div class="row"><button class="btn btn--primary" type="button" id="yes">Neu mischen <span class="arr">→</span></button>' +
        '<button class="btn btn--outline" type="button" id="no">Abbrechen</button></div>' +
      "</div>";
    o.hidden = false;
    $("#yes", o).addEventListener("click", function () { state = deal(state.notes); save(); closeOverlays(true); render(); });
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
    state = load() || deal();
    save();
    render();
    $("#notesBtn").addEventListener("click", openNotes);
    $("#pile").addEventListener("click", openNotes);
    $("#restartBtn").addEventListener("click", askRestart);
    $("#finishNotes").addEventListener("click", openNotes);
    $("#finishRestart").addEventListener("click", function () { state = deal(state.notes); save(); render(); });
    $("#reader").addEventListener("click", function (e) { if (e.target.id === "reader") closeOverlays(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#reader").hidden) closeOverlays(); });
    // In einer Claude-Vorschau: Downloads über die Plattform anbieten (auf GitHub Pages gibt es das nicht, dann normaler Download).
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("downloads").then(function (d) { if (d) window.__ptDownloads = d; }, function () {});
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
