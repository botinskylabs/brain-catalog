import { getDb } from './db.js'

export const STATUSES = ['lead', 'aktiv', 'pausiert', 'gewonnen', 'verloren', 'archiviert']
export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'message', 'note', 'other']

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.status = 400
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Nicht gefunden') {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}

const nowIso = () => new Date().toISOString()
const today = () => new Date().toISOString().slice(0, 10)

function toIso(value, field) {
  if (value === undefined || value === null || value === '') return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) throw new ValidationError(`${field}: kein gueltiges Datum (${value})`)
  return d.toISOString()
}

function toDate(value, field) {
  const iso = toIso(value, field)
  return iso ? iso.slice(0, 10) : null
}

function normalizeTags(tags) {
  if (tags === undefined || tags === null) return undefined
  const list = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(',')
        .map((t) => t.trim())
  const cleaned = [...new Set(list.map((t) => String(t).trim()).filter(Boolean))]
  return JSON.stringify(cleaned)
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function hydrate(row) {
  if (!row) return null
  const lastContact = row.last_contact_at || null
  return {
    ...row,
    tags: parseJson(row.tags, []),
    custom: parseJson(row.custom, {}),
    last_contact_at: lastContact,
    days_since_contact: lastContact ? daysBetween(lastContact, nowIso()) : null,
    follow_up_overdue: Boolean(row.next_follow_up && row.next_follow_up <= today()),
  }
}

function daysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86_400_000)
}

const CONTACT_SELECT = `
  SELECT c.*,
    (SELECT MAX(i.occurred_at) FROM interactions i
      WHERE i.contact_id = c.id AND i.type <> 'note')          AS last_contact_at,
    (SELECT COUNT(*) FROM interactions i WHERE i.contact_id = c.id) AS interaction_count
  FROM contacts c
`

const SORTS = {
  last_contact: 'last_contact_at IS NULL ASC, last_contact_at DESC',
  oldest_contact: 'last_contact_at IS NULL DESC, last_contact_at ASC',
  name: 'name COLLATE NOCASE ASC',
  company: 'company COLLATE NOCASE ASC, name COLLATE NOCASE ASC',
  created: 'created_at DESC',
  next_follow_up: 'next_follow_up IS NULL, next_follow_up ASC',
}

/**
 * @param {object} filter
 * @param {string} [filter.q]            Freitextsuche (Name, Firma, E-Mail, Rolle, Notizen)
 * @param {string} [filter.status]       Status-Filter, mehrere kommagetrennt
 * @param {string} [filter.tag]          Kontakt hat diesen Tag
 * @param {number} [filter.stale_days]   Letzter Kontakt laenger her als N Tage (oder nie)
 * @param {string} [filter.due_before]   next_follow_up <= Datum (Default heute bei due=true)
 * @param {boolean}[filter.due]          Nur faellige Follow-ups
 * @param {string} [filter.sort]         last_contact | oldest_contact | name | company | created | next_follow_up
 */
export function listContacts(filter = {}) {
  const where = []
  const params = []

  if (filter.q) {
    const like = `%${filter.q}%`
    where.push(`(
      name LIKE ? OR company LIKE ? OR
      email LIKE ? OR role LIKE ? OR
      notes LIKE ? OR tags LIKE ?
    )`)
    params.push(like, like, like, like, like, like)
  }

  if (filter.status) {
    const statuses = String(filter.status)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (statuses.length) {
      where.push(`status IN (${statuses.map(() => '?').join(',')})`)
      params.push(...statuses)
    }
  }

  if (filter.tag) {
    where.push(`EXISTS (SELECT 1 FROM json_each(tags) t WHERE t.value = ? COLLATE NOCASE)`)
    params.push(String(filter.tag).trim())
  }

  if (filter.stale_days !== undefined && filter.stale_days !== null && filter.stale_days !== '') {
    const days = Number(filter.stale_days)
    if (!Number.isFinite(days) || days < 0) throw new ValidationError('stale_days: Zahl >= 0 erwartet')
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString()
    where.push('(last_contact_at IS NULL OR last_contact_at < ?)')
    params.push(cutoff)
  }

  if (filter.due || filter.due_before) {
    where.push('(next_follow_up IS NOT NULL AND next_follow_up <= ?)')
    params.push(filter.due_before ? toDate(filter.due_before, 'due_before') : today())
  }

  const orderBy = SORTS[filter.sort] || SORTS.last_contact
  const limit = Math.min(Number(filter.limit) || 100, 1000)
  const offset = Number(filter.offset) || 0
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const db = getDb()
  const rows = db
    .prepare(
      `WITH enriched AS (${CONTACT_SELECT})
       SELECT * FROM enriched ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset)
  const { total } = db
    .prepare(`WITH enriched AS (${CONTACT_SELECT}) SELECT COUNT(*) AS total FROM enriched ${whereSql}`)
    .get(...params)

  return { total, limit, offset, items: rows.map(hydrate) }
}

export function getContact(id, { withInteractions = true } = {}) {
  const db = getDb()
  const row = db.prepare(`WITH enriched AS (${CONTACT_SELECT}) SELECT * FROM enriched WHERE id = ?`).get(Number(id))
  if (!row) throw new NotFoundError(`Kontakt ${id} existiert nicht`)
  const contact = hydrate(row)
  if (withInteractions) contact.interactions = listInteractions({ contact_id: contact.id, limit: 200 }).items
  return contact
}

const WRITABLE = ['name', 'company', 'role', 'email', 'phone', 'website', 'status', 'notes']

function validateStatus(status) {
  if (status !== undefined && !STATUSES.includes(status)) {
    throw new ValidationError(`status: erlaubt sind ${STATUSES.join(', ')}`)
  }
}

export function createContact(input = {}) {
  const name = String(input.name ?? '').trim()
  if (!name) throw new ValidationError('name ist ein Pflichtfeld')
  validateStatus(input.status)

  const ts = nowIso()
  const row = {
    name,
    company: input.company ?? null,
    role: input.role ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    website: input.website ?? null,
    status: input.status ?? 'lead',
    tags: normalizeTags(input.tags) ?? '[]',
    notes: input.notes ?? null,
    next_follow_up: toDate(input.next_follow_up, 'next_follow_up'),
    custom: JSON.stringify(input.custom ?? {}),
    created_at: ts,
    updated_at: ts,
  }

  const cols = Object.keys(row)
  const { lastInsertRowid } = getDb()
    .prepare(`INSERT INTO contacts (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`)
    .run(...cols.map((c) => row[c]))

  return getContact(Number(lastInsertRowid))
}

export function updateContact(id, patch = {}) {
  const existing = getContact(id, { withInteractions: false })
  validateStatus(patch.status)

  const sets = []
  const params = []
  for (const field of WRITABLE) {
    if (patch[field] === undefined) continue
    if (field === 'name' && !String(patch.name).trim()) throw new ValidationError('name darf nicht leer sein')
    sets.push(`${field} = ?`)
    params.push(patch[field] === null ? null : String(patch[field]))
  }
  if (patch.tags !== undefined) {
    sets.push('tags = ?')
    params.push(normalizeTags(patch.tags))
  }
  if (patch.next_follow_up !== undefined) {
    sets.push('next_follow_up = ?')
    params.push(toDate(patch.next_follow_up, 'next_follow_up'))
  }
  if (patch.custom !== undefined) {
    // Merge statt Ersetzen – so koennen Agents einzelne Felder setzen.
    sets.push('custom = ?')
    params.push(JSON.stringify({ ...existing.custom, ...patch.custom }))
  }

  if (sets.length) {
    sets.push('updated_at = ?')
    params.push(nowIso(), existing.id)
    getDb()
      .prepare(`UPDATE contacts SET ${sets.join(', ')} WHERE id = ?`)
      .run(...params)
  }
  return getContact(existing.id)
}

export function deleteContact(id) {
  const contact = getContact(id, { withInteractions: false })
  getDb().prepare('DELETE FROM contacts WHERE id = ?').run(contact.id)
  return { deleted: true, id: contact.id, name: contact.name }
}

export function listInteractions(filter = {}) {
  const where = []
  const params = []

  if (filter.contact_id) {
    where.push('i.contact_id = ?')
    params.push(Number(filter.contact_id))
  }
  if (filter.type) {
    where.push('i.type = ?')
    params.push(String(filter.type))
  }
  if (filter.since) {
    where.push('i.occurred_at >= ?')
    params.push(toIso(filter.since, 'since'))
  }
  if (filter.until) {
    where.push('i.occurred_at <= ?')
    params.push(toIso(filter.until, 'until'))
  }
  if (filter.q) {
    where.push('(i.subject LIKE ? OR i.notes LIKE ?)')
    params.push(`%${filter.q}%`, `%${filter.q}%`)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const limit = Math.min(Number(filter.limit) || 100, 1000)
  const offset = Number(filter.offset) || 0

  const db = getDb()
  const items = db
    .prepare(
      `SELECT i.*, c.name AS contact_name, c.company AS contact_company
       FROM interactions i JOIN contacts c ON c.id = i.contact_id
       ${whereSql} ORDER BY i.occurred_at DESC, i.id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset)
  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM interactions i ${whereSql}`)
    .get(...params)

  return { total, limit, offset, items }
}

export function logInteraction(input = {}) {
  const contact = getContact(input.contact_id, { withInteractions: false })
  const type = input.type ?? 'note'
  if (!INTERACTION_TYPES.includes(type)) {
    throw new ValidationError(`type: erlaubt sind ${INTERACTION_TYPES.join(', ')}`)
  }

  const ts = nowIso()
  const { lastInsertRowid } = getDb()
    .prepare(
      `INSERT INTO interactions (contact_id, type, occurred_at, subject, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      contact.id,
      type,
      toIso(input.occurred_at, 'occurred_at') ?? ts,
      input.subject ?? null,
      input.notes ?? null,
      ts,
    )

  // Optionales Nachziehen des naechsten Follow-ups in einem Rutsch.
  if (input.next_follow_up !== undefined) {
    updateContact(contact.id, { next_follow_up: input.next_follow_up })
  } else {
    getDb().prepare('UPDATE contacts SET updated_at = ? WHERE id = ?').run(ts, contact.id)
  }

  return getInteraction(Number(lastInsertRowid))
}

export function getInteraction(id) {
  const row = getDb()
    .prepare(
      `SELECT i.*, c.name AS contact_name, c.company AS contact_company
       FROM interactions i JOIN contacts c ON c.id = i.contact_id WHERE i.id = ?`,
    )
    .get(Number(id))
  if (!row) throw new NotFoundError(`Interaktion ${id} existiert nicht`)
  return row
}

export function updateInteraction(id, patch = {}) {
  const existing = getInteraction(id)
  const sets = []
  const params = []

  if (patch.type !== undefined) {
    if (!INTERACTION_TYPES.includes(patch.type)) {
      throw new ValidationError(`type: erlaubt sind ${INTERACTION_TYPES.join(', ')}`)
    }
    sets.push('type = ?')
    params.push(patch.type)
  }
  if (patch.occurred_at !== undefined) {
    sets.push('occurred_at = ?')
    params.push(toIso(patch.occurred_at, 'occurred_at'))
  }
  for (const field of ['subject', 'notes']) {
    if (patch[field] === undefined) continue
    sets.push(`${field} = ?`)
    params.push(patch[field])
  }
  if (sets.length) {
    params.push(existing.id)
    getDb()
      .prepare(`UPDATE interactions SET ${sets.join(', ')} WHERE id = ?`)
      .run(...params)
  }
  return getInteraction(existing.id)
}

export function deleteInteraction(id) {
  const existing = getInteraction(id)
  getDb().prepare('DELETE FROM interactions WHERE id = ?').run(existing.id)
  return { deleted: true, id: existing.id }
}

export function listTags() {
  return getDb()
    .prepare(
      `SELECT t.value AS tag, COUNT(*) AS count
       FROM contacts c, json_each(c.tags) t
       GROUP BY t.value COLLATE NOCASE ORDER BY count DESC, tag ASC`,
    )
    .all()
}

/** Kompakte Kennzahlen – gedacht als Einstiegspunkt fuer Agents. */
export function stats() {
  const db = getDb()
  const byStatus = db.prepare('SELECT status, COUNT(*) AS count FROM contacts GROUP BY status').all()
  const { total_contacts } = db.prepare('SELECT COUNT(*) AS total_contacts FROM contacts').get()
  const { total_interactions } = db.prepare('SELECT COUNT(*) AS total_interactions FROM interactions').get()

  const staleCount = (days) =>
    listContacts({ stale_days: days, limit: 1, status: 'lead,aktiv,pausiert,gewonnen' }).total

  const due = listContacts({ due: true, limit: 5, sort: 'next_follow_up' })
  const neglected = listContacts({
    stale_days: 30,
    status: 'lead,aktiv,gewonnen',
    sort: 'oldest_contact',
    limit: 5,
  })

  const since = new Date(Date.now() - 30 * 86_400_000).toISOString()
  const { recent_interactions } = db
    .prepare(`SELECT COUNT(*) AS recent_interactions FROM interactions WHERE occurred_at >= ?`)
    .get(since)

  return {
    generated_at: nowIso(),
    total_contacts,
    total_interactions,
    interactions_last_30d: recent_interactions,
    contacts_by_status: Object.fromEntries(byStatus.map((r) => [r.status, r.count])),
    without_contact_30d: staleCount(30),
    without_contact_90d: staleCount(90),
    follow_ups_due: due.total,
    next_follow_ups: due.items.map(slim),
    most_neglected: neglected.items.map(slim),
  }
}

function slim(c) {
  return {
    id: c.id,
    name: c.name,
    company: c.company,
    status: c.status,
    last_contact_at: c.last_contact_at,
    days_since_contact: c.days_since_contact,
    next_follow_up: c.next_follow_up,
  }
}

/** Vollstaendiger Dump – fuer Agents, die daraus Reports/Praesentationen bauen. */
export function exportAll({ include_interactions = true } = {}) {
  const contacts = listContacts({ limit: 1000, sort: 'name' }).items
  if (include_interactions) {
    const all = listInteractions({ limit: 1000 }).items
    const byContact = new Map()
    for (const i of all) {
      if (!byContact.has(i.contact_id)) byContact.set(i.contact_id, [])
      byContact.get(i.contact_id).push(i)
    }
    for (const c of contacts) c.interactions = byContact.get(c.id) ?? []
  }
  return { exported_at: nowIso(), stats: stats(), contacts }
}
