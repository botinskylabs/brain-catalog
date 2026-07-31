#!/usr/bin/env python3
"""Erzeugt die Portraitplatten (SVG) der zehn Agenten.

Reduzierte Graustufen-Illustrationen im Hochformat 3:4 — Platzhalter, bis echte
Fotos vorliegen. Ein Foto ersetzt eine Platte, indem es unter demselben Namen in
docs/assets/agents/ abgelegt und in docs/agents.js als `photo` eingetragen wird.

Gezeichnet wird im 400x400-Raster; die Gruppe wird auf das Hochformat
transformiert (translate(-30 6) scale(0.9)), damit die Frisurenpfade unverändert
weiterverwendet werden können.
"""

import os

OUT = os.path.abspath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'docs', 'assets', 'agents'))
os.makedirs(OUT, exist_ok=True)

INK = '#2A2B2F'


def shade(hex_color, factor):
    """Hellt (factor>1) oder dunkelt (factor<1) eine Hex-Farbe ab."""
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    return '#%02X%02X%02X' % tuple(min(255, max(0, int(round(c * factor)))) for c in (r, g, b))


# --- Frisuren (400x400-Raster) --------------------------------------------
CAP_SHORT = ('M130 210 C126 140 158 92 200 92 C242 92 274 140 270 210 '
             'C266 190 262 176 256 168 C254 150 240 140 200 140 '
             'C160 140 146 150 144 168 C138 176 134 190 130 210 Z')
CAP_UNDER = ('M144 196 C142 138 168 96 202 96 C240 96 268 136 264 190 '
             'C258 172 252 160 248 154 C244 142 232 134 200 134 '
             'C168 134 154 144 150 156 C146 164 146 178 144 196 Z')
CAP_SIDE = ('M130 208 C126 138 160 92 202 92 C240 92 266 112 272 154 '
            'C264 142 254 134 246 130 C222 118 190 124 168 138 '
            'C148 150 136 176 130 208 Z')

HAIR = {
    'short': {'front': '<path d="%s"/>' % CAP_SHORT},
    'under': {'front': '<path d="%s"/>' % CAP_UNDER},
    'side':  {'front': '<path d="%s"/>' % CAP_SIDE},
    'slick': {'front': '<path d="%s"/>' % CAP_SHORT},
    'bun':   {'front': '<circle cx="200" cy="88" r="25"/><path d="%s"/>' % CAP_SHORT},
    'curly': {'front': ('<path d="%s"/>'
                        '<circle cx="150" cy="154" r="25"/><circle cx="174" cy="126" r="27"/>'
                        '<circle cx="206" cy="118" r="28"/><circle cx="238" cy="132" r="25"/>'
                        '<circle cx="258" cy="160" r="22"/>' % CAP_SHORT)},
    'long':  {'back': ('<path d="M118 200 C118 120 156 88 200 88 C244 88 282 120 282 200 '
                       'L282 330 C260 316 232 308 200 308 C168 308 140 316 118 330 Z"/>'),
              'front': '<path d="%s"/>' % CAP_SHORT},
    'bob':   {'back': '<ellipse cx="200" cy="192" rx="78" ry="102"/>',
              'front': '<path d="%s"/>' % CAP_SHORT},
    'pony':  {'back': ('<path d="M252 130 C296 138 320 176 312 218 C306 250 284 270 256 276 '
                       'C280 246 286 208 272 180 C264 164 256 146 252 130 Z"/>'),
              'front': '<path d="%s"/>' % CAP_SHORT},
}

BEARD = ('<path d="M142 184 C144 246 170 272 200 272 C230 272 256 246 258 184 '
         'C252 224 232 246 200 246 C168 246 148 224 142 184 Z"/>'
         '<path d="M180 202 C188 197 212 197 220 202 C213 209 187 209 180 202 Z"/>')

GLASSES = ('<g fill="none" stroke="%s" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round">'
           '<rect x="152" y="163" width="42" height="34" rx="12"/>'
           '<rect x="206" y="163" width="42" height="34" rx="12"/>'
           '<path d="M194 178 h12"/><path d="M152 172 L134 178"/><path d="M248 172 L266 178"/>'
           '</g>') % INK

FACE = ('<g fill="%(ink)s" fill-opacity="0.58">'
        '<ellipse cx="177" cy="181" rx="4.6" ry="5.8"/><ellipse cx="223" cy="181" rx="4.6" ry="5.8"/>'
        '</g>'
        '<g fill="none" stroke="%(ink)s" stroke-linecap="round">'
        '<path d="M165 163 C172 158 184 158 190 162" stroke-width="3.4" stroke-opacity="0.28"/>'
        '<path d="M210 162 C216 158 228 158 235 163" stroke-width="3.4" stroke-opacity="0.28"/>'
        '<path d="M200 188 v14 c0 4 3 6 7 6" stroke-width="3" stroke-opacity="0.16"/>'
        '<path d="M186 214 C193 222 207 222 214 214" stroke-width="3.6" stroke-opacity="0.30"/>'
        '</g>') % {'ink': INK}

def torso(width):
    """Schulterlinie; width steuert, wie breit die Figur ansetzt."""
    return ('M%d 440 C%d 330 %d 292 150 282 C174 302 226 302 250 282 '
            'C%d 292 %d 330 %d 440 Z') % (
        28 - width, 28 - width, 90 - width // 2,
        310 + width // 2, 372 + width, 372 + width)

# slug, hintergrund, figur, frisur, schulterbreite, bart, gespiegelt
AGENTS = [
    ('research',     '#E9E7E3', '#3E4046', 'short', 0,  False, False),
    ('outreach',     '#E4E2DE', '#494B51', 'bun',   -8, False, False),
    ('property',     '#EDEBE7', '#33353A', 'side',  6,  False, False),
    ('matching',     '#E2E0DC', '#44464C', 'long',  -6, False, False),
    ('content',      '#EBE9E5', '#3A3C42', 'curly', 0,  False, False),
    ('relationship', '#E6E4E0', '#4C4E54', 'bob',   -8, False, False),
    ('market',       '#E9E7E3', '#383A40', 'under', 4,  False, False),
    ('negotiation',  '#E3E1DD', '#2E3035', 'short', 10, True,  False),
    ('operations',   '#ECEAE6', '#42444A', 'pony',  -4, False, False),
    ('executive',    '#E5E3DF', '#2B2D32', 'side',  12, False, True),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400" role="img" aria-label="Portrait {slug}">
  <defs>
    <linearGradient id="bg-{slug}" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="{bg_light}"/>
      <stop offset="1" stop-color="{bg_dark}"/>
    </linearGradient>
    <clipPath id="clip-{slug}"><rect width="300" height="400"/></clipPath>
  </defs>

  <rect width="300" height="400" fill="url(#bg-{slug})"/>

  <g clip-path="url(#clip-{slug})">
    <g transform="translate(-30 6) scale(0.9){mirror}" fill="{figure}">
      {hair_back}
      <path d="M176 214h48v58a24 24 0 0 1-48 0z"/>
      <path d="{torso}"/>
      <ellipse cx="200" cy="180" rx="62" ry="70"/>
      {beard_layer}
      {hair_front}
    </g>
  </g>
</svg>
"""

for slug, bg, figure, style, width, beard, mirror in AGENTS:
    cfg = HAIR[style]
    svg = TEMPLATE.format(
        slug=slug,
        bg_light=shade(bg, 1.03), bg_dark=shade(bg, 0.92),
        figure=figure, torso=torso(width),
        mirror=' translate(400 0) scale(-1 1)' if mirror else '',
        hair_back=cfg.get('back', ''), hair_front=cfg.get('front', ''),
        beard_layer=BEARD if beard else '',
    )
    with open(os.path.join(OUT, slug + '.svg'), 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print('geschrieben:', slug + '.svg')
