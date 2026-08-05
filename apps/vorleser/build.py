#!/usr/bin/env python3
"""Baut index.html aus page.html (dem Seitenrumpf) plus HTML-Gerüst und
der Erweiterung für den lokalen MP3-Server.

    python3 build.py
"""

from pathlib import Path

HERE = Path(__file__).parent

HEAD = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
"""

TAIL = """
<script src="local.js"></script>
</body>
</html>
"""


def main() -> None:
    body = (HERE / "page.html").read_text(encoding="utf-8")

    # <title> und <style> gehören in den <head>, der Rest in den <body>.
    marker = "</style>"
    head_part, body_part = body.split(marker, 1)

    out = HEAD + head_part + marker + "\n</head>\n<body>\n" + body_part.strip() + TAIL
    (HERE / "index.html").write_text(out, encoding="utf-8")
    print("index.html geschrieben:", len(out), "Zeichen")


if __name__ == "__main__":
    main()
