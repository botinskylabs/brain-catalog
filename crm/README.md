# CRM

Ein kleines, eigenständiges CRM: Kunden, Kontakthistorie, Follow-ups — und ein
Datenzugang, der von Anfang an für Agents gebaut ist.

- **Web-Oberfläche** — Tabelle, Suche, Filter, Detail-Ansicht mit Timeline
- **REST-API** — jeder Datensatz les- und schreibbar
- **MCP-Server** — Olivia & Co. bekommen direkte Tools (`crm_search_contacts`,
  `crm_log_interaction`, `crm_export`, …)
- **Null npm-Dependencies** — Node 22 mit eingebautem SQLite, kein Build-Schritt
- **Eine Datei als Datenbank** (`data/crm.db`) — kopieren = Backup

## Start

```bash
cd crm
npm run seed     # optional: fünf Beispielkontakte
npm start        # http://127.0.0.1:4321
```

Kein `npm install` nötig. Voraussetzung ist Node ≥ 22.5.

```bash
npm test         # 8 Tests: Service, HTTP-API, MCP-Server
npm run dev      # mit Auto-Reload
```

Konfiguration über Umgebungsvariablen oder eine `.env` im Ordner `crm/`
(Vorlage: `.env.example`).

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

## Zugriff & Sicherheit

- Ohne `CRM_API_KEY` lauscht der Server nur auf `127.0.0.1` und akzeptiert
  lokale Aufrufe ohne Schlüssel — bequem für den Rechner unterm Tisch.
- Sobald der Dienst irgendwo erreichbar sein soll: `CRM_API_KEY` setzen (auch
  mehrere, kommagetrennt) und mit `X-API-Key: <key>` oder
  `Authorization: Bearer <key>` aufrufen. Fremde Adressen ohne gültigen Key
  bekommen 401.
- `CRM_REQUIRE_KEY=1` verlangt den Key zusätzlich lokal.
- Browser-Zugriffe von fremden Origins sind geblockt, solange die Origin nicht
  in `CRM_CORS_ORIGINS` steht.

Wer den Dienst öffentlich stellt, sollte ihn hinter HTTPS (Reverse Proxy)
betreiben — die App selbst spricht nur HTTP.

## Agents anbinden

Siehe **[docs/agents.md](docs/agents.md)** — MCP-Einrichtung, alle REST-Endpunkte
mit Beispielen und ein fertiger Prompt-Baustein für Olivia.

Kurzfassung:

```bash
claude mcp add crm -- node /absoluter/pfad/zu/crm/src/mcp.js
```

## Ordner

```
crm/
├── src/
│   ├── service.js   Fachlogik: Kontakte, Interaktionen, Filter, Kennzahlen
│   ├── db.js        SQLite-Verbindung + Migrationen
│   ├── api.js       REST-Routen (dünne Hülle um service.js)
│   ├── server.js    HTTP-Server, Auth, statische Dateien
│   ├── mcp.js       MCP-Server (stdio) mit 9 Tools
│   └── seed.js      Beispieldaten
├── public/          Oberfläche (index.html, app.js, styles.css)
├── docs/agents.md   Agent- und API-Doku
└── test/            Tests
```
