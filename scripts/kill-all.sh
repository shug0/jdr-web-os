#!/bin/bash

# Script pour tuer tous les processus liés au projet JDR Coffee
# Utile quand des serveurs restent bloqués après un arrêt non gracieux

echo "🔍 Recherche des processus JDR Coffee..."
echo ""

# Fonction pour afficher et tuer les processus
kill_processes() {
  local pattern=$1
  local description=$2

  pids=$(pgrep -f "$pattern")

  if [ -n "$pids" ]; then
    echo "📍 $description:"
    ps -p $pids -o pid,command | grep -v PID
    echo ""
    echo "   Arrêt de $(echo $pids | wc -w | tr -d ' ') processus..."
    kill $pids 2>/dev/null
    sleep 1

    # Force kill si nécessaire
    still_alive=$(pgrep -f "$pattern")
    if [ -n "$still_alive" ]; then
      echo "   ⚠️  Force kill des processus restants..."
      kill -9 $still_alive 2>/dev/null
    fi
    echo "   ✅ Terminé"
    echo ""
  fi
}

# Tuer les serveurs Next.js
kill_processes "next dev" "Serveurs Next.js (dev)"
kill_processes "next start" "Serveurs Next.js (production)"

# Tuer le proxy local
kill_processes "local-proxy.js" "Proxy local (.jdr.local)"

# Tuer les processus Node.js dans le dossier du projet
kill_processes "/jdr-coffee.*node" "Processus Node.js du projet"

# Tuer les processus pnpm dev
kill_processes "pnpm.*dev" "Processus pnpm dev"

# Tuer les processus turbo
kill_processes "turbo.*dev" "Processus Turbo"

# Vérifier les ports couramment utilisés
echo "🔍 Vérification des ports..."
echo ""

check_port() {
  local port=$1
  local app=$2

  pid=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "   Port $port ($app) utilisé par PID $pid"
    ps -p $pid -o command | grep -v COMMAND
    kill -9 $pid 2>/dev/null
    echo "   ✅ Port $port libéré"
    echo ""
  fi
}

check_port 80 "Proxy local"
check_port 3000 "Web"
check_port 3001 "Combien"
check_port 3002 "PNJ"
check_port 3003 "Admin"

echo "✨ Nettoyage terminé !"
echo ""
echo "💡 Vous pouvez maintenant relancer:"
echo "   pnpm dev          - Développement normal"
echo "   sudo pnpm dev:local - Développement avec .jdr.local"
