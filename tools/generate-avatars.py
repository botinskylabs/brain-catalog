#!/usr/bin/env python3
"""Erzeugt die Profilbilder (SVG) der zehn Agenten des Digitalen Immobilienbüros.

Kopfgeometrie: Ellipse cx=200 cy=180 rx=62 ry=70  ->  Scheitel y=110, Kinn y=250.
"""

import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", "assets", "agents")
os.makedirs(OUT, exist_ok=True)

SHIRT = "#FBF7EF"


def shade(hex_color, factor):
    """Hellt (factor>1) oder dunkelt (factor<1) eine Hex-Farbe ab."""
    r, g, b = (int(hex_color[i:i + 2], 16) for i in (1, 3, 5))
    out = [min(255, max(0, int(round(c * factor)))) for c in (r, g, b)]
    return "#%02X%02X%02X" % tuple(out)


# --- Frisuren -------------------------------------------------------------
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
    'slick': {
        'front': '<path d="%s"/>' % CAP_SHORT,
    },
    'bun': {
        'front': '<circle cx="200" cy="88" r="25"/><path d="%s"/>' % CAP_SHORT,
        'shine': ('<path d="M176 112 C186 104 214 104 224 112" fill="none" '
                  'stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="3.5" stroke-linecap="round"/>'),
    },
    'curly': {
        'front': ('<path d="%s"/>'
                  '<circle cx="150" cy="154" r="25"/><circle cx="174" cy="126" r="27"/>'
                  '<circle cx="206" cy="118" r="28"/><circle cx="238" cy="132" r="25"/>'
                  '<circle cx="258" cy="160" r="22"/>' % CAP_SHORT),
    },
    'long': {
        'back': ('<path d="M116 202 C116 122 154 90 200 90 C246 90 284 122 284 202 '
                 'L284 344 L250 344 L250 192 C250 152 228 130 200 130 '
                 'C172 130 150 152 150 192 L150 344 L116 344 Z"/>'),
        'front': '<path d="%s"/>' % CAP_SHORT,
    },
    'bob': {
        'back': '<ellipse cx="200" cy="192" rx="78" ry="102"/>',
        'front': '<path d="%s"/>' % CAP_SHORT,
    },
    'pony': {
        'back': ('<path d="M252 130 C296 138 320 176 312 218 C306 250 284 270 256 276 '
                 'C280 246 286 208 272 180 C264 164 256 146 252 130 Z"/>'),
        'front': '<path d="%s"/>' % CAP_SHORT,
    },
}

BEARD = ('<path d="M142 184 C144 246 170 272 200 272 C230 272 256 246 258 184 '
         'C252 224 232 246 200 246 C168 246 148 224 142 184 Z"/>'
         '<path d="M180 202 C188 197 212 197 220 202 C213 209 187 209 180 202 Z"/>')

GLASSES = ('<g fill="none" stroke="#2A2118" stroke-opacity="0.72" stroke-width="3.2" stroke-linecap="round">'
           '<rect x="152" y="163" width="42" height="34" rx="12"/>'
           '<rect x="206" y="163" width="42" height="34" rx="12"/>'
           '<path d="M194 178 h12"/><path d="M152 172 L134 178"/><path d="M248 172 L266 178"/>'
           '</g>')

FACE = ('<g fill="#2A2118" fill-opacity="0.82">'
        '<ellipse cx="177" cy="181" rx="5" ry="6.2"/><ellipse cx="223" cy="181" rx="5" ry="6.2"/>'
        '</g>'
        '<g fill="none" stroke="#2A2118" stroke-linecap="round">'
        '<path d="M165 163 C172 157 184 157 190 162" stroke-width="4" stroke-opacity="0.42"/>'
        '<path d="M210 162 C216 157 228 157 235 163" stroke-width="4" stroke-opacity="0.42"/>'
        '<path d="M200 188 v14 c0 4 3 6 7 6" stroke-width="3.4" stroke-opacity="0.24"/>'
        '<path d="M184 214 C192 224 208 224 216 214" stroke-width="4.4" stroke-opacity="0.46"/>'
        '</g>')


# --- Oberkörper / Kleidung -----------------------------------------------
TORSO_OUTLINE = ('M28 400 C28 320 90 288 150 280 C174 300 226 300 250 280 '
                 'C310 288 372 320 372 400 Z')


def torso(kind, suit_color, accent, skin_dark):
    """Baut den Oberkörper: Sakko mit Hemd, Rollkragen oder Bluse."""
    if kind == 'turtleneck':
        return (
            '<path d="%s" fill="%s"/>' % (TORSO_OUTLINE, suit_color) +
            '<path d="M154 272 C174 296 226 296 246 272 L250 292 '
            'C226 316 174 316 150 292 Z" fill="%s"/>' % shade(suit_color, 1.28) +
            '<path d="M150 300 C176 322 224 322 250 300" fill="none" '
            'stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="2"/>'
        )
    if kind == 'blouse':
        return (
            '<path d="%s" fill="%s"/>' % (TORSO_OUTLINE, suit_color) +
            '<path d="M172 276 C180 310 220 310 228 276 L246 282 '
            'C238 328 162 328 154 282 Z" fill="%s"/>' % skin_dark +
            '<path d="M154 282 L200 320 L246 282" fill="none" stroke="#FFFFFF" '
            'stroke-opacity="0.14" stroke-width="2"/>'
        )
    # Sakko mit Hemd (kind == 'suit' / 'tie')
    out = (
        '<path d="M164 282 C180 300 220 300 236 282 L258 400 H142 Z" fill="%s"/>' % SHIRT +
        '<path d="M164 282 L200 322 L236 282 L226 276 L200 300 L174 276 Z" fill="%s"/>'
        % shade(SHIRT, 0.90)
    )
    if kind == 'tie':
        out += ('<path d="M200 316 L213 340 L207 400 H193 L187 340 Z" fill="%s"/>'
                % shade(accent, 0.70))
    out += (
        '<g fill="%s">'
        '<path d="M28 400 C28 322 88 290 152 281 L200 336 L182 400 Z"/>'
        '<path d="M372 400 C372 322 312 290 248 281 L200 336 L218 400 Z"/>'
        '</g>' % suit_color +
        '<path d="M152 281 L200 336 L248 281" fill="none" stroke="#FFFFFF" '
        'stroke-opacity="0.12" stroke-width="2"/>'
    )
    return out


# --- Symbole (lokale Koordinaten, Zentrum 0/0) ----------------------------
GLYPHS = {
    'search': '<circle cx="-3" cy="-3" r="10"/><path d="M4.5 4.5 L13.5 13.5"/>',
    'send': '<path d="M-14 -2 L14 -13 L3.5 14 L-1.5 2.5 Z"/><path d="M-1.5 2.5 L14 -13"/>',
    'home': '<path d="M-13.5 0.5 L0 -12 L13.5 0.5"/><path d="M-9 -3 V13 H9 V-3"/>',
    'match': '<circle cx="-6" cy="0" r="8.5"/><circle cx="6" cy="0" r="8.5"/>',
    'pen': '<path d="M-12.5 12.5 L-8.5 2.5 L4.5 -11.5 L11 -5.5 L-2.5 8 Z"/><path d="M4.5 -11.5 L11 -5.5"/>',
    'heart': ('<path d="M0 11.5 C-12.5 3 -13.5 -6 -6.5 -9.5 C-2.5 -11.5 0 -7.5 0 -5 '
              'C0 -7.5 2.5 -11.5 6.5 -9.5 C13.5 -6 12.5 3 0 11.5 Z"/>'),
    'chart': '<path d="M-14 -13 V13 H14"/><path d="M-9 6 L-2 -3 L4 3 L12 -9"/>',
    'scale': ('<path d="M0 -13 V11"/><path d="M-11.5 -7.5 H11.5"/><path d="M-7 12 H7"/>'
              '<path d="M-17 -0.5 A6 6 0 0 0 -6 -0.5"/><path d="M6 -0.5 A6 6 0 0 0 17 -0.5"/>'
              '<path d="M-11.5 -7.5 V-0.5"/><path d="M11.5 -7.5 V-0.5"/>'),
    'board': ('<rect x="-11" y="-11" width="22" height="24" rx="3.5"/>'
              '<path d="M-5 -11 V-15 H5 V-11"/><path d="M-5 -2 H5"/><path d="M-5 5 H5"/>'),
    'crown': '<path d="M-14 9.5 L-11.5 -9.5 L-4 -1.5 L0 -12.5 L4 -1.5 L11.5 -9.5 L14 9.5 Z"/><path d="M-11 14 H11"/>',
}

# slug, bg dunkel, bg hell, akzent, haut, haar, frisur, symbol, brille, bart, outfit, outfit-farbe
AGENTS = [
    ('research',     '#0F3B4C', '#26808E', '#7FE3D2', '#F0D8C0', '#23262E', 'short', 'search', True,  False, 'suit',       '#232733'),
    ('outreach',     '#241B54', '#5F44AE', '#B39BFF', '#E4BE96', '#2E1F17', 'bun',   'send',   False, False, 'blouse',     '#CFC3E4'),
    ('property',     '#0D3A2E', '#227E59', '#8FE3A8', '#F3E0CB', '#1E2029', 'slick', 'home',   False, False, 'tie',        '#1E2029'),
    ('matching',     '#4A1636', '#A63E68', '#FFAFC7', '#C98E63', '#241611', 'long',  'match',  False, False, 'blouse',     '#DCBFC9'),
    ('content',      '#4A1B22', '#B54B3E', '#FFB48A', '#EFD5B8', '#35211A', 'curly', 'pen',    False, False, 'turtleneck', '#43302F'),
    ('relationship', '#4B2A0C', '#C57E25', '#FFD79A', '#F2DFC8', '#4A2F1E', 'bob',   'heart',  False, False, 'blouse',     '#E3CBA4'),
    ('market',       '#10294F', '#3170BC', '#9CCBFF', '#E0B891', '#26282F', 'side',  'chart',  True,  False, 'suit',       '#232A36'),
    ('negotiation',  '#3A1226', '#94304E', '#FF9FA8', '#C08454', '#2A1C14', 'short', 'scale',  False, True,  'tie',        '#221E24'),
    ('operations',   '#1B222E', '#4C6584', '#B7C9E0', '#F0DAC2', '#1F2129', 'pony',  'board',  True,  False, 'turtleneck', '#2A3140'),
    ('executive',    '#3B2C08', '#A07E24', '#F2D98B', '#E7C49B', '#33322C', 'under', 'crown',  False, False, 'tie',        '#1B1A16'),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img" aria-label="Profilbild {slug}">
  <defs>
    <linearGradient id="bg-{slug}" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="{c2}"/>
      <stop offset="1" stop-color="{c1}"/>
    </linearGradient>
    <radialGradient id="glow-{slug}" cx="0.5" cy="0.2" r="0.78">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip-{slug}"><circle cx="200" cy="200" r="200"/></clipPath>
  </defs>

  <g clip-path="url(#clip-{slug})">
    <rect width="400" height="400" fill="url(#bg-{slug})"/>
    <circle cx="200" cy="80" r="230" fill="url(#glow-{slug})"/>
    <g fill="none" stroke="#FFFFFF" stroke-opacity="0.09" stroke-width="1">
      <circle cx="200" cy="200" r="186"/><circle cx="200" cy="200" r="150"/>
    </g>
    <circle cx="200" cy="204" r="116" fill="#FFFFFF" fill-opacity="0.06"/>

    <!-- Haar hinten -->
    <g fill="{hair}">{hair_back}</g>

    <!-- Hals -->
    <path d="M176 214h48v58a24 24 0 0 1-48 0z" fill="{skin_dark}"/>

    <!-- Kleidung -->
    {torso}

    <!-- Ohren -->
    <g fill="{skin_dark}">
      <ellipse cx="139" cy="188" rx="9" ry="13"/><ellipse cx="261" cy="188" rx="9" ry="13"/>
    </g>

    <!-- Kopf -->
    <ellipse cx="200" cy="180" rx="62" ry="70" fill="{skin}"/>
    <path d="M200 110 a62 70 0 0 1 0 140 a44 70 0 0 0 0 -140 Z" fill="#000000" fill-opacity="0.05"/>

    {face}
    {beard_layer}

    <!-- Haar vorn -->
    <g fill="{hair}">{hair_front}</g>
    {shine}
    {glasses}

    <path d="M0 344c62-28 122-40 200-40s138 12 200 40" fill="none" stroke="{accent}" stroke-opacity="0.20" stroke-width="2"/>
  </g>

  <!-- Rollensymbol -->
  <g transform="translate(320 320)">
    <circle r="55" fill="#0E1016"/>
    <circle r="55" fill="none" stroke="{accent}" stroke-opacity="0.55" stroke-width="2"/>
    <g stroke="{accent}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round">{glyph}</g>
  </g>

  <circle cx="200" cy="200" r="199" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="2"/>
</svg>
"""

for (slug, c1, c2, accent, skin, hair, style, glyph, glasses, beard,
     outfit, outfit_color) in AGENTS:
    cfg = HAIR[style]
    skin_dark = shade(skin, 0.88)
    svg = TEMPLATE.format(
        slug=slug, c1=c1, c2=c2, accent=accent,
        skin=skin, skin_dark=skin_dark, hair=hair,
        torso=torso(outfit, outfit_color, accent, skin_dark),
        hair_back=cfg.get('back', ''), hair_front=cfg.get('front', ''),
        shine=cfg.get('shine', ''),
        face=FACE,
        beard_layer='<g fill="%s">%s</g>' % (hair, BEARD) if beard else '',
        glasses=GLASSES if glasses else '',
        glyph=GLYPHS[glyph],
    )
    with open(os.path.join(OUT, slug + '.svg'), 'w', encoding='utf-8') as fh:
        fh.write(svg)
    print('geschrieben:', slug + '.svg')
