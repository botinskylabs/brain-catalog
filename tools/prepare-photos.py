#!/usr/bin/env python3
"""Bereitet Portraitfotos für die Webseite auf.

Legt die Originale in `photos-src/` ab — benannt nach der Rolle, für die sie
stehen sollen:

    photos-src/research.jpg      photos-src/relationship.jpg
    photos-src/outreach.jpg      photos-src/market.jpg
    photos-src/property.jpg      photos-src/negotiation.jpg
    photos-src/matching.jpg      photos-src/operations.jpg
    photos-src/content.jpg       photos-src/executive.jpg
    photos-src/concierge.jpg

Dann:

    python3 tools/prepare-photos.py

Erzeugt je Foto zwei Fassungen:

  * `docs/assets/agents/<id>.jpg`        600 × 800 — für die verlinkte Seite
  * `docs/assets/agents/embed/<id>.jpg`  420 × 560 — für die Einzeldatei,
    die alle Bilder als Data-URI mitträgt

Beide werden auf 3:4 beschnitten, mittig und leicht nach oben versetzt, damit
der Kopf im Bild bleibt. Zusätzlich entsteht `docs/assets/agents/photos.js`,
das der Seite sagt, welche Rollen ein Foto haben — es sind keine Änderungen an
`agents.js` nötig.
"""

import json
import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Pillow fehlt.  Installieren mit:  pip install Pillow')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'photos-src')
OUT = os.path.join(ROOT, 'docs', 'assets', 'agents')
EMBED = os.path.join(OUT, 'embed')

# Zielgrößen: (Breite, Höhe, JPEG-Qualität)
FULL = (600, 800, 78)
SMALL = (420, 560, 70)

# Kopffreiheit: 0.5 = mittig, kleiner = weiter oben beschnitten
VERTICAL_ANCHOR = 0.38


def fit(image, size):
    """Beschneidet auf 3:4 und skaliert auf die Zielgröße."""
    width, height, _ = size
    return ImageOps.fit(
        image, (width, height),
        method=Image.LANCZOS,
        centering=(0.5, VERTICAL_ANCHOR),
    )


def save(image, path, quality):
    image.convert('RGB').save(
        path, 'JPEG', quality=quality, optimize=True, progressive=True,
    )
    return os.path.getsize(path)


def main():
    if not os.path.isdir(SRC):
        os.makedirs(SRC, exist_ok=True)
        sys.exit('Ordner photos-src/ angelegt — Fotos dort ablegen und erneut starten.')

    sources = sorted(
        name for name in os.listdir(SRC)
        if name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))
    )
    if not sources:
        sys.exit('Keine Bilder in photos-src/ gefunden.')

    os.makedirs(OUT, exist_ok=True)
    os.makedirs(EMBED, exist_ok=True)

    photos = {}
    total_full = total_small = 0

    for name in sources:
        slug = os.path.splitext(name)[0]
        with Image.open(os.path.join(SRC, name)) as original:
            original = ImageOps.exif_transpose(original)
            big = save(fit(original, FULL), os.path.join(OUT, slug + '.jpg'), FULL[2])
            small = save(fit(original, SMALL), os.path.join(EMBED, slug + '.jpg'), SMALL[2])

        if slug != 'concierge':
            photos[slug] = slug + '.jpg'
        total_full += big
        total_small += small
        print('%-14s %4d × %d  %5.0f KB   |  eingebettet %5.0f KB'
              % (slug, FULL[0], FULL[1], big / 1024, small / 1024))

    with open(os.path.join(OUT, 'photos.js'), 'w', encoding='utf-8') as fh:
        fh.write('/* Erzeugt von tools/prepare-photos.py — nicht von Hand ändern. */\n')
        fh.write('window.AGENT_PHOTOS = %s;\n' % json.dumps(photos, indent=2, ensure_ascii=False))

    print('\n%d Fotos · Seite gesamt %.0f KB · Einzeldatei gesamt %.0f KB'
          % (len(sources), total_full / 1024, total_small / 1024))
    if 'concierge' in [os.path.splitext(n)[0] for n in sources]:
        print('Concierge-Foto ersetzt assets/agents/concierge.jpg — '
              'Bildpfad in docs/index.html anpassen, falls noch das SVG steht.')


if __name__ == '__main__':
    main()
