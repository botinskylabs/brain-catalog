# Brain Catalog

Öffentlicher Remote-Katalog für die [Brain Platform](https://botinsky.com) von Botinsky Labs.

Jede installierte Brain-Platform-App zieht beim Start die Datei `index.json` aus diesem Repo und zeigt alle enthaltenen Wissenspakete im Shop an.

## Struktur

- `index.json` — der gesamte Katalog als einzelne JSON-Datei. Jedes Paket trägt sein Manifest und seine Inhalte (markdown) inline, daher kein Zip, kein Binary-Download.
- `docs/` — statische Präsentationsseite „Das Digitale Immobilienbüro“ (siehe unten).
- `tools/` — Hilfsskripte, u. a. der Generator für die Agenten-Profilbilder.

## Das Digitale Immobilienbüro

Unter `docs/` liegt eine eigenständige Webseite, die das Team aus zehn spezialisierten
KI-Agenten für den Verkauf hochwertiger Immobilien vorstellt — mit Profilbild, Mission,
Verantwortlichkeiten, Fähigkeiten und Output je Agent.

- `docs/index.html` — Seitenstruktur
- `docs/agents.js` — Inhalte aller zehn Agenten (hier werden Texte gepflegt)
- `docs/app.js` — rendert Karten und Detail-Dialog
- `docs/styles.css` — Gestaltung
- `docs/assets/agents/*.svg` — die Profilbilder

Lokal ansehen: `docs/index.html` im Browser öffnen — keine Abhängigkeiten, kein Build.

Veröffentlichen über GitHub Pages: **Settings → Pages → Source: Deploy from a branch →
Branch `main`, Ordner `/docs`**.

Die Profilbilder sind generiert. Nach Änderungen an Farben, Frisuren oder Symbolen:

```bash
python3 tools/generate-avatars.py
```

## Eigenes Paket einreichen

1. Mit dem CLI ein Paket bauen:
   ```bash
   brain pack new mein-paket \
     --name "Mein Paket" \
     --description "Wofür dieses Paket gedacht ist" \
     --category wissen \
     --author "Dein Name"
   ```
2. Inhalte unter `mein-paket/content/` editieren.
3. Validieren: `brain pack validate ./mein-paket`
4. Pull Request auf dieses Repo mit dem aktualisierten `index.json`, das über `brain pack publish` erzeugt wird.

## URL für Settings

In der Desktop-App unter **Settings → Shop-Katalog** kann diese URL eingetragen werden (ist auch der Default):

```
https://raw.githubusercontent.com/botinskylabs/brain-catalog/main/index.json
```

## Format

Siehe `packages/core/src/catalog/remote.ts` in der Brain-Platform-Codebase für die Typ-Definition. Kurzfassung:

```ts
{
  version: 1,
  generated_at: string,
  source?: string,
  packages: [{
    id: string,
    version: string,
    manifest: PackageManifest,
    files: [{ relPath: string, content: string }],
    contentHash?: string
  }]
}
```

---

Gebaut mit [Brain Platform](https://github.com/botinskylabs/brain-platform) von Botinsky Labs.
