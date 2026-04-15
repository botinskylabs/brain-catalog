---
id: ux-design-essentials
name: UX Design Essentials
version: 1.0.0
author:
  name: Botinsky Labs
  url: https://botinsky.com
description: UX-Heuristiken, Anti-Patterns, Referenz-Apps und Copy-Regeln. Nach Installation baut dein Agent Interfaces die wirklich funktionieren.
description_en: UX heuristics, anti-patterns, reference apps, and copy rules. After installation, your agent designs interfaces that actually work.
category: wissen
kind: knowledge
placement: shop
tags: [ux, ui, design, heuristics, product]
pricing:
  type: free
targets:
  - 08_WISSEN/ux-design/
requires_capabilities:
  - knowledge.read
  - text.generate
long_description: |
  Ein Agent ohne Design-Wissen schlägt Screens vor die wie aus dem Baukasten wirken: zu viele Elemente, inkonsistente Button-Hierarchie, Empty States ohne Next-Action. Mit diesem Paket kennt er die zehn Heuristiken von Jakob Nielsen, die üblichen Anti-Patterns, und hat eine Benchmark-Liste exzellenter Apps pro Screen-Typ.

  Konkret: Wenn du sagst "baue mir ein Settings-Screen", denkt er automatisch an Raycast-Gruppierung statt Endlos-Formular. Sagst du "Empty State für leere Liste", bekommst du Motivations-Text mit konkreter Next-Action statt "Keine Daten vorhanden". Sagst du "Button-Label", bekommst du Verb+Objekt mit max. 3 Worten statt "Jetzt hier klicken".

  Das Paket ist absichtlich markenneutral gehalten — du kombinierst es mit deinen eigenen Brand-Dateien (CI, Brand-Voice, ICP). Der Agent zieht beides zusammen und liefert Output der gut UND on-brand ist.
long_description_en: |
  An agent without design knowledge suggests screens that look like templates: too many elements, inconsistent button hierarchy, empty states without a next action. With this package installed, your agent knows Jakob Nielsen's ten heuristics, common anti-patterns, and has a benchmark list of excellent apps per screen type.

  Concretely: when you say "build me a settings screen", it thinks Raycast-style grouping, not endless form. Say "empty state for an empty list" and you get motivating copy with a concrete next action, not "No data available". Say "button label" and you get verb+object under 3 words, not "Click here now".

  The package is brand-neutral on purpose — combine it with your own brand files (CI, voice, personas). The agent pulls both together and delivers output that is both good AND on-brand.
use_cases:
  - title: Settings-Screen gestalten
    title_en: Design a settings screen
    prompt: Baue mir einen Settings-Screen mit 6 Optionen.
    prompt_en: Build me a settings screen with 6 options.
    outcome: Agent gruppiert Optionen nach Kontext (Raycast-Stil), nutzt Konsistenz-Heuristik für Button-Farben, und versteckt Admin-Optionen hinter einer Gate.
    outcome_en: Agent groups options by context (Raycast style), uses the consistency heuristic for button colors, and hides admin options behind a gate.
  - title: Empty State für eine leere Liste
    title_en: Empty state for an empty list
    prompt: Mach mir einen Empty State für "Noch keine Pakete installiert".
    prompt_en: Design an empty state for "No packages installed yet".
    outcome: Kein trockenes "Keine Daten" — sondern kurzer Motivationstext plus Haupt-CTA ("Installier dein erstes Paket → Shop öffnen"), mit Illustration oder Icon.
    outcome_en: No dry "No data" — instead short motivating copy plus main CTA ("Install your first package → Open shop"), with an illustration or icon.
  - title: Button-Labels und Copy prüfen
    title_en: Review button labels and copy
    prompt: Schau mal meine Buttons durch und korrigier alles was nicht Best Practice ist.
    prompt_en: Review my button labels and fix anything that isn't best practice.
    outcome: Agent sucht Lang-Labels wie "Jetzt hier klicken um fortzufahren" und ersetzt durch Verb+Objekt ("Fortfahren"), flagged unklare Icons und schlägt Tooltip-Regel-konforme Alternativen vor.
    outcome_en: Agent finds long labels like "Click here to continue" and replaces with verb+object ("Continue"), flags unclear icons, and suggests tooltip-rule-compliant alternatives.
what_you_get:
  - file: 08_WISSEN/ux-design/HEURISTICS.md
    description: Die 10 Nielsen-Heuristiken mit konkreten Beispielen aus Linear, Raycast, Notion.
    description_en: Jakob Nielsen's 10 heuristics with concrete examples from Linear, Raycast, Notion.
  - file: 08_WISSEN/ux-design/ANTI_PATTERNS.md
    description: Was in UI NIE tun — von Modals-in-Modals bis Formular-Validierung erst bei Submit.
    description_en: What to NEVER do in UI — from modals-in-modals to form validation only on submit.
  - file: 08_WISSEN/ux-design/REFERENCE_APPS.md
    description: Pro Screen-Typ (Settings, Empty State, File Browser, Onboarding) 2-3 Benchmark-Apps.
    description_en: Per screen type (settings, empty state, file browser, onboarding) 2-3 benchmark apps.
  - file: 08_WISSEN/ux-design/INFORMATION_ARCHITECTURE.md
    description: Navigations-Tiefe, Screen-per-Job-Prinzip, Admin-vs-User-Trennung, Suchbarkeit.
    description_en: Navigation depth, screen-per-job principle, admin-vs-user separation, findability.
  - file: 08_WISSEN/ux-design/COPY_GUIDE.md
    description: Button-Labels, Empty-State-Copy, Error-Messages, Tooltip-Sparsamkeit, Loading-States.
    description_en: Button labels, empty-state copy, error messages, tooltip parsimony, loading states.
  - file: 08_WISSEN/ux-design/PERSONA_FRAMEWORK.md
    description: Rahmen um deine eigene Zielgruppe für UI-Entscheidungen zu schärfen (tech level, device, nerv-faktor).
    description_en: Framework to sharpen your own target audience for UI decisions (tech level, device, frustrations).
triggers:
  - id: ux-screen-design
    when:
      - UI bauen
      - Screen designen
      - Layout
      - Komponente
      - Component
      - "build me a screen"
    then:
      - 08_WISSEN/ux-design/HEURISTICS.md
      - 08_WISSEN/ux-design/ANTI_PATTERNS.md
      - 08_WISSEN/ux-design/REFERENCE_APPS.md
    note: "Jede Screen-Empfehlung muss die 10 Heuristiken respektieren und Referenz-Apps als Benchmark nennen."
    note_en: "Every screen recommendation must respect the 10 heuristics and reference benchmark apps."
  - id: ux-copy-review
    when:
      - Copy prüfen
      - Button-Labels
      - Empty State
      - Error Message
      - Microcopy
    then:
      - 08_WISSEN/ux-design/COPY_GUIDE.md
      - 08_WISSEN/ux-design/ANTI_PATTERNS.md
    note: "Button-Labels max. 3 Worte, Verb+Objekt. Empty States mit Next-Action. Fehler erklären WAS passiert ist UND WIE beheben."
    note_en: "Button labels max 3 words, verb+object. Empty states with next action. Errors explain WHAT happened AND HOW to fix."
  - id: ux-information-architecture
    when:
      - Navigation
      - Menü
      - IA
      - Screen-Struktur
      - wo gehört
    then:
      - 08_WISSEN/ux-design/INFORMATION_ARCHITECTURE.md
      - 08_WISSEN/ux-design/PERSONA_FRAMEWORK.md
    note: "Hauptnavigation max. 7 Items, Verschachtelung max. 2 Ebenen. Admin-Features hinter Gate, nicht in normaler Navigation."
    note_en: "Main nav max 7 items, max 2 levels deep. Admin features behind a gate, not in normal navigation."
---

# UX Design Essentials

Kompaktes Wissen über gutes Interface-Design. Markenneutral. Kombiniere mit deinen eigenen Brand-Dateien.
