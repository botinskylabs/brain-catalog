# CRM für Agents

Zwei Wege führen an die Daten. Beide greifen auf dieselbe Datenbank zu, beide
können lesen **und** schreiben.

| | MCP | REST |
| --- | --- | --- |
| Für | Agents auf demselben Rechner (Claude Code, Claude Desktop, Brain Platform) | Agents/Dienste über das Netz, Automationen, n8n, Zapier |
| App muss laufen | nein | ja |
| Auth | Prozess-lokal | API-Key |

---

## 1. MCP (empfohlen für lokale Agents)

**Der bequeme Weg:** in der App im Menü **Agent-Zugang → MCP-Befehl kopieren**.
Der kopierte Befehl enthält bereits die richtigen Pfade deiner Installation —
einfach im Terminal einfügen und ausführen.

Er sieht auf einem Mac so aus:

```bash
claude mcp add crm \
  --env ELECTRON_RUN_AS_NODE='1' \
  --env CRM_DATA_DIR='/Users/DU/Library/Application Support/CRM' \
  -- '/Applications/CRM.app/Contents/MacOS/CRM' \
     '/Applications/CRM.app/Contents/Resources/app/src/mcp.js'
```

Sieht sperrig aus, hat aber einen Vorteil: die installierte App bringt ihr
eigenes Node mit (`ELECTRON_RUN_AS_NODE`), es muss also **nichts zusätzlich
installiert sein**.

Für Agents, die eine JSON-Konfiguration wollen (Claude Desktop, Brain Platform),
gibt es im selben Menü **MCP-Konfiguration kopieren (JSON)**:

```json
{
  "mcpServers": {
    "crm": {
      "command": "/Applications/CRM.app/Contents/MacOS/CRM",
      "args": ["/Applications/CRM.app/Contents/Resources/app/src/mcp.js"],
      "env": {
        "ELECTRON_RUN_AS_NODE": "1",
        "CRM_DATA_DIR": "/Users/DU/Library/Application Support/CRM"
      }
    }
  }
}
```

Wer aus dem Quellcode arbeitet, nimmt schlicht:

```bash
claude mcp add crm -- node /absoluter/pfad/zu/crm/src/mcp.js
```

Der MCP-Server liest dieselbe Datenbank wie die App — die App muss dafür **nicht
geöffnet sein**. Läuft beides gleichzeitig, ist das ebenfalls in Ordnung.

### Verfügbare Tools

| Tool | Zweck |
| --- | --- |
| `crm_stats` | Überblick: Kontakte nach Status, fällige Follow-ups, stille Kontakte, meistvernachlässigte Kunden |
| `crm_search_contacts` | Suchen/filtern nach Freitext, Status, Tag, `stale_days`, fälligen Follow-ups |
| `crm_get_contact` | ein Kontakt inkl. kompletter Historie |
| `crm_create_contact` | neuen Kontakt anlegen |
| `crm_update_contact` | Felder ändern (`custom` wird gemergt) |
| `crm_log_interaction` | Kontaktpunkt festhalten → aktualisiert „letzter Kontakt" |
| `crm_list_interactions` | Interaktionen chronologisch, optional gefiltert |
| `crm_list_tags` | alle Tags mit Anzahl |
| `crm_export` | kompletter Datenbestand als JSON — Basis für Reports und Präsentationen |

Jedes Tool liefert das Ergebnis sowohl als Text als auch als
`structuredContent`, ist also direkt weiterverarbeitbar.

### Prompt-Baustein für Olivia & Co.

> Du hast Zugriff auf mein CRM über die `crm_*`-Tools.
>
> - Verschaffe dir zuerst mit `crm_stats` einen Überblick, bevor du Fragen zu
>   Kunden beantwortest.
> - Für Auswertungen, Reports oder Präsentationen holst du dir mit `crm_export`
>   den vollständigen Bestand statt vieler Einzelabfragen.
> - Wenn ich von einem Gespräch, Call oder einer Mail mit einem Kunden erzähle,
>   halte das mit `crm_log_interaction` fest (`type` passend wählen, kurzer
>   `subject`, das Wesentliche in `notes`). Nur interne Gedanken bekommen
>   `type: "note"` — die zählen bewusst nicht als Kundenkontakt.
> - Neue Namen, die ich erwähne, legst du mit `crm_create_contact` an, statt
>   nachzufragen; fehlende Angaben können später ergänzt werden.
> - „Wen habe ich vernachlässigt?" beantwortest du über
>   `crm_search_contacts` mit `stale_days` und `sort: "oldest_contact"`,
>   „Was steht an?" über `due: true`.

---

## 2. REST-API

Basis: `http://127.0.0.1:4321/api`, solange die App läuft — die genaue Adresse
liefert das Menü **Agent-Zugang → API-Adresse kopieren** (ist Port 4321 belegt,
nimmt die App den nächsten freien). Antworten sind immer JSON, Listen in der
Form `{ total, limit, offset, items: [...] }`.

Authentifizierung, sobald der Dienst nicht nur lokal läuft:

```bash
curl -H "X-API-Key: $CRM_API_KEY" http://crm.example/api/stats
```

### Endpunkte

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| `GET` | `/api/health` | Lebenszeichen |
| `GET` | `/api/meta` | erlaubte Status, Interaktionstypen, Sortierungen |
| `GET` | `/api/stats` | Kennzahlen (siehe unten) |
| `GET` | `/api/export` | alles auf einmal; `?include_interactions=false` für nur Stammdaten |
| `GET` | `/api/tags` | Tags mit Anzahl |
| `GET` | `/api/contacts` | Liste, siehe Filter |
| `POST` | `/api/contacts` | anlegen (`name` genügt) |
| `GET` | `/api/contacts/:id` | Kontakt inkl. Historie |
| `PATCH` | `/api/contacts/:id` | teilweise ändern |
| `DELETE` | `/api/contacts/:id` | löschen (Historie geht mit) |
| `GET` | `/api/contacts/:id/interactions` | Historie eines Kontakts |
| `POST` | `/api/contacts/:id/interactions` | Kontaktpunkt festhalten |
| `GET` | `/api/interactions` | alle Interaktionen, gefiltert |
| `POST` | `/api/interactions` | Kontaktpunkt mit `contact_id` im Body |
| `GET/PATCH/DELETE` | `/api/interactions/:id` | einzelne Interaktion |

### Filter für `/api/contacts`

| Parameter | Wirkung |
| --- | --- |
| `q` | Freitext über Name, Firma, E-Mail, Rolle, Notizen, Tags |
| `status` | ein oder mehrere Status, kommagetrennt |
| `tag` | nur Kontakte mit diesem Tag |
| `stale_days` | letzter Kontakt länger als N Tage her (oder nie) |
| `due` | `true` = nur fällige Follow-ups |
| `due_before` | Follow-up fällig bis zu diesem Datum |
| `sort` | `last_contact`, `oldest_contact`, `name`, `company`, `created`, `next_follow_up` |
| `limit`, `offset` | Paging (Default 100, max 1000) |

### Beispiele

```bash
# Wer wurde seit 60 Tagen nicht kontaktiert – die stillsten zuerst?
curl "localhost:4321/api/contacts?stale_days=60&sort=oldest_contact&status=lead,aktiv"

# Was steht heute an?
curl "localhost:4321/api/contacts?due=true&sort=next_follow_up"

# Neuen Kontakt anlegen
curl -X POST localhost:4321/api/contacts \
  -H 'Content-Type: application/json' \
  -d '{"name":"Elena Fischer","company":"Fischer & Partner","status":"lead","tags":["kanzlei"]}'

# Call festhalten und gleich den nächsten Follow-up setzen
curl -X POST localhost:4321/api/contacts/5/interactions \
  -H 'Content-Type: application/json' \
  -d '{"type":"call","subject":"Angebot besprochen","notes":"Will bis KW 34 entscheiden","next_follow_up":"2026-08-20"}'

# Eigene Felder ergänzen (wird gemergt, nicht ersetzt)
curl -X PATCH localhost:4321/api/contacts/5 \
  -H 'Content-Type: application/json' \
  -d '{"custom":{"umsatz_2026":18000,"quelle":"Messe"}}'

# Alles für eine Auswertung
curl localhost:4321/api/export > crm-export.json
```

### Was `/api/stats` liefert

```json
{
  "total_contacts": 5,
  "total_interactions": 6,
  "interactions_last_30d": 3,
  "contacts_by_status": { "lead": 2, "aktiv": 1, "gewonnen": 1, "pausiert": 1 },
  "without_contact_30d": 3,
  "without_contact_90d": 2,
  "follow_ups_due": 1,
  "next_follow_ups": [ { "id": 3, "name": "…", "next_follow_up": "2026-08-08" } ],
  "most_neglected": [ { "id": 5, "name": "…", "days_since_contact": 120 } ]
}
```

### Fehler

Immer `{ "error": "Beschreibung" }` mit passendem Status: `400` bei ungültigen
Eingaben, `401`/`403` bei fehlendem Zugriff, `404` bei unbekannter ID.
