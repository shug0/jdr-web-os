#!/bin/bash

# Script pour basculer entre les environnements local et production
# Usage: ./scripts/switch-env.sh [local|prod]

ENV=${1:-local}

case $ENV in
  "local")
    echo "🔧 Basculement vers l'environnement local (Supabase Docker)"
    cp apps/admin/.env.local.dev apps/admin/.env.local
    echo "✅ Variables d'environnement locales activées"
    echo "📍 Supabase Studio: http://127.0.0.1:55323"
    echo "📧 Inbucket (emails): http://127.0.0.1:55324"
    echo "🗄️  API: http://127.0.0.1:55321"
    ;;
    
  "prod")
    echo "🌐 Basculement vers l'environnement de production"
    git checkout apps/admin/.env.local
    echo "✅ Variables d'environnement de production activées"
    echo "🗄️  API: Votre instance Supabase de production"
    ;;
    
  *)
    echo "❌ Environnement non reconnu: $ENV"
    echo "Usage: $0 [local|prod]"
    exit 1
    ;;
esac