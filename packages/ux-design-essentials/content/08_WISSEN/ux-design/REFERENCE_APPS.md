# Referenz-Apps pro Screen-Typ

> Benchmark-Apps die den jeweiligen Screen-Typ besonders gut lösen. Wenn du einen Screen baust, orientiere dich daran.

## Settings

- **Raycast** — Gruppierung nach Kontext (Allgemein, Extensions, Erweiterungen). Jedes Setting ein-Satz-erklärt. Keyboard-Shortcuts visible.
- **Arc Browser** — Einstellungs-Overlay statt separater Screen. Schnell zu, schnell wieder raus.
- **Linear** — Workspace Settings ohne Overload. Max. 5 Sektionen pro Scroll-View.

**Was sie gemeinsam haben:** Suche am Anfang. Max. 2 Ebenen tief. Alles aus Kundenalltag benannt, kein Dev-Jargon.

## Empty States

- **Notion** — "Seite noch leer" mit 4 Template-Buttons + Illustration.
- **Linear** — "Noch keine Issues" mit 1 großem Create-Button.
- **GitHub** — Leeres Repo hat README-Erstell-Schritt eingebaut.

**Was sie gemeinsam haben:** Ein Satz "Was wäre hier wenn …". Ein primärer Next-Action-Button. Klein Illustration oder Icon.

## Onboarding

- **Linear** — 3 Screens max: Workspace, erstes Projekt, erstes Issue. Fertig.
- **Vercel Dashboard** — Git-Connect, Deploy, done. Alles in einem Flow.
- **Stripe** — Account-Info, erstes Produkt, Testkarte — dann in Dashboard.

**Was sie gemeinsam haben:** Linear, max. 3-5 Schritte. Jeder Schritt ist handlungsfähig. Skip-Optionen sichtbar. Kein "Tour durch alle Features".

## File-Explorer / Listen-Ansicht

- **Obsidian** — Split-Pane, Tree links, Content rechts. Breadcrumbs. Favoriten.
- **VS Code** — Gleiche Struktur, mit Recently-Opened, Search integriert.
- **Finder** — Column-View (Sidebar + verschachtelte Spalten) für tiefe Hierarchien.

**Was sie gemeinsam haben:** Zweigeteilt. Breadcrumbs für Orientierung. Keyboard-Navigation. Drag-and-Drop.

## Command Palette

- **Raycast** — Die Referenz. Fuzzy-Suche, Keyboard-first, Preview-Pane rechts.
- **Linear** — Cmd+K öffnet Command Palette, alle Aktionen suchbar.
- **VS Code** — Quick Open (Cmd+P) und Command Palette (Cmd+Shift+P) getrennt.

**Was sie gemeinsam haben:** Keyboard-Shortcut prominent kommuniziert. Fuzzy-Matching. Recent-Items oben.

## Dark Theme

- **Linear** — Warm-Dunkel-Surface, nicht pure black. Akzentfarbe sparsam.
- **Raycast** — Transparente Blur-Effekte, aber lesbarer Kontrast.
- **Arc Browser** — Dark als Default, warm-getinted.

**Was sie gemeinsam haben:** Hintergrund #0A-#12 Range, nicht #000. Text #EDE-#F5 range, nicht #FFF. Eine Akzentfarbe die nicht in Fließtext auftaucht.

## Dashboards / Übersichts-Screens

- **Linear Inbox** — Eine zentrale Liste, sortiert nach Priorität. Keine 10 Widgets.
- **GitHub Home** — Feed der relevanten Repos. Kein generisches Dashboard.
- **Vercel Dashboard** — Deployment-Liste + Status. Ein Job pro Screen.

**Was sie gemeinsam haben:** Ein Fokus-Bereich pro Screen. Keine Widget-Soups. Infos die sofort handlungsfähig sind.

## Formulare / Eingaben

- **Stripe Checkout** — Live-Validierung, Feld-Gruppierung, klare Fehler-Messages.
- **Typeform** — Ein Feld pro Screen (bei langen Forms). Enter = nächstes Feld.
- **Linear Create-Issue** — Inline im Sidebar, alle Felder sichtbar, Keyboard-Flow.

**Was sie gemeinsam haben:** Inline-Validation. Smart Defaults. Keyboard-navigierbar.

## Error States

- **Vercel Deploy-Error** — Zeigt Zeile im Log, Fehler-Kategorie, Lösungs-Vorschlag.
- **Stripe Payment-Error** — Kunden-freundlich formuliert, "Retry"-Button prominent.
- **GitHub 404** — Playful Octocat-Illustration, aber mit Hilfe-Links.

**Was sie gemeinsam haben:** Erklären WAS und WIE beheben. Technik für Techies verfügbar (Details-Link). Weg raus aus dem Fehler.

## Mobile-first (wenn relevant)

- **Instagram** — Gesten-Navigation, Bottom-Nav, Thumb-freundlich.
- **Threads** — Karten-Layout, großzügige Touch-Targets.
- **Apple Maps** — Sheet-Pattern: Content von unten, scrollt über Content.

## Wie die Liste nutzen

Bei "baue mir Screen X" → check diese Liste, nimm 2 Benchmarks, schau wie sie es lösen, adaptiere. Nicht kopieren, sondern Prinzipien übertragen.

Die Liste ist bewusst englisch-dominant — die meisten guten Apps kommen aus dem US-Markt. Deutsche Referenzen meist schwächer in UX.
