# Gefühlskarten

Ein Kartenspiel von pub.tech: Man deckt Karten wie bei Patience auf und setzt sich mit dem Inhalt auseinander. Notizen bleiben nur im eigenen Browser und lassen sich als Textdatei herunterladen. Keine Datenbank, kein Login.

## Dateien

| Datei | Was drin ist |
|---|---|
| `index.html` | Die Seite |
| `style.css` | Aussehen (Farben und Schrift aus dem pub.tech Design System) |
| `app.js` | Spiellogik |
| `cards.js` | **Die Karteninhalte** — hier trägst du deine Texte ein |
| `img/` | 3D-Objekte für die Kategorien |

## Karten ändern

Öffne `cards.js`. Jede Karte sieht so aus:

```js
{ kategorie: "wahrnehmen", titel: "Kurz innehalten", text: "Wie fühlst du dich gerade?", impuls: "Es gibt keine falsche Antwort." },
```

Die Kategorien stehen oben in `KATEGORIEN` (Name, Bild, Farbe).

## Auf GitHub Pages veröffentlichen

1. Auf github.com ein neues Repository anlegen (Sichtbarkeit: **Public**).
2. „uploading an existing file“ anklicken und alle Dateien aus diesem Ordner hineinziehen (inklusive Ordner `img`). „Commit changes“.
3. Im Repository: **Settings → Pages**. Bei „Source“ **Deploy from a branch** wählen, Branch **main**, Ordner **/ (root)**, „Save“.
4. Nach ein bis zwei Minuten steht oben auf der Seite der Link (`https://<name>.github.io/<repo>/`).
