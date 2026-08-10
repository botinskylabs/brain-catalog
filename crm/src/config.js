import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
export const rootDir = path.resolve(here, '..')

const dataDir = process.env.CRM_DATA_DIR
  ? path.resolve(process.env.CRM_DATA_DIR)
  : path.join(rootDir, 'data')

mkdirSync(dataDir, { recursive: true })

export const config = {
  dataDir,
  dbPath: process.env.CRM_DB_PATH
    ? path.resolve(process.env.CRM_DB_PATH)
    : path.join(dataDir, 'crm.db'),
  publicDir: path.join(rootDir, 'public'),
  host: process.env.CRM_HOST || '127.0.0.1',
  port: Number(process.env.CRM_PORT || 4321),
  // Kommagetrennte Liste. Leer = kein Key gesetzt (dann nur lokaler Zugriff).
  apiKeys: (process.env.CRM_API_KEY || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean),
  // Auch von localhost einen API-Key verlangen.
  requireKey: process.env.CRM_REQUIRE_KEY === '1',
  // Fremde Origins, die die API im Browser aufrufen duerfen.
  corsOrigins: (process.env.CRM_CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
}
