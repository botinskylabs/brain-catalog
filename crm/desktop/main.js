/**
 * Desktop-Huelle: startet den CRM-Server im eigenen Prozess und zeigt die
 * Oberflaeche in einem eigenen Fenster. Die Datenbank liegt im Benutzerordner
 * der App, nicht im Programmordner – ein Update ueberschreibt also nie Daten.
 */
import { app, BrowserWindow, Menu, clipboard, shell, dialog } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Muss vor dem Import von config.js/server.js stehen – die lesen die Umgebung
// beim Laden aus.
process.env.CRM_DATA_DIR ??= app.getPath('userData')
process.env.CRM_HOST ??= '127.0.0.1'

/** Bevorzugt 4321, damit die dokumentierten API-Beispiele stimmen. */
const PORT_CANDIDATES = [4321, 4322, 4323, 4324, 0]

let mainWindow
let baseUrl = ''
let config
let createServer

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, config.host, () => {
      server.removeListener('error', reject)
      resolve(server.address().port)
    })
  })
}

async function startServer() {
  const server = createServer()
  for (const port of PORT_CANDIDATES) {
    try {
      return await listen(server, port)
    } catch (err) {
      if (err.code !== 'EADDRINUSE') throw err
    }
  }
  throw new Error('Kein freier Port gefunden')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 760,
    minHeight: 520,
    title: 'CRM',
    backgroundColor: '#f6f7f9',
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.loadURL(baseUrl)

  // Externe Links im richtigen Browser oeffnen, nicht im App-Fenster.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(baseUrl)) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

/**
 * Der MCP-Server laeuft als eigener Prozess. In der installierten App ist kein
 * System-Node noetig: die Electron-Binary kann selbst als Node laufen.
 */
function mcpCommand() {
  const script = path.join(appDir, 'src', 'mcp.js')
  if (app.isPackaged) {
    return {
      command: process.execPath,
      args: [script],
      env: { ELECTRON_RUN_AS_NODE: '1', CRM_DATA_DIR: config.dataDir },
    }
  }
  return { command: 'node', args: [script], env: { CRM_DATA_DIR: config.dataDir } }
}

function mcpJson() {
  const { command, args, env } = mcpCommand()
  return JSON.stringify({ mcpServers: { crm: { command, args, env } } }, null, 2)
}

function mcpCliCommand() {
  const { command, args, env } = mcpCommand()
  const envFlags = Object.entries(env)
    .map(([key, value]) => `--env ${key}='${value}'`)
    .join(' ')
  return `claude mcp add crm ${envFlags} -- '${command}' '${args[0]}'`
}

function copyAndNotify(text, title, detail) {
  clipboard.writeText(text)
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title,
    message: `${title} – in die Zwischenablage kopiert`,
    detail,
    buttons: ['OK'],
  })
}

function buildMenu() {
  const agentMenu = {
    label: 'Agent-Zugang',
    submenu: [
      {
        label: 'MCP-Befehl kopieren (Claude Code)',
        click: () =>
          copyAndNotify(
            mcpCliCommand(),
            'MCP-Befehl',
            'Im Terminal einfuegen und ausfuehren. Danach kennen deine Agents die crm_*-Tools.',
          ),
      },
      {
        label: 'MCP-Konfiguration kopieren (JSON)',
        click: () =>
          copyAndNotify(
            mcpJson(),
            'MCP-Konfiguration',
            'In die mcpServers-Konfiguration deines Agents einfuegen (z. B. Claude Desktop).',
          ),
      },
      { type: 'separator' },
      {
        label: 'API-Adresse kopieren',
        click: () =>
          copyAndNotify(
            `${baseUrl}/api`,
            'API-Adresse',
            'REST-Zugang, solange die App laeuft. Beispiel: curl ' + baseUrl + '/api/stats',
          ),
      },
      {
        label: 'Datenbank-Pfad kopieren',
        click: () => copyAndNotify(config.dbPath, 'Datenbank-Pfad', 'Diese eine Datei ist dein kompletter Datenbestand.'),
      },
      {
        label: 'Datenordner anzeigen',
        click: () => shell.showItemInFolder(config.dbPath),
      },
    ],
  }

  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    {
      label: 'Datei',
      submenu: [
        { label: 'Neu laden', accelerator: 'CmdOrCtrl+R', click: () => mainWindow?.reload() },
        { type: 'separator' },
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    {
      label: 'Ansicht',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
      ],
    },
    agentMenu,
    {
      role: 'help',
      submenu: [
        { label: 'Im Browser oeffnen', click: () => shell.openExternal(baseUrl) },
        {
          label: 'Ueber diese App',
          click: () =>
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'CRM',
              message: `CRM ${app.getVersion()}`,
              detail: `Oberflaeche: ${baseUrl}\nDatenbank: ${config.dbPath}\n\nAgents greifen ueber MCP oder die REST-API auf dieselben Daten zu.`,
              buttons: ['OK'],
            }),
        },
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })

  app.whenReady().then(async () => {
    try {
      // Erst hier laden: config.js liest die Umgebung beim Import aus.
      ;({ config } = await import('../src/config.js'))
      ;({ createServer } = await import('../src/server.js'))
      const port = await startServer()
      baseUrl = `http://${config.host}:${port}`
      console.log(`[crm] ${baseUrl} – Datenbank: ${config.dbPath}`)
    } catch (err) {
      dialog.showErrorBox('CRM konnte nicht starten', String(err.message ?? err))
      app.quit()
      return
    }
    buildMenu()
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
