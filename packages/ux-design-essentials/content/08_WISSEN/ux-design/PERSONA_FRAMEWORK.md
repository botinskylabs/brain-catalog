---
title: "Persona Framework für UI-Entscheidungen"
created: "2026-04-18"
version: 1
category: other
source: AI Brain Builder by Botinsky
package: ux-design-essentials
ai_ready: true
---

# Persona Framework für UI-Entscheidungen

> Ein Rahmen um deine eigene Zielgruppe zu schärfen. Füll ihn aus und kombinier ihn mit dem Rest des Design-Wissens.

## Die 5 entscheidenden Persona-Fragen für UI

### 1. Technisches Niveau

Wie technisch ist deine Hauptzielgruppe?

- **Beginner:** Kennt Browser + Word. Kein Terminal, kein Git, keine Kommandozeile.
- **Intermediate:** Kann Finder, versteht Datei-Pfade, hat vielleicht mal eine App installiert.
- **Advanced:** Kann Terminal-Commands, kennt JSON, macht gelegentlich Dev-nahe Dinge.
- **Expert:** Entwickler, Tech-Lead, Power-User.

**Was das für UI heißt:**
- Beginner → zero-config Install, keine Pfade sichtbar, alles über Klicks
- Intermediate → Pfade OK, JSON-Editor nicht
- Advanced → Shortcuts, Power-Modes, CLI-Option
- Expert → Config-Files editierbar, API-Zugang

### 2. Motivation

Warum nutzt die Zielgruppe dein Produkt?

- **Zeit sparen:** Will's schnell weg-arbeiten. Keine Tutorials. Beispiel-Tool schon eingerichtet.
- **Kontrolle:** Will alles selbst steuern. Jeder Parameter einstellbar. Advanced-Options sichtbar.
- **Neugier / Lernen:** Will verstehen wie's funktioniert. Tooltips willkommen. "How does this work"-Links.
- **Status / Besser-werden:** Will professioneller wirken. Elegante UI, kein Baukasten-Look.

**Was das für UI heißt:**
- Zeit sparen → Defaults die oft richtig sind, Skip-Onboarding-Option
- Kontrolle → Advanced-Panel, keine "weil wir's wissen"-Defaults
- Neugier → Didaktische Elemente, "Warum ist das so?"-Links
- Status → Premium-Feeling, keine Stock-Photos

### 3. Device-Kontext

Wo wird das Produkt hauptsächlich genutzt?

- **Desktop (Laptop)** — Maus + Tastatur, große Fläche, komplexe UIs möglich
- **Tablet** — Touch, mittlere Fläche, Portrait/Landscape
- **Mobile** — Touch, klein, nur eine Aktion auf dem Screen gleichzeitig
- **Multi-Device** — muss nahtlos wechseln

**Was das für UI heißt:**
- Desktop → Shortcuts relevant, Split-Panes OK, Hover-States nutzbar
- Tablet → Größere Touch-Targets, weniger hover-only
- Mobile → Ein Job pro Screen, Bottom-Nav, Fat-Finger-Targets
- Multi → Responsive von Anfang an, Testing auf allen

### 4. Geduld / Frustrations-Schwelle

Wie schnell gibt deine Zielgruppe auf?

- **Niedrig (Consumer):** <10 Sekunden Unverständnis → App zu. Zurück zu Instagram.
- **Mittel (Business-User):** ~1 Minute Probieren, dann Support-Ticket oder nächste Lösung.
- **Hoch (Power-User / Dev):** Wird investigieren, RTFM, Stack-Overflow, selbst lösen.

**Was das für UI heißt:**
- Niedrig → Zero-Config, Onboarding-Tour, sofort "Wow"-Moment
- Mittel → Tutorial-Videos sichtbar, Chat-Support nah
- Hoch → Doku ausführlich, keine Hand-Holding, aber zugänglich

### 5. Pet-Peeves / Was die Zielgruppe hasst

Jede Zielgruppe hat ihre individuellen "NO-GO"s. Die musst du kennen.

**Häufige Muster:**
- Cookie-Banner-Pflicht → Konsumenten hassen das
- Account-Zwang vor Demo → Konsumenten abspringen
- Stock-Photos → Premium-Kunden finden das billig
- Emoji-Fluten → Business-User nehmen's nicht ernst
- Zu viel Dev-Jargon → Normaluser verloren
- Pop-Ups → alle hassen sie

**Wie du's findest:** Interviews, Reviews anderer Produkte im Feld, oder selbst ehrlich sein — was nervt dich selbst?

## Format für deine eigene Persona

Lege pro Hauptzielgruppe eine Datei an. Beispiel-Struktur:

```markdown
# Persona: <Name>

## Kurzprofil
- 45 Jahre, Selbstständig in Dienstleistung
- Führt Team von 2-3 Personen
- Hauptgerät: MacBook, gelegentlich iPhone

## Technisches Niveau
Intermediate. Kann Tool-Install, Datei-Pfade OK. Terminal nein.

## Motivation
Zeit sparen. Will Business automatisieren, nicht Software lernen.

## Device
Desktop primary (95%), Mobile für Checks (5%).

## Frustrations-Schwelle
Mittel. Probiert 2 Minuten, dann entweder aufgeben oder Support.

## Pet-Peeves
- Cookie-Banner
- Dev-Jargon ("API", "Endpoint", "Token")
- Überladene Dashboards
- Copy-Phrasen wie "Revolutionär", "Game-Changer"

## UI-Implikationen
- Default-Setup funktioniert aus dem Stand
- Advanced-Optionen versteckt aber verfügbar
- Sprache: Alltag ("Konto", "Rechnung"), nicht Tech ("Account", "Invoice")
- Onboarding linear, max. 3 Schritte, mit Skip-Option
```

## Mehrere Personas?

Viele Produkte haben 2-3 Persona-Typen. Das ist OK, aber:

- **Primär-Persona** bestimmt die Hauptnavigation + Default-Flow
- **Sekundär-Persona** bekommt Power-Features + Shortcuts
- **Rest** ist akzeptables Kollateral

**Nie versuchen "für alle" zu designen** — wird für niemanden gut.

## Wie der Agent die Persona nutzt

Bei "baue mir Screen X" liest der Agent:
1. Deine Persona(s)
2. UX-Heuristiken (generisch)
3. Deine Brand-Files (CI, Voice)

Daraus entsteht ein Screen der **für DEINE Zielgruppe** optimiert ist — nicht für ein generisches Ideal. Andere Zielgruppen würden denselben Screen vielleicht anders brauchen, und das ist ok.

## Anti-Pattern: "Die beste Version für alle"

Das gibt es nicht. Ein Screen der für Consumer perfekt ist, ist für Dev langweilig. Ein Screen für Dev ist für Consumer einschüchternd.

**Lösung:** Persona zuerst festlegen, dann designen. Wenn wirklich 2 Zielgruppen: 2 UI-Modi (z.B. "Einfach" und "Erweitert" Toggle).
