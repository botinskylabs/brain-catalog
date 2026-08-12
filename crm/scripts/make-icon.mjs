/**
 * Erzeugt build/icon.png (1024x1024) ohne externe Bibliothek – reines Zeichnen
 * in einen Puffer plus PNG-Encoder ueber node:zlib.
 * Aufruf: npm run icon
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SIZE = 1024
const SS = 3 // Supersampling fuer weiche Kanten

const BG_TOP = [47, 109, 246]
const BG_BOTTOM = [30, 78, 196]
const CARD = [255, 255, 255]

const roundedRect = (x, y, w, h, r) => (px, py) => {
  if (px < x || py < y || px > x + w || py > y + h) return false
  const cx = Math.min(Math.max(px, x + r), x + w - r)
  const cy = Math.min(Math.max(py, y + r), y + h - r)
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= r * r
}

const circle = (cx, cy, r) => (px, py) => (px - cx) ** 2 + (py - cy) ** 2 <= r * r

// Aufbau: abgerundetes blaues Quadrat, darauf eine weisse Kontaktkarte mit
// Avatar-Kreis und drei Textzeilen.
const background = roundedRect(0, 0, SIZE, SIZE, SIZE * 0.225)
const card = roundedRect(SIZE * 0.17, SIZE * 0.235, SIZE * 0.66, SIZE * 0.53, SIZE * 0.055)
const avatarHead = circle(SIZE * 0.335, SIZE * 0.395, SIZE * 0.062)
const avatarBody = roundedRect(SIZE * 0.245, SIZE * 0.475, SIZE * 0.18, SIZE * 0.115, SIZE * 0.055)
const lines = [
  roundedRect(SIZE * 0.475, SIZE * 0.35, SIZE * 0.26, SIZE * 0.038, SIZE * 0.019),
  roundedRect(SIZE * 0.475, SIZE * 0.43, SIZE * 0.2, SIZE * 0.032, SIZE * 0.016),
  roundedRect(SIZE * 0.475, SIZE * 0.5, SIZE * 0.23, SIZE * 0.032, SIZE * 0.016),
]
const pixels = Buffer.alloc(SIZE * SIZE * 4)

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    let bgHits = 0
    let cardHits = 0

    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const px = x + (sx + 0.5) / SS
        const py = y + (sy + 0.5) / SS
        if (background(px, py)) bgHits++
        if (card(px, py) && !avatarHead(px, py) && !avatarBody(px, py) && !lines.some((l) => l(px, py))) {
          cardHits++
        }
      }
    }

    const samples = SS * SS
    const t = y / SIZE
    const base = BG_TOP.map((c, i) => Math.round(c + (BG_BOTTOM[i] - c) * t))
    const cardAlpha = cardHits / samples
    const color = base.map((c, i) => Math.round(c + (CARD[i] - c) * cardAlpha))

    const offset = (y * SIZE + x) * 4
    pixels[offset] = color[0]
    pixels[offset + 1] = color[1]
    pixels[offset + 2] = color[2]
    pixels[offset + 3] = Math.round((bgHits / samples) * 255)
  }
}

// --- PNG schreiben -----------------------------------------------------------

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body) >>> 0)
  return Buffer.concat([length, body, crc])
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return c ^ 0xffffffff
}

const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1))
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0 // Filter: none
  pixels.copy(raw, y * (SIZE * 4 + 1) + 1, y * SIZE * 4, (y + 1) * SIZE * 4)
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(SIZE, 0)
ihdr.writeUInt32BE(SIZE, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // RGBA
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

const buildDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../build')
mkdirSync(buildDir, { recursive: true })
writeFileSync(path.join(buildDir, 'icon.png'), png)
console.log(`build/icon.png geschrieben (${SIZE}x${SIZE}, ${(png.length / 1024).toFixed(0)} kB)`)
