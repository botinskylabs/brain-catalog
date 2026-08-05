# Vorleser

Text einfügen, zuhören — und auf Wunsch als MP3 speichern. Zwei Wege, beide kostenlos:

| | Vorlesen im Browser | MP3-Datei |
|---|---|---|
| Braucht | nur `index.html` | Python + `edge-tts` |
| Stimmen | die des Betriebssystems | neuronale Stimmen von Microsoft |
| Internet | nein | ja |
| Konto / API-Schlüssel | nein | nein |

## Nur vorlesen

`index.html` doppelklicken. Fertig — kein Server, keine Installation, nichts
verlässt den Rechner. Die Sprachausgabe kommt aus dem Betriebssystem
(`SpeechSynthesis`), deutsche Stimmen bringen macOS, Windows, iOS und Android
von Haus aus mit. Unter Linux muss meist erst eine nachinstalliert werden.

Während des Vorlesens wird das aktuelle Wort markiert. Tempo und Tonhöhe sind
einstellbar, <kbd>Esc</kbd> bricht ab.

## Mit MP3-Ausgabe

```bash
pip install edge-tts
python3 server.py
```

Der Browser öffnet sich auf <http://127.0.0.1:8765>. Im Abschnitt
„Als MP3 speichern" steht dann eine Schaltfläche statt der Anleitung —
ein Klick, und die Datei landet im Download-Ordner.

`edge-tts` spricht direkt mit dem Sprachdienst, den Microsoft Edge für seine
Vorlesefunktion benutzt: kostenlos, ohne Konto, ohne Schlüssel. Der Text geht
dabei an Microsoft — für Vertrauliches also besser bei der Browser-Variante
bleiben.

### Ohne Oberfläche

Der Weg geht auch direkt über die Kommandozeile:

```bash
edge-tts --voice de-DE-KatjaNeural --file text.txt --write-media hoerbuch.mp3
edge-tts --list-voices | grep de-      # welche Stimmen es gibt
```

## Dateien

| Datei | Zweck |
|---|---|
| `page.html` | die Quelle: `<title>`, `<style>`, Markup, Skript |
| `build.py` | baut daraus `index.html` mit vollständigem HTML-Gerüst |
| `index.html` | die fertige Seite (eingecheckt, direkt benutzbar) |
| `local.js` | ersetzt die MP3-Anleitung durch eine Schaltfläche, sobald `server.py` läuft |
| `server.py` | liefert die Seite aus und erzeugt MP3s über `edge-tts` |

Nach Änderungen an `page.html` einmal `python3 build.py` laufen lassen.

## Wenn keine Stimme auftaucht

- **Linux:** `sudo apt install speech-dispatcher espeak-ng` — klingt robotisch,
  für gute Qualität lieber die MP3-Variante nehmen.
- **Windows:** Einstellungen → Zeit und Sprache → Sprache → Sprachpaket
  hinzufügen, inklusive Sprachausgabe.
- **Safari** markiert die Wörter nicht mit, weil es keine `boundary`-Ereignisse
  liefert. Vorlesen funktioniert trotzdem.
