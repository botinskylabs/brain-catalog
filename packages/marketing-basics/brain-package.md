---
id: marketing-basics
name: Marketing Basics
version: 1.0.0
author:
  name: Botinsky Labs
  url: https://botinsky.com
description: ICP, Messaging und Kanal-Strategie für dein Brain.
category: marketing
placement: setup
tags: [marketing, icp, messaging, channels]
pricing:
  type: free
targets:
  - 02_MARKETING/
triggers:
  - id: marketing-icp
    when:
      - ICP
      - Zielgruppe
      - idealer Kunde
      - Target Audience
      - Buyer Persona
    then:
      - 02_MARKETING/ICP.md
    note: Jede Marketing-Aufgabe auf die ICP ausrichten.
  - id: marketing-messaging
    when:
      - Messaging
      - Positionierung
      - Elevator Pitch
      - Was biete ich
      - USP
    then:
      - 02_MARKETING/MESSAGING.md
    note: Kernbotschaft nicht verwässern. "Was NIE gesagt wird" respektieren.
  - id: marketing-kanaele
    when:
      - Marketing-Kanal
      - Instagram
      - LinkedIn
      - Newsletter
      - Ads
      - wo posten
    then:
      - 02_MARKETING/KANAELE.md
      - 02_MARKETING/ICP.md
    note: Nur Kanäle empfehlen die zur ICP und zur Frequenz passen.
---

# Marketing Basics

Drei Dateien die dein Agent braucht um dir beim Marketing zu helfen: Wer ist dein Kunde, was sagst du, und wo erreichst du ihn.
