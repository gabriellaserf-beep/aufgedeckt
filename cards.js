/*
  Karteninhalte — BEISPIELKARTEN (Platzhalter, werden durch die echten Inhalte ersetzt).

  So fügst du Karten hinzu oder änderst sie:
  - Jede Karte steht in geschweiften Klammern { … } und endet mit einem Komma.
  - "kategorie" muss einer der Schlüssel aus KATEGORIEN sein.
  - "titel" ist die große Zeile, "text" die Frage oder Aufgabe, "impuls" ein kleiner Hinweis (optional).
  - Die Anzahl der Karten ist frei. Die Auslage verteilt sie automatisch auf die Spalten.
*/
window.KATEGORIEN = {
  wahrnehmen: { name: "Wahrnehmen", bild: "eye.webp", farbe: "#59d5dc" },
  benennen:   { name: "Benennen",   bild: "lightbulb.webp", farbe: "#b5fd42" },
  annehmen:   { name: "Annehmen",   bild: "hands.webp", farbe: "#9F9FF4" },
  ausdruecken:{ name: "Ausdrücken", bild: "speaker.webp", farbe: "#F9CE1F" },
  loslassen:  { name: "Loslassen",  bild: "wave.webp", farbe: "#0DADF2" },
  staerken:   { name: "Stärken",    bild: "heart.webp", farbe: "#F471DE" }
};

window.KARTEN = [
  { kategorie: "wahrnehmen", titel: "Kurz innehalten", text: "Wie fühlst du dich gerade, in genau diesem Moment? Nimm dir drei Atemzüge Zeit, bevor du antwortest.", impuls: "Es gibt keine falsche Antwort." },
  { kategorie: "wahrnehmen", titel: "Der Körper weiß es", text: "Wo in deinem Körper spürst du gerade etwas? Enge, Wärme, Unruhe, Leichtigkeit?", impuls: "Geh einmal vom Kopf bis zu den Füßen." },
  { kategorie: "wahrnehmen", titel: "Wetterbericht", text: "Wenn deine Stimmung heute ein Wetter wäre: Welches wäre es?", impuls: "Sonnig, bewölkt, Gewitter, Nebel …" },
  { kategorie: "wahrnehmen", titel: "Rückblick", text: "Welcher Moment heute hat etwas in dir ausgelöst? Was ist da passiert?", impuls: "Auch kleine Momente zählen." },

  { kategorie: "benennen", titel: "Ein Wort dafür", text: "Finde ein Wort für das, was du gerade fühlst. Und dann ein zweites, das noch genauer passt.", impuls: "Zum Beispiel: gereizt statt schlecht." },
  { kategorie: "benennen", titel: "Wie stark?", text: "Auf einer Skala von 1 bis 10: Wie stark ist das Gefühl gerade? Was würde es um einen Punkt verändern?", impuls: "" },
  { kategorie: "benennen", titel: "Mischgefühle", text: "Manchmal fühlen wir zwei Dinge gleichzeitig. Gibt es gerade ein Gefühl, das ein anderes begleitet?", impuls: "Zum Beispiel Vorfreude und Nervosität." },

  { kategorie: "annehmen", titel: "Darf da sein", text: "Sag dir innerlich: „Das Gefühl darf gerade da sein.“ Was verändert sich, wenn du es nicht wegschiebst?", impuls: "" },
  { kategorie: "annehmen", titel: "Was es dir sagt", text: "Jedes Gefühl hat eine Botschaft. Was könnte dein Gefühl dir gerade mitteilen wollen?", impuls: "Ärger zeigt oft eine Grenze." },
  { kategorie: "annehmen", titel: "Freundliche Stimme", text: "Was würdest du einer guten Freundin sagen, die sich gerade so fühlt wie du?", impuls: "Sag es dann dir selbst." },
  { kategorie: "annehmen", titel: "Ohne Urteil", text: "Beschreibe eine Situation von heute nur mit Fakten, ganz ohne Bewertung.", impuls: "" },

  { kategorie: "ausdruecken", titel: "Drei Sätze", text: "Schreib drei Sätze darüber, wie es dir geht. Niemand außer dir liest sie.", impuls: "Nutze das Notizfeld." },
  { kategorie: "ausdruecken", titel: "Ich-Botschaft", text: "Formuliere einen Satz, der mit „Ich fühle mich …, weil …“ beginnt.", impuls: "" },
  { kategorie: "ausdruecken", titel: "Wem erzählst du es?", text: "Mit wem könntest du über das sprechen, was dich gerade beschäftigt?", impuls: "Ein Name reicht." },

  { kategorie: "loslassen", titel: "Ausatmen", text: "Atme vier Sekunden ein und sechs Sekunden aus. Wiederhole das fünf Mal.", impuls: "Langes Ausatmen beruhigt." },
  { kategorie: "loslassen", titel: "Nicht in deiner Hand", text: "Was beschäftigt dich, das du gerade nicht ändern kannst? Und was kannst du ändern?", impuls: "" },
  { kategorie: "loslassen", titel: "Bewegung", text: "Steh kurz auf, streck dich oder geh ein paar Schritte. Wie fühlt es sich danach an?", impuls: "" },

  { kategorie: "staerken", titel: "Was gut tut", text: "Nenne drei Dinge, die dir in schwierigen Momenten guttun.", impuls: "Groß oder klein." },
  { kategorie: "staerken", titel: "Schon geschafft", text: "Denk an eine Situation, die du gut gemeistert hast. Was hat dir damals geholfen?", impuls: "" },
  { kategorie: "staerken", titel: "Dankbar", text: "Wofür bist du heute dankbar, auch wenn es nur eine Kleinigkeit ist?", impuls: "" },
  { kategorie: "staerken", titel: "Nächster Schritt", text: "Was ist ein kleiner Schritt, den du heute noch für dich tun kannst?", impuls: "Klein genug, dass er sicher klappt." }
];
