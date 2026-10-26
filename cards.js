/*
  Karteninhalte.

  So fügst du Karten hinzu oder änderst sie:
  - Jede Karte steht in geschweiften Klammern { … } und endet mit einem Komma.
  - "kategorie" muss einer der Schlüssel aus KATEGORIEN sein.
  - "titel"   = große Zeile
  - "text"    = Frage, Aufgabe oder Erklärung
  - "liste"   = (optional) Aufzählung, z. B. Bücher oder Songs
  - "impuls"  = (optional) kleiner Hinweis unten auf der Karte
  - "teil"    = (optional) z. B. "3 / 10", wenn ein Inhalt über mehrere Karten verteilt ist
  - "grafik"  = (optional) Zeichnung oben auf der Karte, z. B. "felder:2" (siehe grafik.js); ohne grafik erscheint das 3D-Objekt
  - Die Anzahl der Karten ist frei. Die Auslage verteilt sie automatisch auf die Spalten.
*/
window.KATEGORIEN = {
  checkliste: { name: "Checkliste",        bild: "target.webp",    farbe: "#59d5dc" },
  uebung:     { name: "Übung",             bild: "hands.webp",     farbe: "#9F9FF4" },
  felder:     { name: "Konfliktfelder",    bild: "gear.webp",      farbe: "#0DADF2" },
  stile:      { name: "Konfliktstile",     bild: "heart.webp",     farbe: "#F9851F" },
  playlist:   { name: "Playlist",          bild: "speaker.webp",   farbe: "#F471DE" },
  buecher:    { name: "Bücher",            bild: "lightbulb.webp", farbe: "#F9CE1F" },
  fuehrung:   { name: "Führung",           bild: "rocket.webp",    farbe: "#b5fd42" },
  eskalation: { name: "Eskalation",        bild: "wave.webp",      farbe: "#35B680" }
};

/*
  Trennstellen für lange Wörter. Ein "|" markiert, wo das Wort umbrechen darf,
  wenn es nicht in die Zeile passt (dann mit Trennstrich). Neue Wörter einfach ergänzen.
*/
window.TRENNUNGEN = [
  "Zwischen|mensch|lich", "Lösungs|varianten", "Entgegen|kommen", "Konflikt|ursachen", "Konflikt|lösung",
  "Konflikt|felder", "Konflikt|stile", "Selbst|reflexion", "Eskala|tions|prävention", "Perspek|tiv|wechsel",
  "Team|zusammen|halt", "Persön|lichkeits|typen", "Kommuni|kation", "Konfron|tieren", "Verein|barung",
  "Wahr|nehmung", "Gemein|sames", "Fort|schritt", "Weiter|atmen", "Indivi|duell", "Koope|rieren",
  "Gewalt|freie", "Schlüssel|personen", "Einzel|gespräche", "Vernichtungs|schläge", "Zer|splitterung",
  "Gesichts|verlust", "Droh|strategien", "Verantwor|tung", "Unter|stützung", "Kooperations|wille",
  "Konfrontations|bereitschaft", "Bestands|aufnahme", "Team|botschaft"
];

window.KARTEN = [
  /* ---------- Checkliste für Konflikte ---------- */
  { kategorie: "checkliste", grafik: "checkliste:0", teil: "Einstieg", titel: "Fortschritt statt Sieg", text: "„Das Ziel eines Konflikts oder einer Auseinandersetzung soll nicht der Sieg, sondern der Fortschritt sein.“", impuls: "Joseph Joubert" },
  { kategorie: "checkliste", grafik: "checkliste:1", teil: "1 / 10", titel: "Weiteratmen und Ruhe bewahren", text: "Der erste Schritt ist am schwierigsten. Aber ohne ihn wird es noch schwerer." },
  { kategorie: "checkliste", grafik: "checkliste:2", teil: "2 / 10", titel: "Konflikt anerkennen", text: "Leugne den Konflikt nicht. Erkenne an, dass er unter deiner Beteiligung geklärt werden muss und kann." },
  { kategorie: "checkliste", grafik: "checkliste:3", teil: "3 / 10", titel: "Zuhören", text: "Hör den beteiligten Parteien zu und lass Emotionen zu, ohne sie zu bewerten." },
  { kategorie: "checkliste", grafik: "checkliste:4", teil: "4 / 10", titel: "Verstehen", text: "Versuche, die Ursachen des Konflikts zu verstehen." },
  { kategorie: "checkliste", grafik: "checkliste:5", teil: "5 / 10", titel: "Kommunikation", text: "Unterstütze und ermutige zu einem offenen und wertschätzenden Gespräch." },
  { kategorie: "checkliste", grafik: "checkliste:6", teil: "6 / 10", titel: "Gemeinsames", text: "Erforscht alle gemeinsamen Ziele und Interessen, die eine Basis für die Lösung sein können." },
  { kategorie: "checkliste", grafik: "checkliste:7", teil: "7 / 10", titel: "Lösungsvarianten", text: "Erarbeitet in gemeinsamer Verantwortung verschiedene Lösungswege." },
  { kategorie: "checkliste", grafik: "checkliste:8", teil: "8 / 10", titel: "Hilfe suchen", text: "Zieht bei Bedarf eine neutrale Person zur Klärung hinzu." },
  { kategorie: "checkliste", grafik: "checkliste:9", teil: "9 / 10", titel: "Vereinbarung", text: "Formuliert gemeinsam eine Vereinbarung, die für alle Seiten akzeptabel und tragbar ist." },
  { kategorie: "checkliste", grafik: "checkliste:10", teil: "10 / 10", titel: "Feedback", text: "Äußere Wertschätzung für den konstruktiven Umgang und ermuntere zur gemeinsamen Reflexion." },

  /* ---------- Problem-Lösungs-Gymnastik ---------- */
  { kategorie: "uebung", grafik: "uebung:1", teil: "1 / 3", titel: "Im CRASH-Zustand", text: "So fühlt sich die Problem-Trance an:", liste: ["Contracted – zusammengezogen", "Reactive – reaktiv", "Analysis – im Grübeln", "Separated – abgetrennt", "Hurting – verletzt"], impuls: "Wie stehst du da, wenn du so drauf bist?" },
  { kategorie: "uebung", grafik: "uebung:2", teil: "2 / 3", titel: "Im COACH-Zustand", text: "So fühlt sich die Lösungs-Trance an:", liste: ["Centered – zentriert", "Open – offen", "Aware – aufmerksam", "Connected – verbunden", "Holding – gehalten"], impuls: "Wie stehst du da, wenn du so drauf bist?" },
  { kategorie: "uebung", grafik: "uebung:3", teil: "3 / 3", titel: "Problem-Lösungs-Gymnastik", text: "Probier es jetzt mit deinem Körper aus:", liste: ["In den CRASH-Zustand gehen: die Problem-Haltung bewusst verstärken.", "In den COACH-Zustand gehen: die Lösungs-Haltung bewusst vergrößern.", "Drei Mal hin- und herpendeln und mit COACH beenden."], impuls: "Übung aus der hypnosystemischen Arbeit nach Gunther Schmidt" },

  /* ---------- Konfliktfelder ---------- */
  { kategorie: "felder", grafik: "felder:0", teil: "Überblick", titel: "Wo sitzt der Konflikt?", text: "Konflikte entstehen in vier Feldern: Struktur, Inhalte, Zwischenmenschliches und Individuelles. Oft hängen mehrere zusammen.", impuls: "Zieh die anderen Karten dieser Kategorie, um die Felder kennenzulernen." },
  { kategorie: "felder", grafik: "felder:1", teil: "1 / 4", titel: "Struktur", text: "Rollen, Richtlinien, Governance, Macht- und Aufgabenverteilung.", impuls: "Ist in deinem Konflikt etwas an der Struktur unklar?" },
  { kategorie: "felder", grafik: "felder:2", teil: "2 / 4", titel: "Inhalte", text: "Projekte, Prioritäten, Ressourcen, operative Arbeit.", impuls: "Worum geht es in der Sache eigentlich?" },
  { kategorie: "felder", grafik: "felder:3", teil: "3 / 4", titel: "Zwischenmenschlich", text: "Beziehungen, Kultur, Atmosphäre, Gruppendynamik.", impuls: "Wie ist die Stimmung zwischen den Beteiligten?" },
  { kategorie: "felder", grafik: "felder:4", teil: "4 / 4", titel: "Individuell", text: "Haltung, Verhalten, Fähigkeiten, Gefühle, Tagesform.", impuls: "Was bringst du selbst heute mit?" },

  /* ---------- Konfliktstile ---------- */
  { kategorie: "stile", grafik: "stile:0", teil: "Überblick", titel: "Wie gehst du in Konflikte?", text: "Zwei Fragen bestimmen deinen Stil: Wie sehr orientierst du dich an den Bedürfnissen der anderen (Kooperationswille)? Und wie sehr an deinen eigenen (Konfrontationsbereitschaft)?", impuls: "Daraus ergeben sich vier Stile." },
  { kategorie: "stile", grafik: "stile:1", teil: "1 / 4", titel: "Vermeiden", text: "Vermeiden, Flüchten, Beenden.", impuls: "Wenig Kooperation, wenig Konfrontation. Wann ziehst du dich zurück?" },
  { kategorie: "stile", grafik: "stile:2", teil: "2 / 4", titel: "Entgegenkommen", text: "Entgegenkommen, Nachgeben, Aufopfern.", impuls: "Viel Kooperation, wenig Konfrontation. Wann gibst du nach, obwohl du etwas anderes brauchst?" },
  { kategorie: "stile", grafik: "stile:3", teil: "3 / 4", titel: "Konfrontieren", text: "Konfrontieren, Konkurrieren, Dominieren.", impuls: "Wenig Kooperation, viel Konfrontation. Wann willst du dich durchsetzen?" },
  { kategorie: "stile", grafik: "stile:4", teil: "4 / 4", titel: "Kooperieren", text: "Verstehen, Integrieren, Kooperieren.", impuls: "Viel Kooperation, viel Konfrontation. Was brauchst du, um hierhin zu kommen?" },

  /* ---------- Playlist: Wenn Konflikt(verlauf) eine Playlist wäre … ---------- */
  { kategorie: "playlist", grafik: "playlist:1", teil: "Phase 1 / 6", titel: "Konfliktursachen verstehen", liste: ["Herbert Grönemeyer – Bleibt alles anders (1998): Konflikte durch Veränderung, Unsicherheit akzeptieren statt bekämpfen", "Harry Styles – As It Was (2022): Veränderung, Rollenwandel, Orientierung", "Keane – Everybody's Changing (2004): Menschen entwickeln sich unterschiedlich schnell"] },
  { kategorie: "playlist", grafik: "playlist:2", teil: "Phase 2 / 6", titel: "Wahrnehmung & Selbstreflexion", liste: ["Alec Benjamin – Mind Is A Prison (2019): Annahmen, Gedankenfallen und innere Konflikte", "Travis – Why Does It Always Rain on Me? (1999): Projektionen und Fehlinterpretationen", "Michael Jackson – Man in the Mirror (1988): Eigenverantwortung, mein Anteil am Konflikt"] },
  { kategorie: "playlist", grafik: "playlist:3", teil: "Phase 3 / 6", titel: "Eskalationsprävention", liste: ["Xavier Rudd – Follow the Sun (2010): Erst reflektieren, dann reagieren", "OneRepublic – I Ain't Worried (2022): Gelassenheit statt Überreaktion", "Billie Eilish – everything i wanted (2019): Psychologische Sicherheit, Vertrauen und Unterstützung"] },
  { kategorie: "playlist", grafik: "playlist:4", teil: "Phase 4 / 6", titel: "Perspektivwechsel & Kommunikation", liste: ["Tim Bendzko – Wenn Worte meine Sprache wären (2011): Bedürfnisse ausdrücken, Kommunikationsbarrieren", "Cat Stevens – Father and Son (1970): Unterschiedliche Perspektiven verstehen, Generationen- und Wertekonflikte"] },
  { kategorie: "playlist", grafik: "playlist:5", teil: "Phase 5 / 6", titel: "Vertrauen & Teamzusammenhalt", liste: ["Coldplay – Fix You (2005): Empathie, Unterstützung statt Schuldzuweisung", "U2 – One (1991): Unterschiedlichkeit akzeptieren", "Jack Johnson – Better Together (2005): Kooperation statt Konkurrenz, Teamstärken nutzen"] },
  { kategorie: "playlist", grafik: "playlist:6", teil: "Phase 6 / 6", titel: "Konfliktlösung & Zukunft", liste: ["The Beatles – We Can Work It Out (1965): Harvard-Methode in Musikform – zuhören, verhandeln, Kompromiss finden, gemeinsam Lösungen entwickeln", "Kitschkrieg – Gut Genug: Selbstliebe und Mut"] },

  /* ---------- Bücher ---------- */
  { kategorie: "buecher", grafik: "buecher:1", teil: "Gewaltfreie Kommunikation · Einsteiger", titel: "Gewaltfreie Kommunikation", liste: ["„Gewaltfreie Kommunikation“ – Marshall B. Rosenberg: Klassiker, Grundlagenwerk mit praktischen Übungen", "„Das Herz gesellschaftlicher Veränderung“ – Marshall B. Rosenberg: Anwendung der GFK in Konflikten und Führung"] },
  { kategorie: "buecher", grafik: "buecher:2", teil: "Gewaltfreie Kommunikation · Erfahrene", titel: "Gewaltfreie Kommunikation", liste: ["„Konflikte lösen durch Gewaltfreie Kommunikation“ – Gabriele Seils: Praktische Beispiele für den Berufsalltag", "„GFK in Organisationen“ – Ike Lasater & John Kinyon: Wie GFK in Teams und Führung funktioniert"] },
  { kategorie: "buecher", grafik: "buecher:3", teil: "Gewaltfreie Kommunikation · Profi", titel: "Gewaltfreie Kommunikation", liste: ["„Die Sprache des Friedens sprechen“ – Marshall B. Rosenberg: Fortgeschrittene Techniken, auch für Mediation", "„Nonviolent Communication: A Language of Life“ – Marshall B. Rosenberg: Erweiterte Konzepte, Fallstudien"] },
  { kategorie: "buecher", grafik: "buecher:1", teil: "DISG & Persönlichkeitstypen · Einsteiger", titel: "DISG-Modell & Persönlichkeitstypen", liste: ["„Das DISG-Modell“ – Insights Discovery (offizielles Handbuch): Grundlagen der vier Typen und ihre Anwendung", "„Erkenne dich selbst und verstehe andere“ – Thomas Erikson: Einfache Einführung in Persönlichkeitstypen, ähnlich DISG"] },
  { kategorie: "buecher", grafik: "buecher:2", teil: "DISG & Persönlichkeitstypen · Erfahrene", titel: "DISG-Modell & Persönlichkeitstypen", liste: ["„Surrounded by Idiots“ – Thomas Erikson: Wie man mit unterschiedlichen Typen kommuniziert, humorvoll und praxisnah", "„People Styles at Work“ – Robert Bolton & Dorothy Grover Bolton: Vertiefung in Kommunikationsstile, ähnlich DISG"] },
  { kategorie: "buecher", grafik: "buecher:3", teil: "DISG & Persönlichkeitstypen · Profi", titel: "DISG-Modell & Persönlichkeitstypen", liste: ["„The Platinum Rule“ – Tony Alessandra: Fortgeschrittene Anwendung von Persönlichkeitsmodellen", "„Type Talk at Work“ – Otto Kroeger & Janet M. Thuesen: MBTI in der Führung, übertragbar auf DISG"] },
  { kategorie: "buecher", grafik: "buecher:1", teil: "Kommunikation · Einsteiger", titel: "Kommunikation", liste: ["„Miteinander reden 1“ – Friedemann Schulz von Thun: Grundlagen des Kommunikationsquadrats", "„Die Kunst des klaren Denkens“ – Rolf Dobelli: Einfache Tipps für bessere Kommunikation"] },
  { kategorie: "buecher", grafik: "buecher:2", teil: "Kommunikation · Erfahrene", titel: "Kommunikation", liste: ["„Miteinander reden 2“ – Friedemann Schulz von Thun: Werte und innere Teamkonflikte", "„Die Kunst des klugen Handelns“ – Rolf Dobelli: Psychologische Fallstricke in Gesprächen"] },
  { kategorie: "buecher", grafik: "buecher:3", teil: "Kommunikation · Profi", titel: "Kommunikation", liste: ["„Miteinander reden 3“ – Friedemann Schulz von Thun: Kommunikation in Gruppen und Organisationen", "„Anleitung zum Unglücklichsein“ – Paul Watzlawick: Kommunikationsparadoxien und systemische Sicht"] },

  /* ---------- Führung ---------- */
  { kategorie: "fuehrung", grafik: "fuehrung", titel: "10-Schritte-Plan im Konflikt", liste: ["Bestandsaufnahme", "Schlüsselpersonen identifizieren", "Erste Einzelgespräche führen", "Ursachen statt Symptome erkennen (Kernkonflikt)", "Klare Teambotschaft setzen", "Aufgaben, Belastung und Zumutungen sortieren", "Konfliktherde gezielt bearbeiten", "Spielregeln für Kommunikation und Zusammenarbeit festziehen (sozialen Raum stabilisieren)", "Nachhalten statt hoffen", "Stimmung erneut prüfen und den nächsten Zyklus festlegen"], impuls: "„Das Team soll wissen, dass es geführt wird.“" },

  /* ---------- Der Konflikt und ich: Eskalationsstufen (nach Friedrich Glasl) ---------- */
  { kategorie: "eskalation", grafik: "eskalation:0", teil: "Überblick", titel: "Über 9 Stufen in den Untergang", text: "Konflikte eskalieren Stufe für Stufe. Auf welcher Stufe steht dein Konflikt gerade?", liste: ["1. Verhärtung", "2. Debatte", "3. Taten statt Worte", "4. Koalitionen", "5. Gesichtsverlust", "6. Drohstrategien", "7. Begrenzte Vernichtungsschläge", "8. Zersplitterung", "9. Gemeinsam in den Abgrund"], impuls: "Eskalationsstufen nach Friedrich Glasl" },
  { kategorie: "eskalation", grafik: "eskalation:1", teil: "Stufe 1–3", titel: "Gemeinsam lösen", text: "„Wir haben ein Problem und suchen gemeinsam eine Lösung.“ Doch schon hier geht Stück für Stück die Empathie verloren:", liste: ["1. Verhärtung – die kognitive Empathie geht verloren: die Fähigkeit, sich in das Denken der anderen Partei hineinzuversetzen.", "2. Debatte – die emotionale Empathie geht verloren: „Ich spüre, was bei dir los ist.“", "3. Taten statt Worte – die intentionale Empathie geht verloren: der Zugang zu Bedürfnissen, Zielen und Werten des Gegenübers."] },
  { kategorie: "eskalation", grafik: "eskalation:2", teil: "Stufe 4–6", titel: "Gewinnen und verlieren", text: "„Ich will gewinnen, du sollst verlieren.“", liste: ["4. Koalitionen", "5. Gesichtsverlust", "6. Drohstrategien"], impuls: "Ab Stufe 4 braucht es professionelle Unterstützung: Vermittlung, Mediation, Begleitung. Objektiv kann es noch Lösungen geben, aber die Beteiligten können sie wegen ihrer Haltung nicht mehr sehen." },
  { kategorie: "eskalation", grafik: "eskalation:3", teil: "Stufe 7–9", titel: "Alle verlieren", text: "„Hauptsache, der andere verliert, auch wenn ich selbst Schaden nehme.“", liste: ["7. Begrenzte Vernichtungsschläge", "8. Zersplitterung", "9. Gemeinsam in den Abgrund"], impuls: "Spätestens jetzt: Hol dir Hilfe von außen." }
];
