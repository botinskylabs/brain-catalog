import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const workDir = mkdtempSync(path.join(tmpdir(), 'crm-test-'))
process.env.CRM_DATA_DIR = workDir
process.env.CRM_DB_PATH = path.join(workDir, 'test.db')
process.env.CRM_PORT = '0'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')
const crm = await import('../src/service.js')
const { createServer } = await import('../src/server.js')

process.on('exit', () => rmSync(workDir, { recursive: true, force: true }))

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString()

test('Kontakt anlegen, lesen, aktualisieren', () => {
  const created = crm.createContact({
    name: '  Maria Hoffmann ',
    company: 'Nordlicht',
    tags: ['agentur', 'agentur', ' bestandskunde '],
    status: 'aktiv',
  })
  assert.equal(created.name, 'Maria Hoffmann')
  assert.deepEqual(created.tags, ['agentur', 'bestandskunde'])
  assert.equal(created.last_contact_at, null)
  assert.equal(created.days_since_contact, null)

  const updated = crm.updateContact(created.id, { role: 'CEO', custom: { umsatz: 12000 } })
  assert.equal(updated.role, 'CEO')
  assert.deepEqual(updated.custom, { umsatz: 12000 })

  const merged = crm.updateContact(created.id, { custom: { quelle: 'Empfehlung' } })
  assert.deepEqual(merged.custom, { umsatz: 12000, quelle: 'Empfehlung' })
})

test('Pflichtfelder und Enums werden geprueft', () => {
  assert.throws(() => crm.createContact({ name: '   ' }), /Pflichtfeld/)
  assert.throws(() => crm.createContact({ name: 'X', status: 'unbekannt' }), /status/)
  assert.throws(() => crm.getContact(99999), /existiert nicht/)
})

test('Interaktionen setzen den letzten Kontakt – Notizen nicht', () => {
  const contact = crm.createContact({ name: 'Jonas Weber' })

  crm.logInteraction({ contact_id: contact.id, type: 'note', notes: 'interner Vermerk' })
  assert.equal(crm.getContact(contact.id).last_contact_at, null)

  crm.logInteraction({ contact_id: contact.id, type: 'call', occurred_at: daysAgo(3), subject: 'Update' })
  const after = crm.getContact(contact.id)
  assert.equal(after.days_since_contact, 3)
  assert.equal(after.interaction_count, 2)
  assert.equal(after.interactions.length, 2)

  assert.throws(() => crm.logInteraction({ contact_id: contact.id, type: 'brieftaube' }), /type/)
})

test('Filter: Suche, Tag, stale_days, faellige Follow-ups', () => {
  const stale = crm.createContact({ name: 'Tom Brenner', tags: ['kreativ'] })
  crm.logInteraction({ contact_id: stale.id, type: 'call', occurred_at: daysAgo(120) })
  crm.updateContact(stale.id, { next_follow_up: '2020-01-01' })

  assert.equal(crm.listContacts({ q: 'brenner' }).total, 1)
  assert.equal(crm.listContacts({ tag: 'KREATIV' }).total, 1)
  assert.ok(crm.listContacts({ stale_days: 90 }).items.some((c) => c.id === stale.id))
  assert.ok(!crm.listContacts({ stale_days: 200 }).items.some((c) => c.id === stale.id))

  const due = crm.listContacts({ due: true })
  assert.ok(due.items.some((c) => c.id === stale.id))
  assert.ok(due.items.every((c) => c.follow_up_overdue))

  const sorted = crm.listContacts({ sort: 'name' }).items.map((c) => c.name)
  assert.deepEqual([...sorted].sort((a, b) => a.localeCompare(b)), sorted)
})

test('Stats und Export liefern konsistente Zahlen', () => {
  const stats = crm.stats()
  assert.equal(stats.total_contacts, crm.listContacts({ limit: 1000 }).total)
  assert.ok(stats.follow_ups_due >= 1)
  assert.ok(Array.isArray(stats.most_neglected))

  const dump = crm.exportAll()
  assert.equal(dump.contacts.length, stats.total_contacts)
  assert.ok(dump.contacts.every((c) => Array.isArray(c.interactions)))
})

test('Loeschen entfernt auch die Historie', () => {
  const contact = crm.createContact({ name: 'Weg damit' })
  crm.logInteraction({ contact_id: contact.id, type: 'email' })
  crm.deleteContact(contact.id)
  assert.equal(crm.listInteractions({ contact_id: contact.id }).total, 0)
  assert.throws(() => crm.getContact(contact.id), /existiert nicht/)
})

test('HTTP-API: CRUD ueber localhost ohne Key', async () => {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const call = async (path, options) => {
    const res = await fetch(base + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })
    return { status: res.status, body: await res.json() }
  }

  try {
    assert.equal((await call('/api/health')).body.ok, true)

    const created = await call('/api/contacts', { method: 'POST', body: { name: 'API Kunde' } })
    assert.equal(created.status, 201)
    const id = created.body.id

    await call(`/api/contacts/${id}/interactions`, {
      method: 'POST',
      body: { type: 'meeting', subject: 'Kickoff', next_follow_up: '2030-01-01' },
    })

    const fetched = await call(`/api/contacts/${id}`)
    assert.equal(fetched.body.interactions.length, 1)
    assert.equal(fetched.body.next_follow_up, '2030-01-01')
    assert.equal(fetched.body.days_since_contact, 0)

    const search = await call('/api/contacts?q=API%20Kunde')
    assert.equal(search.body.total, 1)

    const bad = await call('/api/contacts', { method: 'POST', body: { name: '' } })
    assert.equal(bad.status, 400)
    assert.equal((await call('/api/contacts/424242')).status, 404)
    assert.equal((await call('/api/gibtsnicht')).status, 404)

    // Statische Auslieferung der Oberflaeche
    const page = await fetch(`${base}/`)
    assert.equal(page.status, 200)
    assert.match(await page.text(), /<title>CRM<\/title>/)

    // Kein Ausbruch aus public/
    assert.equal((await fetch(`${base}/../src/service.js`)).status, 404)
  } finally {
    server.close()
  }
})

test('MCP-Server antwortet auf initialize, tools/list und tools/call', async () => {
  const child = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', path.join(srcDir, 'mcp.js')], {
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  const responses = []
  const waiters = []
  let buffer = ''
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    buffer += chunk
    let index
    while ((index = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, index).trim()
      buffer = buffer.slice(index + 1)
      if (!line) continue
      const msg = JSON.parse(line)
      responses.push(msg)
      waiters.shift()?.(msg)
    }
  })

  const request = (id, method, params) => {
    const promise = new Promise((resolve) => waiters.push(resolve))
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
    return promise
  }

  try {
    const init = await request(1, 'initialize', { protocolVersion: '2025-06-18', capabilities: {} })
    assert.equal(init.result.serverInfo.name, 'crm')
    assert.equal(init.result.protocolVersion, '2025-06-18')

    const list = await request(2, 'tools/list')
    const names = list.result.tools.map((t) => t.name)
    assert.ok(names.includes('crm_search_contacts'))
    assert.ok(names.includes('crm_log_interaction'))
    assert.ok(list.result.tools.every((t) => t.inputSchema?.type === 'object'))

    const call = await request(3, 'tools/call', { name: 'crm_stats', arguments: {} })
    assert.ok(call.result.structuredContent.total_contacts > 0)

    const created = await request(4, 'tools/call', {
      name: 'crm_create_contact',
      arguments: { name: 'MCP Kunde', tags: ['via-agent'] },
    })
    assert.equal(created.result.structuredContent.name, 'MCP Kunde')

    const failed = await request(5, 'tools/call', { name: 'crm_get_contact', arguments: { id: 999999 } })
    assert.equal(failed.result.isError, true)

    const unknown = await request(6, 'tools/call', { name: 'gibts_nicht', arguments: {} })
    assert.equal(unknown.error.code, -32602)
    assert.equal(responses.length, 6)
  } finally {
    child.kill()
  }
})
