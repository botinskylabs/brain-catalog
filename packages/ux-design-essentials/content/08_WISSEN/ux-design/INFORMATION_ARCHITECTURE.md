# Information Architecture

> Wie Content und Funktionen strukturiert werden, damit User sie finden. Die oft unterschätzte Hälfte von UX.

## Grundregeln

### Hauptnavigation max. 7 Items

Mehr als 7 Top-Level-Einträge = User verloren. Ab 5 wird's schon knapp. Optimum: 4-6.

Wenn du mehr hast: gruppieren. "Profile, Settings, Billing, Integrations, Usage" → "Account & Billing" als Sektion.

### Max. 2 Verschachtelungs-Ebenen

Top-Level → Section → Item. Fertig. Wenn du Ebene 3 brauchst, denk nach ob das wirklich in der Navigation leben muss oder ob Suche reicht.

Beispiel OK: `Settings → Notifications → Email`.
Beispiel zu tief: `Settings → Advanced → System → Network → Proxy → HTTP`.

### Ein Screen = ein Job

Jeder Screen beantwortet EINE Frage oder erledigt EINE Aufgabe.

Gut: Screen "Rechnungen" zeigt Rechnungen. Filter + Suche. Klick auf Rechnung = Detail-Screen.
Schlecht: Screen "Dashboard" mit 10 Widgets die alle was anderes tun.

### Progressive Disclosure

Einfach zuerst, kompliziert auf Klick.

Nutzer sieht: die 3 wichtigsten Optionen. Klickt "Mehr": sieht 10. Klickt "Erweitert": sieht 30.

Nicht alles auf einmal zeigen — auch wenn's möglich wäre.

## Admin-vs-User-Trennung

**Kritisch:** End-User darf keine Settings sehen mit denen er die App zerstören kann.

Beispiele für Admin-only:
- Shop-Katalog-URL
- Dev-Endpoints
- System-Pfade
- Feature-Flags für Beta-Funktionen
- Bulk-Delete-Operationen

**Wie verstecken:**
- Passwort-Gate (simple, effektiv)
- Separater Admin-Mode mit Switch
- Komplett separate Admin-Oberfläche (z.B. nur via CLI)

**Niemals:** "versteckt" durch "klein und grau dargestellt" — neugierige User klicken trotzdem.

## Suchbarkeit

Wenn deine Navigation >4 Items hat, braucht's Suche.

- **Command Palette** (Cmd+K) ist Standard bei modernen Apps
- **Inline-Filter** in Listen (Stichwort-Filterung von Einträgen)
- **Global Search** im Header

Suche ist nie Ersatz für gute IA — aber Rettungsnetz für Power-User.

## Breadcrumbs

Bei verschachtelten Screens: Breadcrumb oben zeigt wo du bist + Weg zurück.

Format: `Settings › Notifications › Email` (mit Klick auf jede Ebene).

Nicht bei Top-Level-Screens nötig. Ab Ebene 2: ja.

## Empty-vs-Populated Navigation

Navigation kann sich verändern basierend auf App-Zustand.

Beispiele:
- "Projekte" Tab erscheint erst nachdem der erste Workspace angelegt ist
- "Admin" Tab nur sichtbar wenn Admin-Rolle
- "Billing" nur wenn kostenpflichtiges Tier

**Risiko:** User sieht plötzlich neue Navigation-Items und fragt "Wo kommt das her?".
**Lösung:** Kurzer Toast "Neuer Bereich verfügbar: Projekte" oder Onboarding-Tour bei Trigger-Event.

## Naming

Navigation-Labels folgen derselben Regel wie Button-Labels: **Substantiv oder Verb, kurz, eindeutig**.

- ✅ "Projekte", "Einstellungen", "Mein Brain"
- ❌ "Mein eigenes Profil", "Alle meine Projekte", "Konfigurationen für Erweiterungen"

Konsistenz zwischen Navigation und Page-Title: Navigation sagt "Rechnungen", Page-Title sagt auch "Rechnungen". Nicht "Invoices" oder "Abrechnung".

## Icons in Navigation

- Icon + Label = Standard für Hauptnav
- Nur Icon (Tooltip) = nur bei Platz-Mangel, max. 4 Icons
- Nur Label = wenn Icons nicht zum Brand passen

Icons müssen aus einer Familie kommen (alle Lucide ODER alle Heroicons — nie mischen).

## Shortcuts zur Navigation

Power-User-Navigation ohne Klick:

- `Cmd+K` — Command Palette (springt zu allem)
- `Cmd+1/2/3` — Top-Level-Nav-Items
- `Cmd+[/]` — Back/Forward
- `Esc` — Modal schließen / zurück

Einmal einrichten, konsistent durchziehen. Nicht 3 Tastenkombos für dieselbe Aktion.

## IA-Prozess beim Design

1. **Liste aller Features** auf Karten (Miro, Sticky Notes, Figma)
2. **Gruppieren nach Job** (Was gehört zusammen aus User-Sicht?)
3. **Hierarchie**: Was ist Top-Level, was Section, was Item?
4. **Testen** mit Card-Sorting — 3 User lassen selbst gruppieren. Wenn deine Gruppen ≠ deren Gruppen: überdenken.
5. **Naming-Check**: Jede Gruppe ein-Wort-Label finden. Wenn nicht möglich → Gruppe zerschlagen.

## Anti-Pattern: "Noch einbauen" in Navigation

Neue Features kommen — und Product Manager schiebt "einen neuen Tab" in die Nav.

Nach 6 Monaten: 12 Tabs, keine IA mehr.

**Richtig:** Jede neue Funktion vor Release IA-Frage: "Wo gehört das in die bestehende Struktur?". Wenn's nirgendwo passt — entweder nicht bauen ODER IA überdenken.

## Prüf-Fragen bei jedem Screen

- Welche Frage beantwortet dieser Screen?
- Welche Aktion ist die primäre? (max. 1 pro Screen)
- Was sind sekundäre Aktionen? (max. 3)
- Wo ist der "zurück"-Weg?
- Was passiert bei leerem Zustand?
- Wie findet ein User diesen Screen? (Nav-Pfad, Suche, Direktlink)
