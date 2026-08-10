import http from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'
import { routes } from './api.js'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
}

const MAX_BODY = 1_000_000

function isLoopback(req) {
  const ip = req.socket.remoteAddress || ''
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1'
}

/**
 * Zugriffsregeln:
 *  - Gueltiger API-Key im Header -> immer erlaubt.
 *  - Ohne Key: nur von localhost und nur ohne fremden Origin (schuetzt vor
 *    Zugriffen aus beliebigen Webseiten im Browser).
 *  - CRM_REQUIRE_KEY=1 erzwingt den Key auch lokal.
 */
function authorize(req) {
  const header = req.headers['x-api-key'] || ''
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const provided = String(header || bearer).trim()

  if (provided && config.apiKeys.includes(provided)) return { ok: true }
  if (provided) return { ok: false, status: 401, message: 'Ungueltiger API-Key' }

  if (config.requireKey || !isLoopback(req)) {
    return { ok: false, status: 401, message: 'API-Key erforderlich (Header X-API-Key)' }
  }
  const origin = req.headers.origin
  if (origin && !isOwnOrigin(req, origin) && !config.corsOrigins.includes(origin)) {
    return { ok: false, status: 403, message: `Origin ${origin} ist nicht freigegeben` }
  }
  return { ok: true }
}

function isOwnOrigin(req, origin) {
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

function applyCors(req, res) {
  const origin = req.headers.origin
  if (!origin) return
  if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', config.corsOrigins.includes('*') ? '*' : origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-API-Key,Authorization')
    res.setHeader('Access-Control-Max-Age', '600')
  }
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw Object.assign(new Error('Request-Body zu gross'), { status: 413 })
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('Body ist kein gueltiges JSON'), { status: 400 })
  }
}

async function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const file = path.join(config.publicDir, rel)
  if (!file.startsWith(config.publicDir + path.sep)) {
    return sendJson(res, 403, { error: 'Verboten' })
  }
  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error('kein File')
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
    })
    createReadStream(file).pipe(res)
  } catch {
    sendJson(res, 404, { error: `Nicht gefunden: ${pathname}` })
  }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const pathname = decodeURIComponent(url.pathname)

    applyCors(req, res)
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      return res.end()
    }

    if (!pathname.startsWith('/api/')) return serveStatic(req, res, pathname)

    const auth = authorize(req)
    if (!auth.ok) return sendJson(res, auth.status, { error: auth.message })

    for (const route of routes) {
      if (route.method !== req.method) continue
      const match = route.pattern.exec(pathname)
      if (!match) continue
      try {
        const body = ['POST', 'PATCH', 'PUT'].includes(req.method) ? await readJsonBody(req) : {}
        const result = await route.handler({
          params: match.groups ?? {},
          query: Object.fromEntries(url.searchParams),
          body,
        })
        return sendJson(res, req.method === 'POST' ? 201 : 200, result)
      } catch (err) {
        const status = err.status ?? 500
        if (status >= 500) console.error('[crm]', err)
        return sendJson(res, status, { error: err.message || 'Interner Fehler' })
      }
    }

    sendJson(res, 404, { error: `Unbekannter Endpunkt: ${req.method} ${pathname}` })
  })
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`
if (isMain) {
  createServer().listen(config.port, config.host, () => {
    console.log(`CRM laeuft auf http://${config.host}:${config.port}`)
    console.log(`Datenbank: ${config.dbPath}`)
    console.log(
      config.apiKeys.length
        ? `API-Keys: ${config.apiKeys.length} konfiguriert`
        : 'Kein API-Key gesetzt – API nur von localhost erreichbar (CRM_API_KEY setzen fuer Remote-Zugriff)',
    )
  })
}
