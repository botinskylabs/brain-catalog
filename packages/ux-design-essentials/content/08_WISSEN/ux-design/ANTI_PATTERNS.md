# UI Anti-Patterns — was NIE machen

> Die UX-Fehler die User immer wieder nervt. Jeder Agent-Vorschlag muss diese Fallen vermeiden.

## Interaktions-Fehler

### Modals-in-Modals-in-Modals
Ein Dialog öffnet einen Dialog öffnet einen Dialog. User verliert Kontext und Escape-Route.
**Richtig:** Max. 1 Modal-Ebene. Weiterführende Aktionen inline im Modal.

### Ladebalken ohne Fortschritt
Spinner der sich ewig dreht ohne Prozent/ETA. User weiß nicht ob App hängt oder arbeitet.
**Richtig:** Fortschritts-Balken mit Prozent bei allem >2 Sekunden.

### Formular-Validierung erst bei Submit
User tippt 10 Felder, drückt Submit, kriegt 8 Fehler zurück.
**Richtig:** Inline-Validierung während des Tippens (mit Debounce 500ms).

### Auto-Focus in unerwarteten Feldern
Cursor springt plötzlich woandershin, User tippt ins Nichts.
**Richtig:** Nur das erste sinnvolle Feld auto-fokussieren. Nicht mid-session.

### Verschwindende Controls
Buttons die nur on-hover erscheinen werden auf Touch-Screens unsichtbar.
**Richtig:** Controls immer sichtbar, Hover-States nur für Highlight.

## Navigations-Fehler

### Endlose Hierarchie
Settings → Advanced → System → Network → Proxy → HTTP → Port.
**Richtig:** Max. 2 Verschachtelungs-Ebenen. Tiefere Optionen flach via Suche.

### Versteckte Admin-Sektionen
Kritische Admin-Features in normalen Settings-Listen. End-User zerstört App versehentlich.
**Richtig:** Admin hinter Passwort-Gate oder separatem Mode. Badge "ADMIN" wenn sichtbar.

### Zurück-Button fehlt
Subscreens ohne Back-Navigation. User kommt nur über Browser-Back zurück.
**Richtig:** Breadcrumbs ODER Back-Button auf jedem Sub-Screen.

### Hamburger-Menü für Desktop
Mobile-Pattern auf Desktop. Navigation wird unsichtbar.
**Richtig:** Desktop = sichtbare Sidebar oder Top-Nav. Hamburger nur Mobile.

## Copy-Fehler

### Dev-Jargon in UI
"400 Bad Request", "Null Pointer Exception", "Token expired".
**Richtig:** "Etwas ist schiefgelaufen. Bitte erneut anmelden. [Details anzeigen]"

### Nutzlose Bestätigungen
"Sind Sie sicher?" für jede Kleinigkeit. User klickt blind weg.
**Richtig:** Bestätigung nur bei wirklich destruktiven Aktionen. Alles andere mit Undo.

### Schreit-Copy
"JETZT HIER KLICKEN!!!", "REVOLUTIONÄR", "Game-Changer".
**Richtig:** Ruhiger Ton, Fakten, klare Verben.

### Mystery-Icons
Icon ohne Label das keiner kennt. User muss raten oder per Tooltip lernen.
**Richtig:** Unbekannte Icons mit Label. Nur Standard-Icons ohne Label (Suche, Einstellungen, X).

## Visual-Design-Fehler

### Regenbogen-Farben
Jeder Status in anderer Farbe — Grün, Blau, Lila, Orange, Teal. Hierarchie unklar.
**Richtig:** 1 Akzentfarbe, 1 Erfolg, 1 Warnung, 1 Fehler. Alles andere Grau-Töne.

### Pure White auf Pure Black
#FFFFFF auf #000000 ist visueller Stress, Augen ermüden.
**Richtig:** Warme Off-Whites (#EDEDEE) auf warmen Darks (#0A0A0C).

### Stock-Photos
Generische Business-Menschen in Büros, Hände-Shakes, Jubeljubiläumsbilder.
**Richtig:** Echte Screenshots, eigene Illustrationen, oder gar keine Bilder.

### Emoji-Fluten
🎉 Willkommen! 🚀 Jetzt loslegen! ✨ Neu!
**Richtig:** Emojis sparsam. Maximal eins pro Screen-Sektion, und nur wenn Sinn hinzufügt.

## Dark-Patterns (NIEMALS)

- Cookie-Banner der den Screen blockiert bis "Alle akzeptieren"
- "Account deaktivieren" in Settings, aber nur über Support löschen
- Subscribe-Button grell, Unsubscribe-Link winzig und grau
- Newsletter-Opt-in als default angehakt
- Preis-Angabe pro Monat aber nur bei Jahres-Abo

Das ist nicht UX, das ist Manipulation. Auch wenn es Conversion hebt — verliert langfristig Vertrauen.

## Loading-State-Fehler

### Skeleton-UI zu lange
Skeletons die 5+ Sekunden stehenbleiben. User denkt App ist kaputt.
**Richtig:** Skeleton für 1-2 Sekunden, dann Echt-Content oder Error-State.

### Alles gleichzeitig laden
Screen mit 10 Sektionen wartet bis alle Daten da sind, dann blinkt alles rein.
**Richtig:** Progressive Loading. Kritischer Content zuerst, Nice-to-haves später.

### Empty State = Kein Hinweis
"Keine Daten vorhanden." Punkt.
**Richtig:** Empty States erklären was wäre wenn, und haben einen klaren Next-Action-Button.

## Mobile-spezifisch

### Fat-Finger-Fallen
Klick-Targets <44px. Nur treffbar mit 5 Versuchen.
**Richtig:** Min. 44x44px Touch-Target, 8px Abstand zu anderen Controls.

### Form ohne Submit-Tastatur
Text-Inputs ohne `type` — Tastatur zeigt keine Return-Taste.
**Richtig:** `type="email"` für Mail, `inputMode="numeric"` für Zahlen, etc.

### Viewport-Sprünge
Auto-Scroll zu Feldern mit Focus. User verliert Orientierung.
**Richtig:** User scrollt selbst. Auto-Scroll nur bei explizitem "scroll to error".

## Check-Liste bei jedem Screen-Design

- [ ] Keine verschachtelten Modals
- [ ] Loading mit Progress
- [ ] Live-Validierung in Formularen
- [ ] Admin-Features gated
- [ ] Back-Navigation vorhanden
- [ ] Copy in Verbraucher-Sprache
- [ ] Bestätigungen nur wo nötig
- [ ] Farben sparsam
- [ ] Empty States mit Next-Action
- [ ] Touch-Targets min. 44px
