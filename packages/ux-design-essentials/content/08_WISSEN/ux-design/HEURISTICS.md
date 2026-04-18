---
title: "UX Heuristiken — Jakob Nielsen's 10 Regeln"
created: "2026-04-18"
version: 1
category: other
source: AI Brain Builder by Botinsky
package: ux-design-essentials
ai_ready: true
---

# UX Heuristiken — Jakob Nielsen's 10 Regeln

> Die fundamentalen Prinzipien jeder guten UI. Jeder Screen wird an diesen gemessen.

## 1. Visibility of System Status

Der User muss immer wissen was die App gerade tut.

- Jeder Klick reagiert in <100ms (Spinner, Skeleton, State-Change)
- Loading-States haben Progress wenn möglich, niemals leere Stille
- Nach erfolgreicher Action: Bestätigung (Toast, Inline-Feedback)
- Long-running tasks: Fortschrittsbalken mit Prozent

**Beispiel gut:** Linear zeigt nach Issue-Create sofort das Issue im Stream, nicht erst nach API-Antwort.
**Beispiel schlecht:** Button "Senden" wird gedrückt, nichts passiert sichtbar für 3 Sekunden.

## 2. Match between System and the Real World

Sprache aus dem Alltag, nicht Dev-Jargon.

- "Meine Aufgaben" statt "Task-Queue"
- "Postfach" statt "Inbox-Database"
- "Speichern" statt "Commit"
- Icons aus der echten Welt (Briefumschlag für Mail, Ordner für Folder)

**Beispiel gut:** Notion spricht von "Seite" und "Block", nicht von "Node" und "Element".

## 3. User Control and Freedom

Jede Aktion muss rückgängig machbar sein.

- Undo für mindestens 5 Sekunden nach destruktiven Aktionen
- "Zurück"-Navigation auf jedem Screen
- Formulare können verlassen werden, Eingaben bleiben erhalten
- Löschen immer mit Bestätigung (außer Undo ist sofort verfügbar)

**Beispiel gut:** Gmail Undo-Send bleibt 5-30 Sekunden aktiv.

## 4. Consistency and Standards

Dieselbe Aktion sieht überall gleich aus.

- Primärer Button immer in Brand-Farbe, nie variiert
- Icon-Set aus einer Familie (Lucide, Phosphor, Heroicons — nicht mischen)
- Navigation-Muster konsistent zwischen Screens
- Terminologie einheitlich ("Paket" überall, nicht mal "Package", mal "Modul")

**Beispiel gut:** Apple Human Interface Guidelines — jede macOS-App fühlt sich verwandt an.

## 5. Error Prevention

Lieber verhindern als heilen.

- Validierung während des Tippens, nicht erst bei Submit
- Unmögliche Optionen ausgrauen oder ausblenden
- Default-Werte die selten falsch sind
- Bestätigung bei destruktiven Aktionen (aber nur WENN wirklich destruktiv — nicht für jeden Klick)

**Beispiel gut:** Stripe prüft Kreditkarten-Nummer-Format live während du tippst.

## 6. Recognition rather than Recall

Zeig Optionen, lass den User nicht erinnern.

- Dropdowns statt Freitext wenn möglich
- Recent-Items sichtbar
- Command-Palettes mit Fuzzy-Search
- Breadcrumbs für Kontext

**Beispiel gut:** Raycast Command Palette — alle Aktionen suchbar, kein Memorieren nötig.

## 7. Flexibility and Efficiency of Use

Neulinge und Power-User unterstützen.

- Keyboard-Shortcuts für häufige Aktionen (Cmd+K, Cmd+S)
- Bulk-Actions für Listen
- Saved Views / Favoriten
- Power-User-Features nicht aufdrängen, aber verfügbar machen

**Beispiel gut:** Linear — Maus-Flow perfekt, aber jede Aktion hat Shortcut.

## 8. Aesthetic and Minimalist Design

Weniger ist mehr.

- Ein Screen beantwortet EINE Frage
- Keine "Dashboard-with-Everything"-Screens
- Whitespace als Design-Element, nicht Dekoration
- Farben sparsam, Text-Hierarchie klar

**Beispiel gut:** Apple.com Produktseiten — riesige Whitespace, ein Fokus pro Sektion.

## 9. Help Users Recognize, Diagnose, and Recover from Errors

Fehlermeldungen sind User-hilfreich.

- "Was ist passiert" plus "Was kannst du tun"
- Technische Details wegklappbar (für Dev/Support)
- Kein "Ein Fehler ist aufgetreten" ohne Kontext
- Link zu Hilfe oder Support wenn User selbst nicht lösen kann

**Beispiel gut:** Vercel-Deployment-Fehler zeigen Zeile im Log + Vorschlag zur Lösung.
**Beispiel schlecht:** "Error 500". Vielen Dank.

## 10. Help and Documentation

Kontext-Hilfe statt separates Help-Center.

- Tooltips nur wo Begriff nicht selbsterklärend
- Inline-Hilfe bei komplexen Formularen
- Onboarding-Tour optional, abbrechbar, wiederholbar
- FAQ direkt im relevanten Screen, nicht in separater Sektion

**Beispiel gut:** Stripe Dashboard hat "Why is this?" Links direkt neben technischen Feldern.

## Anwendung

Bei jedem Screen-Design: Check jede der 10 Heuristiken. Wenn eine verletzt — Design überarbeiten. Keine Ausnahmen.
