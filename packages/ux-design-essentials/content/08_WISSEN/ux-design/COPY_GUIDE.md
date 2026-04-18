---
title: "Copy Guide für UI-Texte"
created: "2026-04-18"
version: 1
category: other
source: AI Brain Builder by Botinsky
package: ux-design-essentials
ai_ready: true
---

# Copy Guide für UI-Texte

> Jedes Wort in der UI ist eine Design-Entscheidung. Diese Regeln gelten für alle UI-Texte.

## Button-Labels

**Regel: Verb + Objekt, max. 3 Worte.**

- ✅ "Paket installieren"
- ✅ "Brain wechseln"
- ✅ "Speichern"
- ❌ "Jetzt hier klicken um fortzufahren"
- ❌ "Click to proceed"

**Primärer Button:** klare Handlung ("Speichern", "Senden", "Installieren").
**Sekundärer Button:** Abbruch / Alternative ("Abbrechen", "Später", "Zurück").
**Destruktiver Button:** das Verb sagt was zerstört wird ("Löschen", "Entfernen", "Deinstallieren") — nie verschleiern als "OK".

## Headlines / Section-Titles

**Substantive oder Satz-Fragmente, kein Verbs-dran.**

- ✅ "Deine Pakete"
- ✅ "Letzte Aktivität"
- ❌ "Schau dir hier alle deine Pakete an"

Headlines erklären nicht — sie labeln. Erklärung kommt im Subtitle darunter wenn nötig.

## Empty States

**Formel:** Erklärung + Motivation + Next-Action.

- ❌ "Keine Daten vorhanden."
- ❌ "Liste ist leer."
- ✅ "Noch keine Pakete installiert. Installier dein erstes Paket und mach deinen Agent klüger. [Shop öffnen]"

Immer mit einem klickbaren Next-Action-Button. Niemals Sackgasse.

## Error-Messages

**Formel:** Was ist passiert + Wie beheben (+ optional: technische Details).

- ❌ "Error 500"
- ❌ "Ein Fehler ist aufgetreten"
- ✅ "Paket konnte nicht installiert werden — der Server antwortet nicht. Versuch es in ein paar Minuten nochmal. [Details anzeigen]"

**Detail-Links:** Klickbar, zeigen Stack-Trace / Request-ID für Support. Für Normal-User versteckt.

**Recovery-Aktionen:** wann immer möglich einen Button "Nochmal versuchen" direkt in die Error-Box.

## Loading-States

**Formel:** Verb im Präsens + Objekt.

- ✅ "Lade Pakete…"
- ✅ "Speichere…"
- ❌ "Bitte warten…" (zu generisch)
- ❌ "Verarbeitung läuft…" (passiv, unklar)

Wenn >3 Sekunden: Fortschritts-Indikator (Prozent, Phasen-Text). Nie stumm 10 Sekunden warten lassen.

## Tooltips

**Regel: nur wo Begriff nicht selbsterklärend.**

- ❌ Tooltip auf "Speichern" (offensichtlich)
- ❌ Tooltip auf 🔍 (universell)
- ✅ Tooltip auf 🧬 (was bedeutet das?)
- ✅ Tooltip auf technischen Begriff: "Capability — eine Fähigkeit die dein Agent bekommt"

Tooltip-Text: max. 1 Satz. Wenn mehr nötig: Doku-Link, nicht Tooltip.

## Bestätigungs-Dialoge

**Nur bei wirklich destruktiven Aktionen.**

Gut:
> "Brain Foundation deinstallieren?"
> Entfernt 3 Dateien aus deinem Brain. Das kann nicht rückgängig gemacht werden.
> [Abbrechen] [Ja, deinstallieren]

Schlecht:
> "Sind Sie sicher?"
> [Ja] [Nein]

Die Bestätigung sagt WAS gelöscht wird und WAS passiert. Button-Label wiederholt die Aktion ("Ja, deinstallieren"), nicht nur "OK".

## Form-Labels

**Substantive, kurz.**

- ✅ "Name"
- ✅ "E-Mail-Adresse"
- ❌ "Wie heißen Sie? Bitte geben Sie Ihren vollständigen Namen ein."

Help-Text unter dem Feld wenn nötig: 1 Satz, klein, grau.

**Required-Indikator:** `*` oder "(erforderlich)" konsistent. Nie mischen.

## Placeholder

**Beispiel, nicht Aufforderung.**

- ✅ Placeholder "max.mustermann@example.com"
- ❌ Placeholder "Geben Sie Ihre E-Mail ein"

Placeholder verschwindet wenn getippt wird — also kein kritischer Hinweis rein.

## Mikrocopy im Flow

Kleine Texte zwischen Sektionen die den User führen:

> "Fast fertig. Nur noch 2 Schritte."
> "Geschafft — dein Brain ist bereit."
> "Du kannst später immer wieder Pakete hinzufügen."

Sparsam. Nicht jeder Screen braucht Mikrocopy. Nur wo User unsicher wäre.

## Zahlen und Daten

- **Relative Zeit:** "vor 2 Stunden", "gestern", "letzte Woche" — näher am Menschen
- **Absolute Zeit nur bei >1 Woche:** "12. April 2026"
- **Zahlen mit Einheit:** "3 Pakete", "42 Dateien" — nicht nur "3" oder "42"
- **Große Zahlen gruppieren:** "1.234" nicht "1234"

## Tonalität

- **Aktiv, nicht passiv:** "Der Server antwortet nicht" statt "Es wurde keine Antwort vom Server empfangen"
- **Du-Ansprache** (deutsch) — wenn Brand das zulässt
- **Keine Schuldzuweisung:** "Etwas ist schiefgelaufen" statt "Sie haben einen Fehler gemacht"
- **Keine Dev-Begriffe:** "Paket" statt "Package", "Brain" statt "Knowledge Base"

## Anti-Patterns in Copy

- "Herzlich willkommen in unserer großartigen App!"
- "Revolutionär! Game-Changer! Next-Level!"
- "Bitte haben Sie einen Moment Geduld."
- "Ein unerwarteter Fehler ist aufgetreten."
- ALL CAPS für Emphasis
- Ausrufezeichen in Button-Labels
- Emoji-Fluten

## Sprachen

Bei bilingualen UIs (DE/EN):
- JEDES User-facing Field hat beide Übersetzungen
- Übersetzung nicht wörtlich, sondern kontext-gerecht
- Platzhalter gleich: "Name" / "Name", aber "E-Mail-Adresse" / "Email address"

## Test für jede neue UI-Copy

- [ ] Verb + Objekt bei Buttons?
- [ ] Max. 3 Worte wo möglich?
- [ ] Erklärt Empty State was zu tun ist?
- [ ] Sagt Error-Message Ursache UND Lösung?
- [ ] Sind Dev-Begriffe übersetzt?
- [ ] Konsistent mit Rest der App?
- [ ] Beide Sprachen (wenn i18n)?
