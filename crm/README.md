# CRM

Eine eigenständige Desktop-App: Kunden, Kontakthistorie, Follow-ups — mit einem
Datenzugang, der von Anfang an für Agents gebaut ist.

- **Echte App** — eigenes Fenster, eigenes Icon, im Dock, ohne Terminal
- **Web-Oberfläche** — Tabelle, Suche, Filter, Detail-Ansicht mit Timeline
- **REST-API** — jeder Datensatz les- und schreibbar, solange die App läuft
- **MCP-Server** — Olivia & Co. bekommen direkte Tools (`crm_search_contacts`,
  `crm_log_interaction`, `crm_export`, …), ganz ohne installiertes Node
- **Deine Daten bleiben bei dir** — eine SQLite-Datei im Benutzerordner,
  kopieren = Backup, kein Cloud-Dienst dazwischen

## Installieren

### Variante A — fertigen Installer herunterladen (kein Node nötig)

Auf GitHub unter **Actions → „CRM-App bauen" → Run workflow**. Der Lauf baut
`.dmg` (macOS), `.exe` (Windows) und `.AppImage` (Linux); nach ein paar Minuten
hängen die Dateien unten am Lauf unter *Artifacts*.

### Variante B — selbst bauen (ein Befehl)

```bash
cd crm
./install.sh
```

Das prüft Node (≥ 22.5), lädt einmalig die Bau-Werkzeuge, baut die App und legt
sie unter macOS direkt in `/Applications` ab.

Einen weitergabefähigen Installer erzeugt `npm run dist:mac`
(bzw. `dist:win` / `dist:linux`) — Ergebnis liegt in `dist/`.

> **macOS-Hinweis:** Die App ist nicht bei Apple signiert (dafür bräuchte es ein
> kostenpflichtiges Entwicklerzertifikat). Beim ersten Start kann macOS meckern.
> `install.sh` räumt das automatisch weg. Bei einem heruntergeladenen `.dmg`
> hilft: Rechtsklick auf die App → *Öffnen*, oder einmalig
> `xattr -dr com.apple.quarantine /Applications/CRM.app`.

### Ohne Installation ausprobieren

```bash
cd crm
npm run seed     # optional: fünf Beispielkontakte
npm start        # http://127.0.0.1:4321 im Browser
```

Dafür braucht es kein `npm install` — der Server selbst hat null Abhängigkeiten.
Electron kommt erst für die Desktop-Hülle dazu.

```bash
npm test         # 8 Tests: Fachlogik, HTTP-API, MCP-Server
npm run app      # App-Fenster aus dem Quellcode starten
npm run dev      # Server mit Auto-Reload
```

## Wo die Daten liegen

| System | Pfad |
| --- | --- |
| macOS | `~/Library/Application Support/CRM/crm.db` |
| Windows | `%APPDATA%\CRM\crm.db` |
| Linux | `~/.config/CRM/crm.db` |
| Aus dem Quellcode gestartet | `crm/data/crm.db` |

Den genauen Pfad zeigt die App unter **Agent-Zugang → Datenordner anzeigen**.
Ein App-Update fasst diese Datei nie an.

## Datenmodell

Bewusst zwei Tabellen — mehr braucht es für den Anfang nicht, und beide sind
erweiterbar.

**contacts**

| Feld | Bedeutung |
| --- | --- |
| `id` | fortlaufende Nummer |
| `name` | einziges Pflichtfeld |
| `company`, `role`, `email`, `phone`, `website` | Stammdaten |
| `status` | `lead`, `aktiv`, `pausiert`, `gewonnen`, `verloren`, `archiviert` |
| `tags` | freie Liste, z. B. `["agentur", "bestandskunde"]` |
| `notes` | Freitext |
| `next_follow_up` | Datum `YYYY-MM-DD` |
| `custom` | freies JSON-Objekt für eigene Felder (Umsatz, Quelle, Vertragsende …) |
| `created_at`, `updated_at` | Zeitstempel |

**interactions** — jeder Kontaktpunkt

| Feld | Bedeutung |
| --- | --- |
| `contact_id` | zu welchem Kunden |
| `type` | `call`, `email`, `meeting`, `message`, `note`, `other` |
| `occurred_at` | wann (ISO-8601) |
| `subject`, `notes` | worum es ging |

**Abgeleitet, nie manuell zu pflegen:**

- `last_contact_at` — jüngste Interaktion, die kein `note` ist
- `days_since_contact` — Tage seit letztem Kontakt (`null` = noch nie)
- `follow_up_overdue` — `next_follow_up` liegt in der Vergangenheit

`type: "note"` zählt absichtlich **nicht** als Kontakt: eine interne Notiz ist
kein Gespräch mit dem Kunden.

## Wenn es später komplizierter werden soll

Die Struktur ist so gewählt, dass Erweiterungen nichts umbauen:

- **Eigene Felder ohne Schema-Änderung** → alles in `custom` ablegen; die API
  merged beim Update, statt zu überschreiben.
- **Neue Spalten oder Tabellen** (Deals, Firmen als eigene Entität, Aufgaben) →
  in `src/db.js` ans Array `migrations` einen weiteren Eintrag anhängen. Die
  Migration läuft beim nächsten Start automatisch, bestehende Daten bleiben.
- **Neue Endpunkte** → eine Zeile in `src/api.js`; die Logik selbst lebt
  ausschließlich in `src/service.js` und wird von HTTP-API **und** MCP-Server
  gemeinsam benutzt. Ein neues Feature ist damit sofort in beiden Welten da.
- **Anderes Aussehen** → `public/` ist reines HTML/CSS/JS ohne Framework und
  ohne Build. Farben liegen als CSS-Variablen oben in `styles.css`.

## Agents anbinden

Der schnellste Weg: in der App **Agent-Zugang → MCP-Befehl kopieren**, im
Terminal einfügen, fertig. Der Befehl enthält bereits die richtigen Pfade.

Alles Weitere — alle Tools, alle REST-Endpunkte, ein fertiger Prompt-Baustein
für Olivia — steht in **[docs/agents.md](docs/agents.md)**.

## Zugriff & Sicherheit

- Die App lauscht nur auf `127.0.0.1`, also nur auf deinem Rechner.
- Für Zugriff von außen (Server-Betrieb): `CRM_API_KEY` setzen und mit
  `X-API-Key: <key>` aufrufen. Fremde Adressen ohne gültigen Key bekommen 401.
  `CRM_REQUIRE_KEY=1` verlangt den Key zusätzlich lokal.
- Browser-Zugriffe von fremden Websites sind geblockt, solange deren Adresse
  nicht in `CRM_CORS_ORIGINS` steht.
- Wer den Dienst öffentlich stellt, sollte ihn hinter HTTPS betreiben — die App
  selbst spricht nur HTTP.

## Ordner

```
crm/
├── desktop/main.js   Desktop-Huelle: Fenster, Menue, Serverstart
├── src/
│   ├── service.js    Fachlogik: Kontakte, Interaktionen, Filter, Kennzahlen
│   ├── db.js         SQLite-Verbindung + Migrationen
│   ├── api.js        REST-Routen (dünne Hülle um service.js)
│   ├── server.js     HTTP-Server, Auth, statische Dateien
│   ├── mcp.js        MCP-Server (stdio) mit 9 Tools
│   └── seed.js       Beispieldaten
├── public/           Oberfläche (index.html, app.js, styles.css)
├── scripts/          Icon-Generator (ohne Bildbibliothek)
├── docs/agents.md    Agent- und API-Doku
├── install.sh        Bauen + installieren in einem Schritt
└── test/             Tests
```

Der Programmordner wird bewusst unverpackt ausgeliefert (`asar: false`), damit
Agents `src/mcp.js` direkt starten können und du jederzeit in den Code schauen
kannst.
