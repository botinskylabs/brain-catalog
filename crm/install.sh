#!/usr/bin/env bash
#
# Baut das CRM zur installierbaren App und legt sie ab, wo sie hingehoert.
# Aufruf:  ./install.sh
#
set -euo pipefail

cd "$(dirname "$0")"

info() { printf '\033[1;34m▸\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31m✗\033[0m %s\n' "$1" >&2; exit 1; }

command -v node >/dev/null 2>&1 || fail "Node ist nicht installiert. Auf dem Mac: brew install node"

NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
NODE_MINOR=$(node -p 'process.versions.node.split(".")[1]')
if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 5 ]; }; then
  fail "Node $(node -v) ist zu alt – gebraucht wird mindestens 22.5. Update: brew upgrade node"
fi

info "Baubausteine laden (einmalig, ca. 100 MB)…"
npm install --no-audit --no-fund

info "Icon erzeugen…"
npm run --silent icon

case "$(uname -s)" in
  Darwin)
    info "App fuer macOS bauen…"
    CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --dir

    APP_PATH=$(find dist -maxdepth 2 -name 'CRM.app' -print -quit)
    [ -n "$APP_PATH" ] || fail "Build hat keine CRM.app erzeugt"

    info "Nach /Applications kopieren…"
    rm -rf "/Applications/CRM.app"
    cp -R "$APP_PATH" /Applications/
    # Die App ist nicht bei Apple signiert – ohne das hier meldet macOS sie als
    # "beschaedigt", obwohl sie es nicht ist.
    xattr -dr com.apple.quarantine "/Applications/CRM.app" 2>/dev/null || true

    printf '\n\033[1;32m✓\033[0m CRM liegt jetzt in /Applications.\n\n'
    echo "  Starten:        open -a CRM"
    echo "  Agent-Zugang:   im Menue der App unter \"Agent-Zugang\""
    echo "  Installer-Datei (.dmg) zum Weitergeben:  npm run dist:mac"
    open -a CRM || true
    ;;

  Linux)
    info "AppImage bauen…"
    npx electron-builder --linux
    APPIMAGE=$(find dist -maxdepth 1 -name '*.AppImage' -print -quit)
    chmod +x "$APPIMAGE"
    printf '\n\033[1;32m✓\033[0m Fertig: %s\n' "$APPIMAGE"
    ;;

  *)
    info "Windows-Installer bauen…"
    npx electron-builder --win
    printf '\n\033[1;32m✓\033[0m Setup liegt in dist/\n'
    ;;
esac
