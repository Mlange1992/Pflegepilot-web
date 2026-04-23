#!/bin/bash

# ============================================
# PflegePilot — Projekt-Setup
# Führe dieses Script im Terminal aus
# ============================================

echo "🚀 PflegePilot Setup wird gestartet..."
echo ""

# 1. Projektordner erstellen
mkdir -p ~/projects/pflegepilot
cd ~/projects/pflegepilot

echo "📁 Projektordner erstellt: ~/projects/pflegepilot"
echo ""

# 2. SPEC.md und CLAUDE.md werden gleich manuell reinkopiert
# (die Dateien aus dem Chat herunterladen und hier ablegen)

echo "📋 Bitte lege jetzt SPEC.md und CLAUDE.md in diesen Ordner:"
echo "   ~/projects/pflegepilot/SPEC.md"
echo "   ~/projects/pflegepilot/CLAUDE.md"
echo ""
echo "   (Download aus dem Claude Chat)"
echo ""

# 3. Prüfen ob Node.js installiert ist
if command -v node &> /dev/null; then
    echo "✅ Node.js gefunden: $(node --version)"
else
    echo "❌ Node.js nicht gefunden. Bitte installieren: https://nodejs.org"
    exit 1
fi

# 4. Prüfen ob Claude Code installiert ist
if command -v claude &> /dev/null; then
    echo "✅ Claude Code gefunden"
else
    echo "⚠️  Claude Code nicht gefunden."
    echo "   Installieren mit: npm install -g @anthropic-ai/claude-code"
    echo ""
    read -p "Jetzt installieren? (j/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Jj]$ ]]; then
        npm install -g @anthropic-ai/claude-code
    fi
fi

echo ""
echo "============================================"
echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo ""
echo "  1. SPEC.md und CLAUDE.md in ~/projects/pflegepilot/ ablegen"
echo ""
echo "  2. Claude Code starten:"
echo "     cd ~/projects/pflegepilot"
echo "     claude"
echo ""
echo "  3. Claude Code den ersten Befehl geben:"
echo '     "Lies SPEC.md und CLAUDE.md. Starte mit Schritt 1:'
echo '      Erstelle das Next.js Projekt mit TypeScript und'
echo '      Tailwind, dann die Supabase-Konfiguration und'
echo '      das Datenmodell. Danach die Pflegerecht-Engine'
echo '      mit den JSON-Configs."'
echo ""
echo "============================================"
