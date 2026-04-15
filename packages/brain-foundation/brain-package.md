---
id: brain-foundation
name: Brain Foundation
version: 1.0.0
author:
  name: Botinsky Labs
  url: https://botinsky.com
description: Erweitere deinen Kern — Vision, Werte, Arbeitsweise.
category: wissen
placement: setup
tags: [core, identity, foundation, values]
pricing:
  type: free
targets:
  - 00_CORE/
triggers:
  - id: foundation-vision
    when:
      - Vision
      - langfristige Ziele
      - wo will ich hin
      - 3 Jahre
      - 5 Jahre
    then:
      - 00_CORE/VISION.md
      - 00_CORE/WERTE.md
    note: Bei strategischen Entscheidungen immer gegen die langfristige Vision prüfen.
  - id: foundation-arbeitsweise
    when:
      - Tagesplanung
      - wie arbeite ich
      - Produktivität
      - Deep Work
      - Routine
    then:
      - 00_CORE/ARBEITSWEISE.md
    note: Empfehlungen an den persönlichen Energie-Rhythmus anpassen.
---

# Brain Foundation

Dieses Paket erweitert dein Brain um drei wichtige Kern-Dateien die dein Agent braucht um dich wirklich zu verstehen.
