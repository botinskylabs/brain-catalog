/**
 * Datenbasis für das Digitale Immobilienbüro.
 * Jeder Eintrag beschreibt einen Agenten des Teams.
 */
window.AGENTS = [
  {
    id: 'research',
    nr: '01',
    name: 'Research Agent',
    role: 'Der Käufer-Finder',
    mission: 'Findet kontinuierlich neue potenzielle Käufer und Multiplikatoren für jede Immobilie.',
    tags: ['Leadgenerierung', 'Recherche', 'CRM'],
    duties: [
      'Recherche potenzieller Käufer',
      'Recherche von Family Offices',
      'Vermögensverwalter finden',
      'Steuerberater mit vermögenden Mandanten',
      'Private Banker',
      'Unternehmer',
      'Ärzte',
      'Anwälte',
      'Investoren',
      'Internationale Käufer',
      'Firmen mit Expansionsplänen'
    ],
    skills: [
      'LinkedIn analysieren',
      'Webseiten durchsuchen',
      'Unternehmensdaten recherchieren',
      'Immobilienportale beobachten',
      'Nachrichten auswerten',
      'Firmenexpansionen erkennen',
      'Finanzierungsindikatoren erkennen',
      'CRM automatisch befüllen'
    ],
    output: [
      'täglich neue Leads',
      'Priorisierung nach Kaufwahrscheinlichkeit',
      'Hintergrundinformationen',
      'Gesprächsanlässe'
    ],
    why: 'Ohne Käufer gibt es keinen Verkauf. Dieser Agent sorgt dafür, dass der Vertrieb niemals auf Empfehlungen oder Zufall angewiesen ist. Er baut jeden Tag den Pool potenzieller Käufer aus.'
  },
  {
    id: 'outreach',
    nr: '02',
    name: 'Outreach Agent',
    role: 'Der Beziehungsstarter',
    mission: 'Verwandelt recherchierte Kontakte in Gespräche.',
    tags: ['Erstkontakt', 'Kampagnen', 'Terminierung'],
    duties: [
      'personalisierte Nachrichten schreiben',
      'LinkedIn Outreach',
      'E-Mail Outreach',
      'Follow-up Kampagnen',
      'Termine vereinbaren',
      'Reaktionen auswerten',
      'Kommunikation personalisieren'
    ],
    skills: [
      'Tonalität an Zielgruppe anpassen',
      'Gesprächsanlässe erkennen',
      'Einwände vorwegnehmen',
      'A/B Tests',
      'Öffnungsraten optimieren',
      'Antwortwahrscheinlichkeit erhöhen'
    ],
    output: [
      'qualifizierte Erstgespräche',
      'gebuchte Besichtigungen',
      'steigende Antwortrate'
    ],
    why: 'Die meisten hochwertigen Käufer suchen nicht aktiv. Man muss sie intelligent ansprechen.'
  },
  {
    id: 'property',
    nr: '03',
    name: 'Property Agent',
    role: 'Der Immobilienexperte',
    mission: 'Kennt jede Immobilie besser als jeder Makler.',
    tags: ['Objektwissen', 'Exposé', 'Lage'],
    duties: [
      'sämtliche Objektdaten verwalten',
      'Exposé verstehen',
      'Grundrisse kennen',
      'Umgebung analysieren',
      'Bauunterlagen kennen',
      'Sanierungen dokumentieren',
      'Energieausweis kennen',
      'Besonderheiten erklären'
    ],
    skillsIntro: 'Kann jede Käuferfrage beantworten. Zum Beispiel:',
    skills: [
      'Warum wurde dieser Preis gewählt?',
      'Welche Schulen liegen in der Nähe?',
      'Welche Restaurants?',
      'Wie entwickelt sich das Viertel?',
      'Welche Rendite wäre möglich?',
      'Welche Umbauten wären sinnvoll?'
    ],
    output: [
      'sofortige Antworten',
      'keine Wartezeiten',
      'perfekte Objektkenntnis'
    ],
    why: 'Je teurer eine Immobilie ist, desto detaillierter werden die Fragen. Dieser Agent kennt jede Antwort.'
  },
  {
    id: 'matching',
    nr: '04',
    name: 'Buyer Matching Agent',
    role: 'Der perfekte Vermittler',
    mission: 'Erkennt automatisch, welche Immobilie zu welchem Käufer passt.',
    tags: ['Käuferprofil', 'Matching Score', 'Beratung'],
    duties: [
      'Käufer interviewen',
      'Bedürfnisse erkennen',
      'Budget analysieren',
      'Lebenssituation verstehen',
      'Investmentziele erkennen'
    ],
    skillsIntro: 'Erstellt ein Käuferprofil, vergleicht es mit allen Immobilien und berechnet:',
    skills: [
      'Matching Score',
      'Risiken',
      'Vorteile',
      'Argumente'
    ],
    output: ['Dieses Objekt passt zu 96 %.'],
    why: 'Menschen kaufen Lösungen. Nicht Immobilien.'
  },
  {
    id: 'content',
    nr: '05',
    name: 'Content Agent',
    role: 'Der Markenaufbauer',
    mission: 'Produziert kontinuierlich hochwertigen Content rund um die Immobilie.',
    tags: ['Storytelling', 'Social Media', 'Luxusmarketing'],
    duties: [
      'LinkedIn Posts',
      'Instagram Posts',
      'Newsletter',
      'Videos',
      'Storytelling',
      'Blogartikel',
      'Investmentanalysen'
    ],
    skillsIntro: 'Kennt:',
    skills: [
      'Zielgruppen',
      'Algorithmen',
      'Storytelling',
      'Copywriting',
      'Architektur',
      'Luxusmarketing'
    ],
    output: ['Jede Woche neue Inhalte.'],
    why: 'Premiumimmobilien verkaufen sich über Vertrauen. Content erzeugt Vertrauen.'
  },
  {
    id: 'relationship',
    nr: '06',
    name: 'Relationship Agent',
    role: 'Der Kundenbetreuer',
    mission: 'Pflegt jede Beziehung langfristig.',
    tags: ['Follow-up', 'Gedächtnis', 'Empfehlungen'],
    duties: [
      'Follow-ups',
      'Erinnerungen',
      'Geburtstage',
      'Gesprächsnotizen',
      'Interessen merken',
      'Empfehlungen verwalten'
    ],
    skillsIntro: 'Kennt jede Interaktion. Weiß:',
    skills: [
      'wann zuletzt gesprochen wurde',
      'was wichtig war',
      'welche Fragen offen sind'
    ],
    output: ['Kein Interessent geht verloren.'],
    why: 'Millionenobjekte werden selten im ersten Gespräch verkauft. Oft entscheidet sich ein Käufer Monate später.'
  },
  {
    id: 'market',
    nr: '07',
    name: 'Market Intelligence Agent',
    role: 'Der Marktanalyst',
    mission: 'Beobachtet permanent den Immobilienmarkt.',
    tags: ['Preisentwicklung', 'Wettbewerb', 'Marktbericht'],
    duties: [
      'Preisentwicklung',
      'Vergleichsobjekte',
      'Nachfrage',
      'Neubauprojekte',
      'Finanzierung',
      'Zinssituation',
      'Konkurrenz'
    ],
    skillsIntro: 'Erkennt:',
    skills: [
      'Preisänderungen',
      'Trends',
      'Marktchancen',
      'Risiken'
    ],
    outputIntro: 'Wöchentliche Marktberichte mit Empfehlungen:',
    output: [
      'Preis erhöhen',
      'Preis senken',
      'Verkaufszeitpunkt',
      'Argumente'
    ],
    why: 'Der Markt verändert sich täglich. Dieser Agent verhindert Entscheidungen auf Basis veralteter Informationen.'
  },
  {
    id: 'negotiation',
    nr: '08',
    name: 'Negotiation Agent',
    role: 'Der Verhandlungsstratege',
    mission: 'Unterstützt den Makler bei Preisverhandlungen.',
    tags: ['Einwände', 'Preisanker', 'Psychologie'],
    duties: [
      'Einwände analysieren',
      'Verhandlung vorbereiten',
      'Gegenargumente entwickeln',
      'Käuferpsychologie analysieren'
    ],
    skillsIntro: 'Kennt:',
    skills: [
      'Verhandlungstechniken',
      'Preisanker',
      'BATNA',
      'Verkaufspsychologie'
    ],
    output: ['Argumentationsleitfäden', 'Verhandlungssimulationen'],
    why: 'Schon wenige Prozentpunkte Preisunterschied können bei hochpreisigen Objekten einen erheblichen finanziellen Unterschied machen. Eine strukturierte Vorbereitung erhöht die Chance auf einen erfolgreichen Abschluss.'
  },
  {
    id: 'operations',
    nr: '09',
    name: 'Operations Agent',
    role: 'Der Bürochef',
    mission: 'Organisiert sämtliche Abläufe.',
    tags: ['CRM', 'Termine', 'Dokumente'],
    duties: [
      'CRM pflegen',
      'Termine koordinieren',
      'Dokumente verwalten',
      'Aufgaben verteilen',
      'Status überwachen'
    ],
    skillsIntro: 'Automatisiert:',
    skills: [
      'Erinnerungen',
      'Aufgaben',
      'Checklisten',
      'Fristen',
      'Dokumentenablage'
    ],
    output: ['Ein perfekt organisiertes Immobilienbüro.'],
    why: 'Vertrieb funktioniert nur dann effizient, wenn die Organisation im Hintergrund zuverlässig läuft.'
  },
  {
    id: 'executive',
    nr: '10',
    name: 'Executive Agent',
    role: 'Der Geschäftsführer',
    mission: 'Koordiniert alle anderen Agenten.',
    tags: ['Steuerung', 'Kennzahlen', 'Briefing'],
    lead: true,
    duties: [
      'Prioritäten setzen',
      'Ziele überwachen',
      'Kennzahlen analysieren',
      'Entscheidungen vorbereiten',
      'Engpässe erkennen'
    ],
    skillsIntro: 'Kennt den aktuellen Status aller Immobilien:',
    skills: [
      'Anzahl Käufer',
      'Anzahl Besichtigungen',
      'Pipeline',
      'Markt',
      'Umsatzprognosen'
    ],
    outputIntro: 'Ein tägliches Management-Briefing:',
    output: [
      'Was ist heute wichtig?',
      'Wo drohen Risiken?',
      'Welche Chancen gibt es?',
      'Welche Aufgaben haben höchste Priorität?'
    ],
    why: 'Ohne zentrale Koordination arbeiten einzelne Spezialisten nebeneinander. Dieser Agent sorgt dafür, dass das gesamte digitale Immobilienbüro wie ein eingespieltes Team funktioniert und alle Informationen zu klaren Entscheidungen zusammengeführt werden.'
  }
];
