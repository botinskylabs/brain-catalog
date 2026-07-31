# Das Digitale Immobilienbüro — Projektvorstellung

> Vollständige Textfassung der Webseite unter `docs/index.html`, inklusive Aufbau,
> Gestaltung und Verhalten. Dieses Dokument ist so geschrieben, dass ein Sprachmodell
> daraus die komplette Seite rekonstruieren oder beurteilen kann, ohne den Code zu lesen.
>
> Stand: Juli 2026 · Quelltext: `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/agents.js`

---

## 1. Was die Seite ist

Eine einseitige Projektvorstellung — **keine Landingpage**. Sie verkauft nichts, sie
erklärt ein Vorhaben. Kein Kontaktformular, kein Terminbuchungs-Button, kein
Call-to-Action. Adressat der aktuellen Fassung ist ein möglicher Partner auf der
Objektseite (Jirko), nicht der Endkunde.

**Kernaussage:** Nach außen tritt eine Person auf — der Real Estate Concierge.
Dahinter arbeitet ein Büro aus zehn spezialisierten KI-Rollen.

**Technik:** statisches HTML/CSS/JS, kein Build, keine externen Abhängigkeiten,
keine Schriften oder Skripte von fremden Servern. Zusätzlich existiert eine
Einzeldatei-Fassung (`dist/digitales-immobilienbuero.html`) mit eingebettetem CSS,
JS und allen Bildern als Data-URI.

---

## 2. Gestaltung

### Farbe

Bewusst unbunt. Es gibt keine Akzentfarbe — Struktur entsteht durch Haarlinien
und Weißraum, nicht durch Farbe.

| Rolle | Hell | Dunkel |
|---|---|---|
| Grund (`--paper`) | `#F4F3F0` warmes Off-White | `#131417` |
| Fläche (`--surface`) | `#FFFFFF` | `#1A1C20` |
| Fläche 2 (`--surface-2`) | `#EDECE8` | `#202329` |
| Schrift (`--ink`) | `#17181C` | `#EFEEEB` |
| Schrift weich (`--ink-soft`) | `#5F6169` | `#A3A5AB` |
| Schrift still (`--ink-mute`) | `#8B8D93` | `#7C7E85` |
| Linie (`--rule`) | `#DFDDD8` | `#2C2F35` |
| Linie fein (`--rule-soft`) | `#EAE8E4` | `#24272C` |

Beide Themes sind über CSS-Custom-Properties gebaut: `@media (prefers-color-scheme: dark)`
für die Systemeinstellung, zusätzlich `:root[data-theme="dark"]` und
`:root[data-theme="light"]`, damit ein Theme-Umschalter beide Richtungen überschreiben kann.
Alle Portraits laufen durch den Filter-Token `--photo` — hell `grayscale(1)`,
dunkel `grayscale(1) brightness(.74) contrast(1.02)`, damit helle Platten auf dunklem
Grund nicht blenden.

### Schrift

Systemschriften, keine Webfonts.

- **Serif** (`Iowan Old Style, Palatino Linotype, Palatino, Book Antiqua, Georgia, serif`)
  für alle Überschriften, Namen, Zitate und Schlusssätze. Immer `font-weight: 400`,
  Laufweite `-0.015em`. Leicht statt fett — Größe trägt die Hierarchie, nicht Gewicht.
- **Sans** (System-Stack: `-apple-system, Segoe UI, Inter, Roboto, Helvetica Neue, Arial`)
  für Fließtext, Listen und Bildunterschriften. 16,5 px, Zeilenhöhe 1,7.
- **Label** — die einzige Auszeichnung: 11 px, Versalien, Laufweite `0.24em`,
  Farbe `--ink-mute`. Trägt Rubriken („DAS TEAM"), Nummern und Rollenangaben.
- Zahlen mit `font-variant-numeric: tabular-nums`, damit Nummern in Spalten stehen.

### Layout

- Maximalbreite 1240 px, Außenabstand 40 px (mobil 24 px).
- **Alles linksbündig.** Nichts ist zentriert.
- Wiederkehrendes Raster für Abschnittsköpfe: `1.35fr / 1fr` — links Rubrik und
  Überschrift, rechts der erklärende Absatz.
- Abschnitte durch 1-px-Linien getrennt, 104 px Innenabstand oben und unten
  (mobil 68 px).
- Keine Schatten, keine Verläufe, keine abgerundeten Ecken, keine Kacheln mit Rahmen.
  Flächen stoßen an Linien.

### Bewegung

Nur eine: Das Detailpanel fährt von rechts ein (340 ms, `cubic-bezier(.4,0,.2,1)`).
Sonst nur zurückhaltende Hover-Übergänge. `prefers-reduced-motion` schaltet alles ab.

### Bilder

Zehn Portraitplatten im Hochformat 3:4, dazu eine für den Concierge. Aktuell
**Silhouetten in Graustufen** — bewusst anonyme Platzhalter, erzeugt von
`tools/generate-avatars.py`. Sie sind dafür gebaut, gegen echte Fotos getauscht zu
werden: gleiche Datei­namen in `docs/assets/agents/`, oder in `docs/agents.js` beim
jeweiligen Agenten ein Feld `photo: "name.jpg"` setzen. Alle Bilder werden per CSS
entsättigt, damit ein gemischter Satz Fotos trotzdem als ein Satz wirkt.

---

## 3. Aufbau der Seite

Reihenfolge der Abschnitte:

1. Kopfzeile (klebend)
2. Hero
3. Portraitstreifen (alle zehn nebeneinander)
4. Die Idee
5. Auftritt nach außen
6. Das Team (zehn Portraits, anklickbar)
7. Ablauf
8. Modell (Zusammenarbeit)
9. Aufbau
10. Fußzeile
11. Detailpanel (nur nach Klick sichtbar)

---

### 3.1 Kopfzeile

Klebt oben, 1-px-Linie nach unten, leicht durchscheinender Grund.

- Links: **Das Digitale Immobilienbüro** (Serif) + Label **PROJEKTVORSTELLUNG**
- Rechts: Sprungmarken **AUFTRITT · DAS TEAM · ABLAUF · MODELL · AUFBAU**
  (Versalien, 12 px; Unterstreichung bei Hover). Unter 880 px ausgeblendet.

### 3.2 Hero

Zweispaltig, unten ausgerichtet.

**Links:**

> Label: KONZEPT · STAND JULI 2026
>
> # Ein Ansprechpartner.
> # *Zehn Spezialisten dahinter.*

(zweite Zeile kursiv, in `--ink-soft` — der Kontrast zwischen aufrecht und kursiv
trägt die ganze Aussage)

**Rechts:**

> Ein Büro aus digitalen Spezialisten für die Vermittlung hochwertiger Immobilien.
>
> Nicht eine einzelne KI, sondern zehn Rollen mit klar geschnittenen
> Verantwortungsbereichen – wie in einem Immobilienunternehmen. Nach außen bleibt
> es eine Person: der Real Estate Concierge.

### 3.3 Portraitstreifen

Randlos über die volle Breite, oben und unten von einer Linie begrenzt. Zehn
Portraits nebeneinander, auf 158 px Höhe beschnitten (Bildausschnitt `50% 18%`,
also Kopf und Schultern). Unten links in jeder Zelle die Nummer 01–10 auf
halbtransparentem Grund. Unter 1080 px zwei Reihen à fünf.

### 3.4 Die Idee

Kopf: Label **DIE IDEE** · Überschrift **Kein Werkzeug. Ein Büro.**
Rechts: „Eine einzelne KI ist ein Assistent. Zehn Rollen mit klaren Zuständigkeiten
sind eine Organisation – mit Übergaben und einer Führung, die sie zusammenhält."

Darunter drei Spalten, durch senkrechte Linien getrennt:

| Skalierbar | Nachvollziehbar | Kontinuierlich besser |
|---|---|---|
| Jede weitere Immobilie und jeder weitere Käufer laufen durch dieselben Rollen. Mehr Volumen heißt nicht mehr Aufwand. | Jede Aufgabe hat einen Verantwortlichen. Jederzeit sichtbar, wer was getan hat und warum eine Entscheidung so gefallen ist. | Jede Rolle lernt in ihrem Bereich weiter: bessere Leads, bessere Texte, bessere Argumente. |

### 3.5 Auftritt nach außen

Kopf: Label **AUFTRITT NACH AUSSEN** · Überschrift **Vorne steht ein Mensch**
Rechts: „Der Markt sieht kein System und keine Software. Er sieht einen
Ansprechpartner. Das Büro arbeitet dahinter."

Zweispaltig: links eine Portraitplatte (300 px breit) mit Bildunterschrift
**Konstantin Botinsky** / Label **REAL ESTATE CONCIERGE**.

Rechts ein großes Zitat in Serif:

> „Ich verkaufe Ihnen nichts. Ich sorge dafür, dass Sie finden, was Sie suchen –
> Ihr Haus oder Ihr Investment."

Darunter drei Einträge, je zweispaltig (Titel links, Text rechts), durch feine
Linien getrennt:

| | |
|---|---|
| **Kein Makler, ein Concierge** | Ich vertrete kein Objekt, sondern die Suche. Wer sucht, bekommt jemanden an die Seite gestellt, der zuhört, filtert und vorsortiert. |
| **Für den Suchenden kostenfrei** | Die Begleitung kostet den Suchenden nichts. Vergütet wird die Vermittlung über die Verkäuferseite – als Tippgeber, nicht als Verkäufer. |
| **Zehn Spezialisten im Rücken** | Was nach einem einzelnen Ansprechpartner aussieht, ist die Arbeit eines ganzen Büros: Recherche, Objektwissen, Matching, Betreuung. |

> **Offener Punkt:** Die Aussage „kostenfrei für den Suchenden" ist eine Aussage über
> Vergütung. Provisionsregelungen in der Immobilienvermittlung sind rechtlich geregelt
> (u. a. Provisionsteilung bei Wohnimmobilien an Verbraucher seit Dezember 2020). Die
> Formulierung gehört fachlich geprüft, bevor die Seite öffentlich läuft.

### 3.6 Das Team

Kopf: Label **DAS TEAM** · Überschrift **Zehn Rollen, ein Verantwortungsbereich pro Kopf**
Rechts: „Ein Klick auf ein Portrait öffnet Mission, Verantwortlichkeiten, Fähigkeiten
und Output der jeweiligen Rolle."

Raster aus fünf Spalten (1080 px → drei, 880 px → zwei), Zellen durch 1-px-Fugen
getrennt. Jede Zelle ist ein `<button>`: Portrait im Format 3:4, darunter Nummer,
Name (Serif), Rollenbezeichnung und Missionssatz. Hover hellt die Fläche leicht auf.

Die vollständigen Inhalte aller zehn Rollen stehen in Abschnitt 4.

### 3.7 Ablauf

Kopf: Label **ABLAUF** · Überschrift **Vom ersten Kontakt bis zur Unterschrift**
Rechts: „Die Rollen arbeiten nicht nebeneinander, sondern übergeben in einer festen
Kette. Zwei Rollen liegen quer darüber: Organisation und Führung."

Liste mit drei Spalten je Zeile (Nummer · Name · Beschreibung), Zeilen durch Linien getrennt:

| Nr. | Rolle | Schritt |
|---|---|---|
| 01 | Research | Käufer und Multiplikatoren finden |
| 02 | Outreach | Kontakte in Gespräche verwandeln |
| 04 | Buyer Matching | Käuferprofil und Objekt abgleichen |
| 03 | Property | Jede Frage zum Objekt beantworten |
| 08 | Negotiation | Verhandlung strukturiert vorbereiten |
| — | *Abschluss* | Notartermin und Übergabe |

Die Nummern laufen bewusst nicht der Reihe nach — sie verweisen auf die Rollennummer,
nicht auf die Position in der Kette.

Darunter zwei Spalten:

**Dauerhaft im Hintergrund**
- **Content** baut Vertrauen auf, bevor jemand anruft
- **Relationship** hält jeden Kontakt warm, auch über Monate
- **Market Intelligence** hält jede Entscheidung auf aktuellem Stand

**Die Klammer**
- **Operations** hält CRM, Termine, Dokumente und Fristen sauber
- **Executive** setzt Prioritäten, erkennt Engpässe, liefert das tägliche Briefing

### 3.8 Modell — Zusammenarbeit

Kopf: Label **ZUSAMMENARBEIT** · Überschrift **Wer was einbringt**
Rechts: „Vorschlag für die Aufteilung zwischen Objektseite und Käuferseite.
Konditionen sind offen und gehören ins Gespräch."

Zwei Spalten:

**Jirko — Objekte und Marktzugang**
- Zugang zu Objekten und Eigentümern
- Bewertung und Einschätzung vor Ort
- Bestehende Kontakte im Markt
- Fachliche Prüfung im Einzelfall

**Concierge und Büro — Käuferseite und System**
- Aufbau und Betrieb der zehn Rollen
- Käuferrecherche, Ansprache, Betreuung
- Auftritt nach außen und Content
- Dokumentation aller Vorgänge im CRM

Darunter drei Stufen:

| Stufe | Inhalt |
|---|---|
| **1 — Fremde Objekte** | Vermittelt wird, was über die Objektseite hereinkommt. Das System beweist, dass es Käufer findet, die sonst niemand erreicht. Erlös aus der Vermittlung, aufgeteilt nach Beitrag. |
| **2 — Eigene Objekte** | Sobald der Käuferzugang trägt, lohnt es sich, selbst zu halten statt nur zu vermitteln. Aus der Provision wird eine Marge. |
| **3 — Das System als Produkt** | Was für ein Büro funktioniert, funktioniert für viele. Das Büro lässt sich als Ganzes lizenzieren oder abgeben – dann ist nicht die einzelne Immobilie der Wert, sondern der Apparat dahinter. |

Abschließender Hinweis in stiller Schrift:

> Alle drei Stufen sind Vorschläge, keine Zusagen. Vergütungsmodelle in der
> Immobilienvermittlung sind rechtlich geregelt; die konkrete Ausgestaltung gehört
> vor dem Start fachlich geprüft.

Bewusst **nicht** auf der Seite: Namen möglicher Käufer des Systems.

### 3.9 Aufbau

Kopf: Label **AUFBAU** · Überschrift **Das Büro entsteht in drei Schritten**
Rechts: „Nicht alle zehn Rollen müssen gleichzeitig existieren. Zuerst das, was Käufer
bringt, dann das, was Gespräche trägt, zuletzt das, was skaliert."

| Schritt | Rollen | Ergebnis |
|---|---|---|
| Käufer und Struktur | Research · Outreach · Operations | Der Pool potenzieller Käufer wächst, jeder Kontakt landet sauber im CRM, aus Recherche werden Gespräche. |
| Gespräche und Objektwissen | Property · Buyer Matching · Relationship | Jede Frage zum Objekt ist beantwortbar, jeder Käufer bekommt das passende Objekt, kein Interessent geht verloren. |
| Reichweite und Steuerung | Content · Market Intelligence · Negotiation · Executive | Vertrauen entsteht vor dem Erstkontakt, Entscheidungen beruhen auf aktuellen Daten, eine Instanz hält alles zusammen. |

Schlusssatz, groß in Serif:

> Am Ende steht kein Werkzeug, das jemand bedient, sondern ein Büro, das arbeitet.

### 3.10 Fußzeile

Zwei Zeilen in stiller Schrift:
`Das Digitale Immobilienbüro — Projektvorstellung` ·
`Konzeptstand Juli 2026 · kontakt@digitales-immobilienbuero.de`

(Die Adresse ist ein Platzhalter.)

### 3.11 Detailpanel

Öffnet auf Klick auf ein Portrait. Fährt von rechts ein, maximal 680 px breit,
volle Höhe, scrollbar. Dahinter ein abdunkelnder Schleier.

Inhalt von oben nach unten: kleines Portrait · Label `ROLLE 0X` · Name (Serif, groß) ·
Rollenbezeichnung · Mission in Serif · dann die Blöcke **VERANTWORTLICHKEITEN**,
**FÄHIGKEITEN**, **OUTPUT** und **WARUM DIESE ROLLE**, getrennt durch feine Linien.
Listeneinträge tragen keinen Punkt, sondern einen kurzen waagerechten Strich.

Schließen: Button oben rechts, Klick auf den Schleier oder Escape. Der Fokus kehrt
danach auf das zuletzt geklickte Portrait zurück.

---

## 4. Die zehn Rollen im Wortlaut

### 01 — Research Agent · „Der Käufer-Finder"

**Mission:** Findet kontinuierlich neue potenzielle Käufer und Multiplikatoren für jede Immobilie.

**Verantwortlichkeiten:** Recherche potenzieller Käufer · Recherche von Family Offices ·
Vermögensverwalter finden · Steuerberater mit vermögenden Mandanten · Private Banker ·
Unternehmer · Ärzte · Anwälte · Investoren · Internationale Käufer · Firmen mit Expansionsplänen

**Fähigkeiten:** LinkedIn analysieren · Webseiten durchsuchen · Unternehmensdaten recherchieren ·
Immobilienportale beobachten · Nachrichten auswerten · Firmenexpansionen erkennen ·
Finanzierungsindikatoren erkennen · CRM automatisch befüllen

**Output:** täglich neue Leads · Priorisierung nach Kaufwahrscheinlichkeit ·
Hintergrundinformationen · Gesprächsanlässe

**Warum diese Rolle:** Ohne Käufer gibt es keinen Verkauf. Dieser Agent sorgt dafür, dass der
Vertrieb niemals auf Empfehlungen oder Zufall angewiesen ist. Er baut jeden Tag den Pool
potenzieller Käufer aus.

---

### 02 — Outreach Agent · „Der Beziehungsstarter"

**Mission:** Verwandelt recherchierte Kontakte in Gespräche.

**Verantwortlichkeiten:** personalisierte Nachrichten schreiben · LinkedIn Outreach ·
E-Mail Outreach · Follow-up Kampagnen · Termine vereinbaren · Reaktionen auswerten ·
Kommunikation personalisieren

**Fähigkeiten:** Tonalität an Zielgruppe anpassen · Gesprächsanlässe erkennen ·
Einwände vorwegnehmen · A/B Tests · Öffnungsraten optimieren · Antwortwahrscheinlichkeit erhöhen

**Output:** qualifizierte Erstgespräche · gebuchte Besichtigungen · steigende Antwortrate

**Warum diese Rolle:** Die meisten hochwertigen Käufer suchen nicht aktiv. Man muss sie
intelligent ansprechen.

---

### 03 — Property Agent · „Der Immobilienexperte"

**Mission:** Kennt jede Immobilie besser als jeder Makler.

**Verantwortlichkeiten:** sämtliche Objektdaten verwalten · Exposé verstehen · Grundrisse kennen ·
Umgebung analysieren · Bauunterlagen kennen · Sanierungen dokumentieren · Energieausweis kennen ·
Besonderheiten erklären

**Fähigkeiten** *(Einleitung: „Kann jede Käuferfrage beantworten. Zum Beispiel:")*:
Warum wurde dieser Preis gewählt? · Welche Schulen liegen in der Nähe? · Welche Restaurants? ·
Wie entwickelt sich das Viertel? · Welche Rendite wäre möglich? · Welche Umbauten wären sinnvoll?

**Output:** sofortige Antworten · keine Wartezeiten · perfekte Objektkenntnis

**Warum diese Rolle:** Je teurer eine Immobilie ist, desto detaillierter werden die Fragen.
Dieser Agent kennt jede Antwort.

---

### 04 — Buyer Matching Agent · „Der perfekte Vermittler"

**Mission:** Erkennt automatisch, welche Immobilie zu welchem Käufer passt.

**Verantwortlichkeiten:** Käufer interviewen · Bedürfnisse erkennen · Budget analysieren ·
Lebenssituation verstehen · Investmentziele erkennen

**Fähigkeiten** *(Einleitung: „Erstellt ein Käuferprofil, vergleicht es mit allen Immobilien
und berechnet:")*: Matching Score · Risiken · Vorteile · Argumente

**Output:** „Dieses Objekt passt zu 96 %."

**Warum diese Rolle:** Menschen kaufen Lösungen. Nicht Immobilien.

---

### 05 — Content Agent · „Der Markenaufbauer"

**Mission:** Produziert kontinuierlich hochwertigen Content rund um die Immobilie.

**Verantwortlichkeiten:** LinkedIn Posts · Instagram Posts · Newsletter · Videos ·
Storytelling · Blogartikel · Investmentanalysen

**Fähigkeiten** *(Einleitung: „Kennt:")*: Zielgruppen · Algorithmen · Storytelling ·
Copywriting · Architektur · Luxusmarketing

**Output:** Jede Woche neue Inhalte.

**Warum diese Rolle:** Premiumimmobilien verkaufen sich über Vertrauen. Content erzeugt Vertrauen.

---

### 06 — Relationship Agent · „Der Kundenbetreuer"

**Mission:** Pflegt jede Beziehung langfristig.

**Verantwortlichkeiten:** Follow-ups · Erinnerungen · Geburtstage · Gesprächsnotizen ·
Interessen merken · Empfehlungen verwalten

**Fähigkeiten** *(Einleitung: „Kennt jede Interaktion. Weiß:")*: wann zuletzt gesprochen wurde ·
was wichtig war · welche Fragen offen sind

**Output:** Kein Interessent geht verloren.

**Warum diese Rolle:** Millionenobjekte werden selten im ersten Gespräch verkauft. Oft
entscheidet sich ein Käufer Monate später.

---

### 07 — Market Intelligence Agent · „Der Marktanalyst"

**Mission:** Beobachtet permanent den Immobilienmarkt.

**Verantwortlichkeiten:** Preisentwicklung · Vergleichsobjekte · Nachfrage · Neubauprojekte ·
Finanzierung · Zinssituation · Konkurrenz

**Fähigkeiten** *(Einleitung: „Erkennt:")*: Preisänderungen · Trends · Marktchancen · Risiken

**Output** *(Einleitung: „Wöchentliche Marktberichte mit Empfehlungen:")*: Preis erhöhen ·
Preis senken · Verkaufszeitpunkt · Argumente

**Warum diese Rolle:** Der Markt verändert sich täglich. Dieser Agent verhindert
Entscheidungen auf Basis veralteter Informationen.

---

### 08 — Negotiation Agent · „Der Verhandlungsstratege"

**Mission:** Unterstützt den Makler bei Preisverhandlungen.

**Verantwortlichkeiten:** Einwände analysieren · Verhandlung vorbereiten ·
Gegenargumente entwickeln · Käuferpsychologie analysieren

**Fähigkeiten** *(Einleitung: „Kennt:")*: Verhandlungstechniken · Preisanker · BATNA ·
Verkaufspsychologie

**Output:** Argumentationsleitfäden · Verhandlungssimulationen

**Warum diese Rolle:** Schon wenige Prozentpunkte Preisunterschied können bei hochpreisigen
Objekten einen erheblichen finanziellen Unterschied machen. Eine strukturierte Vorbereitung
erhöht die Chance auf einen erfolgreichen Abschluss.

---

### 09 — Operations Agent · „Der Bürochef"

**Mission:** Organisiert sämtliche Abläufe.

**Verantwortlichkeiten:** CRM pflegen · Termine koordinieren · Dokumente verwalten ·
Aufgaben verteilen · Status überwachen

**Fähigkeiten** *(Einleitung: „Automatisiert:")*: Erinnerungen · Aufgaben · Checklisten ·
Fristen · Dokumentenablage

**Output:** Ein perfekt organisiertes Immobilienbüro.

**Warum diese Rolle:** Vertrieb funktioniert nur dann effizient, wenn die Organisation im
Hintergrund zuverlässig läuft.

---

### 10 — Executive Agent · „Der Geschäftsführer"

**Mission:** Koordiniert alle anderen Agenten.

**Verantwortlichkeiten:** Prioritäten setzen · Ziele überwachen · Kennzahlen analysieren ·
Entscheidungen vorbereiten · Engpässe erkennen

**Fähigkeiten** *(Einleitung: „Kennt den aktuellen Status aller Immobilien:")*: Anzahl Käufer ·
Anzahl Besichtigungen · Pipeline · Markt · Umsatzprognosen

**Output** *(Einleitung: „Ein tägliches Management-Briefing:")*: Was ist heute wichtig? ·
Wo drohen Risiken? · Welche Chancen gibt es? · Welche Aufgaben haben höchste Priorität?

**Warum diese Rolle:** Ohne zentrale Koordination arbeiten einzelne Spezialisten
nebeneinander. Dieser Agent sorgt dafür, dass das gesamte digitale Immobilienbüro wie ein
eingespieltes Team funktioniert und alle Informationen zu klaren Entscheidungen
zusammengeführt werden.

---

## 5. Zugänglichkeit und Verhalten

- Sprungmarke „Direkt zum Team" für Tastaturnutzer, sichtbar erst bei Fokus.
- Sichtbarer Fokusrahmen (2 px, `--ink`) auf allen bedienbaren Elementen.
- Die Portraits sind echte `<button>`-Elemente, also mit Tabulator und Enter bedienbar.
- Das Panel trägt `role="dialog"` und `aria-modal`, ist über Escape schließbar und gibt
  den Fokus an das Portrait zurück.
- Dekorative Bilder (Portraitstreifen) tragen leeren Alt-Text, inhaltstragende einen Namen.
- `prefers-reduced-motion` schaltet Übergänge und weiches Scrollen ab.

## 6. Was offen ist

1. **Echte Fotos.** Die Silhouetten sind Platzhalter. Sobald die Bilder vorliegen,
   ersetzen sie die SVG-Dateien in `docs/assets/agents/` — am Layout ändert sich nichts.
2. **Vergütungsaussage.** Siehe Hinweis in Abschnitt 3.5.
3. **Kontaktadresse.** Platzhalter.
4. **Name des Concierge.** Aktuell „Konstantin Botinsky" — falls das anders heißen soll,
   steht es an genau einer Stelle in `docs/index.html`.
5. **Zwei Zielgruppen.** Die Fassung enthält den Abschnitt „Modell" für ein Partnergespräch.
   Für eine Fassung, die Eigentümern oder Käufern gezeigt wird, gehört dieser Abschnitt heraus.
