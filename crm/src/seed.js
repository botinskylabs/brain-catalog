/**
 * Legt ein paar Beispielkontakte an, damit man die Oberflaeche sofort sieht.
 * Aufruf: npm run seed
 */
import { createContact, logInteraction, listContacts } from './service.js'
import { config } from './config.js'

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString()
const inDays = (n) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)

const seed = [
  {
    contact: {
      name: 'Maria Hoffmann',
      company: 'Nordlicht Media GmbH',
      role: 'Geschaeftsfuehrerin',
      email: 'm.hoffmann@nordlicht-media.de',
      phone: '+49 40 1234567',
      status: 'aktiv',
      tags: ['agentur', 'bestandskunde'],
      notes: 'Kennt uns ueber Empfehlung von Jonas. Braucht Reporting jeden Monatsanfang.',
      next_follow_up: inDays(5),
    },
    interactions: [
      { type: 'meeting', occurred_at: daysAgo(4), subject: 'Quartalsreview', notes: 'Budget fuer Q3 bestaetigt.' },
      { type: 'email', occurred_at: daysAgo(18), subject: 'Angebot v2 geschickt' },
    ],
  },
  {
    contact: {
      name: 'Jonas Weber',
      company: 'Weber Consulting',
      role: 'Inhaber',
      email: 'jonas@weber-consulting.at',
      status: 'gewonnen',
      tags: ['beratung', 'empfehler'],
      notes: 'Wichtigste Empfehlungsquelle.',
    },
    interactions: [
      { type: 'call', occurred_at: daysAgo(45), subject: 'Kurzes Update' },
      { type: 'note', occurred_at: daysAgo(46), notes: 'Interner Vermerk: Vertrag laeuft bis Jahresende.' },
    ],
  },
  {
    contact: {
      name: 'Sabine Krause',
      company: 'Krause Handel KG',
      role: 'Einkaufsleitung',
      email: 's.krause@krause-handel.de',
      status: 'lead',
      tags: ['handel', 'kaltakquise'],
      notes: 'Ueber LinkedIn angeschrieben, noch keine Antwort.',
      next_follow_up: inDays(-2),
    },
    interactions: [{ type: 'message', occurred_at: daysAgo(21), subject: 'LinkedIn-Anfrage' }],
  },
  {
    contact: {
      name: 'Tom Brenner',
      company: 'Brenner Studios',
      role: 'Creative Director',
      email: 'tom@brennerstudios.com',
      status: 'pausiert',
      tags: ['kreativ'],
      notes: 'Projekt liegt bis nach dem Rebranding auf Eis.',
    },
    interactions: [{ type: 'call', occurred_at: daysAgo(120), subject: 'Projektstopp besprochen' }],
  },
  {
    contact: {
      name: 'Elena Fischer',
      company: 'Fischer & Partner',
      role: 'Partnerin',
      email: 'e.fischer@fischer-partner.ch',
      status: 'lead',
      tags: ['kanzlei'],
      notes: 'Auf Messe kennengelernt, hohes Interesse.',
      next_follow_up: inDays(1),
    },
    interactions: [],
  },
]

const existing = listContacts({ limit: 1 })
if (existing.total > 0) {
  console.log(`Datenbank enthaelt bereits ${existing.total} Kontakte (${config.dbPath}) – nichts gemacht.`)
  process.exit(0)
}

for (const entry of seed) {
  const contact = createContact(entry.contact)
  for (const interaction of entry.interactions) {
    logInteraction({ ...interaction, contact_id: contact.id })
  }
  console.log(`angelegt: ${contact.name}`)
}
console.log(`\nFertig. Datenbank: ${config.dbPath}`)
