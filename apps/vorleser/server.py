#!/usr/bin/env python3
"""Lokaler Server für den Vorleser.

Liefert die Oberfläche aus und wandelt Text über edge-tts in eine MP3 um.
Es geht nichts an einen eigenen Dienst — edge-tts spricht direkt mit dem
kostenlosen Sprachdienst von Microsoft Edge, ohne Konto und ohne Schlüssel.

    pip install edge-tts
    python3 server.py

Danach http://127.0.0.1:8765 im Browser öffnen.
"""

from __future__ import annotations

import argparse
import asyncio
import functools
import json
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).parent

MAX_CHARS = 50_000

# Wird benutzt, wenn die Stimmenliste nicht abrufbar ist.
FALLBACK_VOICES = [
    {"name": "de-DE-KatjaNeural", "label": "Katja · weiblich · Deutschland"},
    {"name": "de-DE-ConradNeural", "label": "Conrad · männlich · Deutschland"},
    {"name": "de-DE-AmalaNeural", "label": "Amala · weiblich · Deutschland"},
    {"name": "de-DE-KillianNeural", "label": "Killian · männlich · Deutschland"},
    {"name": "de-AT-IngridNeural", "label": "Ingrid · weiblich · Österreich"},
    {"name": "de-AT-JonasNeural", "label": "Jonas · männlich · Österreich"},
    {"name": "de-CH-LeniNeural", "label": "Leni · weiblich · Schweiz"},
    {"name": "de-CH-JanNeural", "label": "Jan · männlich · Schweiz"},
]

LAND = {"DE": "Deutschland", "AT": "Österreich", "CH": "Schweiz"}
GESCHLECHT = {"Female": "weiblich", "Male": "männlich"}

_voices_cache: list[dict] | None = None
_lock = threading.Lock()


def require_edge_tts():
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        sys.exit("edge-tts fehlt. Einmalig installieren mit:  pip install edge-tts")
    return edge_tts


def load_voices() -> list[dict]:
    """Deutsche Stimmen von edge-tts holen, mit Rückfallliste."""
    global _voices_cache
    with _lock:
        if _voices_cache is not None:
            return _voices_cache

        edge_tts = require_edge_tts()
        try:
            raw = asyncio.run(edge_tts.list_voices())
        except Exception:
            _voices_cache = FALLBACK_VOICES
            return _voices_cache

        voices = []
        for v in raw:
            name = v.get("ShortName", "")
            if not name.startswith("de-"):
                continue
            region = LAND.get(name.split("-")[1], name.split("-")[1])
            sex = GESCHLECHT.get(v.get("Gender", ""), v.get("Gender", ""))
            voices.append({
                "name": name,
                "label": f"{name.split('-')[2].replace('Neural', '')} · {sex} · {region}",
            })

        voices.sort(key=lambda v: (not v["name"].startswith("de-DE"), v["label"]))
        _voices_cache = voices or FALLBACK_VOICES
        return _voices_cache


def synthesize(text: str, voice: str, rate: str) -> bytes:
    edge_tts = require_edge_tts()

    async def run() -> bytes:
        comm = edge_tts.Communicate(text, voice, rate=rate)
        buf = bytearray()
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                buf.extend(chunk["data"])
        return bytes(buf)

    return asyncio.run(run())


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(HERE), **kwargs)

    def log_message(self, fmt, *args):  # ruhiger Betrieb
        if self.path.startswith("/api/"):
            sys.stderr.write("%s %s\n" % (self.command, self.path))

    # ---- Antworten ----

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, status: int, payload: dict) -> None:
        self._send(status, json.dumps(payload).encode("utf-8"), "application/json; charset=utf-8")

    def _fehler(self, status: int, text: str) -> None:
        self._send(status, text.encode("utf-8"), "text/plain; charset=utf-8")

    # ---- Routen ----

    def do_GET(self):
        if self.path.split("?")[0] == "/api/health":
            self._json(200, {"ok": True, "voices": load_voices()})
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/tts":
            self._fehler(404, "Unbekannter Endpunkt.")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0

        if length <= 0 or length > MAX_CHARS * 4:
            self._fehler(413, "Der Text ist zu lang. Bitte in kleinere Stücke teilen.")
            return

        try:
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._fehler(400, "Die Anfrage war nicht lesbar.")
            return

        text = (data.get("text") or "").strip()
        voice = data.get("voice") or FALLBACK_VOICES[0]["name"]
        rate = data.get("rate") or "+0%"

        if not text:
            self._fehler(400, "Es war kein Text dabei.")
            return
        if len(text) > MAX_CHARS:
            self._fehler(413, f"Höchstens {MAX_CHARS:,} Zeichen auf einmal.".replace(",", "."))
            return
        if not any(v["name"] == voice for v in load_voices()):
            self._fehler(400, "Diese Stimme kennt der Dienst nicht.")
            return

        try:
            audio = synthesize(text, voice, rate)
        except Exception as err:
            self._fehler(502, f"Der Sprachdienst hat nicht geantwortet: {err}")
            return

        if not audio:
            self._fehler(502, "Der Sprachdienst hat eine leere Datei geliefert.")
            return

        self._send(200, audio, "audio/mpeg")


def main() -> None:
    parser = argparse.ArgumentParser(description="Vorleser — lokaler Server")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true", help="Browser nicht automatisch öffnen")
    args = parser.parse_args()

    require_edge_tts()

    if not (HERE / "index.html").exists():
        sys.exit("index.html fehlt. Einmal 'python3 build.py' laufen lassen.")

    url = f"http://127.0.0.1:{args.port}/"
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)

    print(f"Vorleser läuft auf {url}   (Strg+C beendet)")
    if not args.no_browser:
        threading.Timer(0.5, functools.partial(webbrowser.open, url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nBeendet.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
