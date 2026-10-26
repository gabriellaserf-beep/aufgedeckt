# Aufgedeckt – Fortschritt statt Sieg

Ein Kartenspiel von pub.tech über Konflikte: Man deckt Karten wie bei Patience auf und setzt sich mit dem Inhalt auseinander. Notizen bleiben nur im eigenen Browser und lassen sich als Textdatei herunterladen. Keine Datenbank, kein Login.

## Dateien

| Datei | Was drin ist |
|---|---|
| `index.html` | Die Seite |
| `style.css` | Aussehen (Farben und Schrift aus dem pub.tech Design System) |
| `app.js` | Spiellogik |
| `cards.js` | **Die Karteninhalte** — hier trägst du deine Texte ein |
| `*.webp` | 3D-Objekte für die Kategorien |

## Karten ändern

Öffne `cards.js`. Jede Karte sieht so aus:

```js
{ kategorie: "checkliste", teil: "3 / 10", titel: "Zuhören", text: "Hör den beteiligten Parteien zu …", impuls: "Kleiner Hinweis" },
```

Für Aufzählungen (Bücher, Songs, Schritte) gibt es `liste: ["…", "…"]`. Die Kategorien stehen oben in `KATEGORIEN` (Name, Bild, Farbe).

## Veröffentlichung

Das Spiel läuft über GitHub Pages: Jede Änderung im Repository ist nach ein bis zwei Minuten online.
