#!/bin/bash

# 🚀 Script de setup automatique pour l'environnement local JDR Coffee
# Ce script configure complètement Supabase en local avec toutes les données

set -e

echo "🚀 Setup automatique de l'environnement local JDR Coffee"
echo "=================================================="

# Configuration pour l'environnement de développement local
SUPABASE_URL="http://127.0.0.1:55321"

# Identifiants de test pour le développement local uniquement
# Ces identifiants sont créés automatiquement pour faciliter le développement
# ⚠️ Ne JAMAIS utiliser ces identifiants en production!
TEST_EMAIL="admin@jdr.coffee"
TEST_PASSWORD="admin123"

# Vérifications préalables
echo "🔍 Vérification des prérequis..."
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé. Installez-le avec: pnpm add -g supabase"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "❌ curl n'est pas installé"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "⚠️  jq n'est pas installé (optionnel, pour un meilleur affichage JSON)"
fi

echo "✅ Prérequis validés"

# Étape 1: Arrêter Supabase si déjà en cours
echo ""
echo "1️⃣  Arrêt de Supabase existant..."
supabase stop --no-backup 2>/dev/null || true

# Étape 2: Basculer vers l'environnement local
echo ""
echo "2️⃣  Configuration de l'environnement local..."
./scripts/switch-env.sh local

# Étape 3: Démarrer Supabase
echo ""
echo "3️⃣  Démarrage de Supabase..."
supabase start

# Attendre que Supabase soit prêt
echo "⏳ Attente que Supabase soit prêt..."
sleep 5

# Vérifier que Supabase répond
for i in {1..30}; do
    if curl -s "$SUPABASE_URL/health" > /dev/null 2>&1; then
        echo "✅ Supabase est prêt!"
        break
    fi
    echo "⏳ Tentative $i/30..."
    sleep 2
done

# Récupérer les clés API depuis supabase status
echo "🔑 Récupération des clés API..."
ANON_KEY=$(supabase status | grep "anon key:" | awk '{print $3}')
SERVICE_KEY=$(supabase status | grep "service_role key:" | awk '{print $3}')

if [ -z "$ANON_KEY" ] || [ -z "$SERVICE_KEY" ]; then
    echo "❌ Impossible de récupérer les clés API"
    echo "Essayez de relancer: supabase status"
    exit 1
fi
echo "✅ Clés API récupérées"

# Étape 4: Créer l'utilisateur de test
echo ""
echo "4️⃣  Création de l'utilisateur de test..."
USER_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: $ANON_KEY" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\", \"data\": {\"full_name\": \"Admin JDR Coffee\"}}")

if echo "$USER_RESPONSE" | grep -q "error"; then
    echo "⚠️  Utilisateur existe déjà ou erreur lors de la création"
    echo "$USER_RESPONSE"
else
    USER_ID=$(echo "$USER_RESPONSE" | jq -r '.user.id' 2>/dev/null || echo "")
    echo "✅ Utilisateur créé avec l'ID: $USER_ID"
fi

# Si on n'a pas récupéré l'ID, on essaie de se connecter pour l'obtenir
if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
    echo "🔍 Tentative de récupération de l'ID utilisateur via connexion..."
    LOGIN_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
      -H "Content-Type: application/json" \
      -H "apikey: $ANON_KEY" \
      -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"$TEST_PASSWORD\"}")
    
    USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id' 2>/dev/null || echo "")
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null || echo "")
fi

if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
    echo "❌ Impossible de récupérer l'ID utilisateur. Vérifiez manuellement."
    echo "Vous pouvez continuer en créant les données via Supabase Studio: http://127.0.0.1:55323"
    exit 1
fi

# Étape 5: Créer les données de test
echo ""
echo "5️⃣  Création des données de test..."
echo "👤 Utilisateur ID: $USER_ID"

# Proxy 1: JDR Sessions
PROXY1_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/rest/v1/notion_proxies" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"notion_database_id\": \"example_database_id_1\",
    \"notion_database_name\": \"JDR Sessions\",
    \"is_public\": true,
    \"items_count\": 5
  }")

# Proxy 2: Characters Database  
PROXY2_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/rest/v1/notion_proxies" \
  -H "Content-Type: application/json" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"notion_database_id\": \"example_database_id_2\",
    \"notion_database_name\": \"Characters Database\",
    \"is_public\": false,
    \"items_count\": 3
  }")

if echo "$PROXY1_RESPONSE" | grep -q "error" && ! echo "$PROXY1_RESPONSE" | grep -q "already exists"; then
    echo "⚠️  Erreur lors de la création du proxy 1: $PROXY1_RESPONSE"
else
    echo "✅ Proxy 'JDR Sessions' créé"
fi

if echo "$PROXY2_RESPONSE" | grep -q "error" && ! echo "$PROXY2_RESPONSE" | grep -q "already exists"; then
    echo "⚠️  Erreur lors de la création du proxy 2: $PROXY2_RESPONSE"
else
    echo "✅ Proxy 'Characters Database' créé"
fi

# Étape 6: Génération des types TypeScript
echo ""
echo "6️⃣  Génération des types TypeScript..."
supabase gen types typescript --local > packages/supabase/src/types.ts
echo "✅ Types générés dans packages/supabase/src/types.ts"

# Résumé final
echo ""
echo "🎉 SETUP TERMINÉ AVEC SUCCÈS!"
echo "================================"
echo ""
echo "🔗 URLs importantes:"
echo "   • Admin App:      http://localhost:3002"
echo "   • Supabase Studio: http://127.0.0.1:55323"
echo "   • Emails (Inbucket): http://127.0.0.1:55324"
echo ""
echo "👤 Connexion:"
echo "   • Email:    $TEST_EMAIL"
echo "   • Password: $TEST_PASSWORD"
echo ""
echo "🗄️  Base de données:"
echo "   • API:      $SUPABASE_URL"
echo "   • DB:       postgresql://postgres:postgres@127.0.0.1:55322/postgres"
echo ""
echo "⚙️  Commandes utiles:"
echo "   • ./scripts/switch-env.sh local    # Environnement local"
echo "   • ./scripts/switch-env.sh prod     # Environnement production"
echo "   • supabase stop --no-backup       # Arrêter Supabase"
echo "   • supabase start                   # Démarrer Supabase"
echo ""
echo "🚀 Vous pouvez maintenant développer en local!"