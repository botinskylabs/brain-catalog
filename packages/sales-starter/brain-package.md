---
id: sales-starter
name: Sales Starter
version: 1.0.0
author:
  name: Botinsky Labs
  url: https://botinsky.com
description: Sales-Prozess, Einwand-Handling und Follow-Up für dein Brain.
category: sales
placement: setup
tags: [sales, process, objections, follow-up]
pricing:
  type: free
targets:
  - 03_SALES/
triggers:
  - id: sales-prozess
    when:
      - Sales-Prozess
      - Verkauf
      - Pipeline
      - Closing
      - Deal
    then:
      - 03_SALES/SALES_PROZESS.md
    note: Sales-Schritte und Conversion-Raten bei Sales-Empfehlungen berücksichtigen.
  - id: sales-einwaende
    when:
      - Einwand
      - zu teuer
      - keine Zeit
      - muss ich nachdenken
      - Kunde zögert
    then:
      - 03_SALES/EINWAENDE.md
    note: Echte Formulierungen aus der Datei verwenden, keine generischen Sales-Templates.
  - id: sales-followup
    when:
      - Follow-Up
      - Nachfassen
      - Kunde meldet sich nicht
      - Reminder Mail
    then:
      - 03_SALES/FOLLOW_UP.md
    note: Timing und Templates aus FOLLOW_UP.md nutzen, nicht neu erfinden.
---

# Sales Starter

Drei Dateien die dein Agent braucht um dir beim Verkaufen zu helfen: Wie läuft ein Verkauf ab, welche Einwände kommen, und wie bleibst du dran.
