#!/usr/bin/env node
/**
 * MCP-Server (stdio, JSON-RPC 2.0) fuer das CRM.
 *
 * Greift direkt auf dieselbe SQLite-Datei zu wie der HTTP-Server – der Server
 * muss also nicht laufen. Einbinden z. B. mit:
 *   claude mcp add crm -- node /pfad/zu/crm/src/mcp.js
 */
import * as crm from './service.js'
import { config } from './config.js'

const SERVER_INFO = { name: 'crm', title: 'CRM', version: '0.1.0' }
const SUPPORTED_PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05']

const str = (description) => ({ type: 'string', description })
const num = (description) => ({ type: 'number', description })

const tools = [
  {
    name: 'crm_stats',
    description:
      'Ueberblick ueber das CRM: Anzahl Kontakte nach Status, faellige Follow-ups, ' +
      'wie viele Kontakte seit 30/90 Tagen keinen Kontakt hatten, sowie die am ' +
      'laengsten vernachlaessigten Kontakte. Guter Einstiegspunkt.',
    inputSchema: { type: 'object', properties: {} },
    handler: () => crm.stats(),
  },
  {
    name: 'crm_search_contacts',
    description:
      'Kontakte suchen und filtern. Ohne Parameter kommt die Liste sortiert nach ' +
      'letztem Kontakt zurueck. Jeder Treffer enthaelt last_contact_at und ' +
      'days_since_contact.',
    inputSchema: {
      type: 'object',
      properties: {
        q: str('Freitext (Name, Firma, E-Mail, Rolle, Notizen, Tags)'),
        status: str(`Status-Filter, kommagetrennt. Erlaubt: ${crm.STATUSES.join(', ')}`),
        tag: str('Nur Kontakte mit diesem Tag'),
        stale_days: num('Nur Kontakte, deren letzter Kontakt laenger als N Tage her ist (oder nie)'),
        due: { type: 'boolean', description: 'Nur Kontakte mit faelligem Follow-up' },
        sort: str('last_contact | oldest_contact | name | company | created | next_follow_up'),
        limit: num('Max. Treffer (Default 100, max 1000)'),
        offset: num('Offset fuer Paging'),
      },
    },
    handler: (args) => crm.listContacts(args),
  },
  {
    name: 'crm_get_contact',
    description: 'Einen Kontakt mit vollstaendiger Interaktions-Historie laden.',
    inputSchema: {
      type: 'object',
      properties: { id: num('ID des Kontakts') },
      required: ['id'],
    },
    handler: (args) => crm.getContact(args.id),
  },
  {
    name: 'crm_create_contact',
    description: 'Neuen Kontakt anlegen. Nur name ist Pflicht.',
    inputSchema: {
      type: 'object',
      properties: {
        name: str('Voller Name'),
        company: str('Firma'),
        role: str('Rolle / Position'),
        email: str('E-Mail'),
        phone: str('Telefon'),
        website: str('Website'),
        status: str(`Status, Default lead. Erlaubt: ${crm.STATUSES.join(', ')}`),
        tags: { type: 'array', items: { type: 'string' }, description: 'Freie Tags' },
        notes: str('Freitext-Notizen'),
        next_follow_up: str('Naechster Follow-up (YYYY-MM-DD)'),
        custom: { type: 'object', description: 'Beliebige Zusatzfelder als JSON' },
      },
      required: ['name'],
    },
    handler: (args) => crm.createContact(args),
  },
  {
    name: 'crm_update_contact',
    description:
      'Kontakt aktualisieren. Nur die uebergebenen Felder werden geaendert; ' +
      'custom-Felder werden gemergt.',
    inputSchema: {
      type: 'object',
      properties: {
        id: num('ID des Kontakts'),
        name: str('Voller Name'),
        company: str('Firma'),
        role: str('Rolle / Position'),
        email: str('E-Mail'),
        phone: str('Telefon'),
        website: str('Website'),
        status: str(`Erlaubt: ${crm.STATUSES.join(', ')}`),
        tags: { type: 'array', items: { type: 'string' }, description: 'Ersetzt die Tags komplett' },
        notes: str('Freitext-Notizen'),
        next_follow_up: str('Naechster Follow-up (YYYY-MM-DD), null zum Loeschen'),
        custom: { type: 'object', description: 'Zusatzfelder, werden gemergt' },
      },
      required: ['id'],
    },
    handler: ({ id, ...patch }) => crm.updateContact(id, patch),
  },
  {
    name: 'crm_log_interaction',
    description:
      'Kontaktpunkt protokollieren (Call, E-Mail, Meeting, Nachricht) und damit ' +
      'den "letzten Kontakt" aktualisieren. type=note zaehlt bewusst NICHT als Kontakt.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: num('ID des Kontakts'),
        type: str(`Art des Kontakts. Erlaubt: ${crm.INTERACTION_TYPES.join(', ')}`),
        occurred_at: str('Zeitpunkt (ISO-8601), Default jetzt'),
        subject: str('Kurze Betreffzeile'),
        notes: str('Was besprochen wurde'),
        next_follow_up: str('Optional gleich den naechsten Follow-up setzen (YYYY-MM-DD)'),
      },
      required: ['contact_id'],
    },
    handler: (args) => crm.logInteraction(args),
  },
  {
    name: 'crm_list_interactions',
    description: 'Interaktionen chronologisch abrufen – ueber alle Kontakte oder gefiltert.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: num('Nur Interaktionen dieses Kontakts'),
        type: str(`Nur dieser Typ. Erlaubt: ${crm.INTERACTION_TYPES.join(', ')}`),
        since: str('Ab diesem Zeitpunkt (ISO-8601 oder YYYY-MM-DD)'),
        until: str('Bis zu diesem Zeitpunkt'),
        q: str('Freitext in Betreff und Notizen'),
        limit: num('Max. Treffer (Default 100, max 1000)'),
      },
    },
    handler: (args) => crm.listInteractions(args),
  },
  {
    name: 'crm_list_tags',
    description: 'Alle vergebenen Tags mit Anzahl der Kontakte.',
    inputSchema: { type: 'object', properties: {} },
    handler: () => ({ items: crm.listTags() }),
  },
  {
    name: 'crm_export',
    description:
      'Kompletter Datenbestand (alle Kontakte inkl. Historie plus Kennzahlen) als JSON – ' +
      'gedacht als Grundlage fuer Reports, Auswertungen und Praesentationen.',
    inputSchema: {
      type: 'object',
      properties: {
        include_interactions: {
          type: 'boolean',
          description: 'Historie mitliefern (Default true)',
        },
      },
    },
    handler: (args) => crm.exportAll(args ?? {}),
  },
]

const byName = new Map(tools.map((t) => [t.name, t]))

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`)
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id, result })
}

function replyError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function handle(msg) {
  const { id, method, params } = msg
  const isNotification = id === undefined || id === null

  switch (method) {
    case 'initialize': {
      const requested = params?.protocolVersion
      return reply(id, {
        protocolVersion: SUPPORTED_PROTOCOLS.includes(requested) ? requested : SUPPORTED_PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          'CRM mit Kontakten und Interaktionen. Einstieg ueber crm_stats, dann gezielt ' +
          'crm_search_contacts. Kontaktpunkte immer mit crm_log_interaction festhalten, ' +
          'damit "letzter Kontakt" stimmt.',
      })
    }
    case 'ping':
      return reply(id, {})
    case 'tools/list':
      return reply(
        id,
        { tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) },
      )
    case 'tools/call': {
      const tool = byName.get(params?.name)
      if (!tool) return replyError(id, -32602, `Unbekanntes Tool: ${params?.name}`)
      try {
        const result = tool.handler(params.arguments ?? {})
        return reply(id, {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        })
      } catch (err) {
        return reply(id, { content: [{ type: 'text', text: `Fehler: ${err.message}` }], isError: true })
      }
    }
    case 'resources/list':
      return reply(id, { resources: [] })
    case 'prompts/list':
      return reply(id, { prompts: [] })
    default:
      if (isNotification) return // notifications/initialized etc.
      return replyError(id, -32601, `Methode nicht unterstuetzt: ${method}`)
  }
}

let buffer = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  buffer += chunk
  let index
  while ((index = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, index).trim()
    buffer = buffer.slice(index + 1)
    if (!line) continue
    let msg
    try {
      msg = JSON.parse(line)
    } catch {
      replyError(null, -32700, 'Parse error')
      continue
    }
    try {
      handle(msg)
    } catch (err) {
      console.error('[crm-mcp]', err)
      if (msg.id !== undefined && msg.id !== null) replyError(msg.id, -32603, err.message)
    }
  }
})
process.stdin.on('end', () => process.exit(0))

console.error(`[crm-mcp] bereit – Datenbank: ${config.dbPath}`)
