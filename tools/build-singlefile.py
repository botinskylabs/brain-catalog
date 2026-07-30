#!/usr/bin/env python3
"""Baut aus docs/ eine eigenständige HTML-Datei mit inline CSS, JS und Bildern.

Ergebnis: dist/digitales-immobilienbuero.html — eine Datei, die ohne weitere
Dateien im Browser läuft und sich so überall veröffentlichen lässt.
"""

import base64
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
DIST = os.path.join(ROOT, 'dist')
OUT = os.path.join(DIST, 'digitales-immobilienbuero.html')


def read(*parts):
    with open(os.path.join(DOCS, *parts), encoding='utf-8') as fh:
        return fh.read()


def data_uri(svg):
    return 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode('utf-8')).decode('ascii')


html = read('index.html')
css = read('styles.css')
agents_js = read('agents.js')
app_js = read('app.js')

# Profilbilder als Data-URI einbetten
agent_dir = os.path.join(DOCS, 'assets', 'agents')
images = {
    name[:-4]: data_uri(open(os.path.join(agent_dir, name), encoding='utf-8').read())
    for name in sorted(os.listdir(agent_dir)) if name.endswith('.svg')
}
images_js = 'window.AGENT_IMAGES = {\n' + ',\n'.join(
    '  %s: "%s"' % (slug, uri) for slug, uri in images.items()
) + '\n};'

# Kopf und Rumpf der Seite extrahieren
title = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
body = body.replace('<script src="agents.js"></script>', '')
body = body.replace('<script src="app.js"></script>', '')

page = (
    '<title>%s</title>\n' % title +
    '<style>\n%s\n</style>\n' % css.strip() +
    body.strip() + '\n\n' +
    '<script>\n%s\n</script>\n' % images_js +
    '<script>\n%s\n</script>\n' % agents_js.strip() +
    '<script>\n%s\n</script>\n' % app_js.strip()
)

os.makedirs(DIST, exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as fh:
    fh.write(page)

print('geschrieben: %s (%.1f KB, %d Profilbilder)'
      % (os.path.relpath(OUT, ROOT), len(page.encode('utf-8')) / 1024, len(images)))
