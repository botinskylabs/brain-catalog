import { DatabaseSync } from 'node:sqlite'
import { config } from './config.js'

/**
 * Migrationen laufen der Reihe nach und werden ueber `PRAGMA user_version`
 * verfolgt. Neue Spalten/Tabellen einfach als weiteren Eintrag anhaengen –
 * nie einen bestehenden Eintrag aendern.
 */
const migrations = [
  (db) => {
    db.exec(`
      CREATE TABLE contacts (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        name           TEXT    NOT NULL,
        company        TEXT,
        role           TEXT,
        email          TEXT,
        phone          TEXT,
        website        TEXT,
        status         TEXT    NOT NULL DEFAULT 'lead',
        tags           TEXT    NOT NULL DEFAULT '[]',
        notes          TEXT,
        next_follow_up TEXT,
        custom         TEXT    NOT NULL DEFAULT '{}',
        created_at     TEXT    NOT NULL,
        updated_at     TEXT    NOT NULL
      );

      CREATE TABLE interactions (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_id  INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
        type        TEXT    NOT NULL DEFAULT 'note',
        occurred_at TEXT    NOT NULL,
        subject     TEXT,
        notes       TEXT,
        created_at  TEXT    NOT NULL
      );

      CREATE INDEX idx_contacts_status      ON contacts(status);
      CREATE INDEX idx_contacts_follow_up   ON contacts(next_follow_up);
      CREATE INDEX idx_interactions_contact ON interactions(contact_id, occurred_at DESC);
    `)
  },
]

let db

export function getDb() {
  if (db) return db
  db = new DatabaseSync(config.dbPath)
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  migrate(db)
  return db
}

function migrate(db) {
  const { user_version: current } = db.prepare('PRAGMA user_version').get()
  for (let i = current; i < migrations.length; i++) {
    db.exec('BEGIN')
    try {
      migrations[i](db)
      db.exec(`PRAGMA user_version = ${i + 1}`)
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      throw err
    }
  }
}

/** Nur fuer Tests: verbindet die Datenbank neu (z. B. auf eine andere Datei). */
export function closeDb() {
  db?.close()
  db = undefined
}
