# 🗄️ Supabase Configuration - JDR Coffee

Ce document décrit la configuration complète de Supabase pour le projet JDR Coffee.

## 📋 Table des matières

- [Setup Local](#-setup-local)
- [Configuration des Environnements](#️-configuration-des-environnements)
- [Migrations](#-migrations)
- [Scripts Disponibles](#-scripts-disponibles)
- [Développement](#-développement)
- [Déploiement](#-déploiement)

## 🚀 Setup Local

### Prérequis

```bash
# Installer Supabase CLI
pnpm add -g supabase

# Vérifier l'installation
supabase --version
```

### Installation Automatique

```bash
# Setup complet automatisé (recommandé)
./scripts/setup-local.sh
```

Cette commande :
- ✅ Configure Supabase en local avec Docker
- ✅ Applique le schéma de production
- ✅ Crée un utilisateur de test
- ✅ Vérifie la structure des tables (sans données d'exemple)
- ✅ Génère les types TypeScript

### Installation Manuelle

Si vous préférez faire le setup étape par étape :

```bash
# 1. Basculer vers l'environnement local
./scripts/switch-env.sh local

# 2. Démarrer Supabase
supabase start

# 3. Créer un utilisateur de test (local uniquement)
curl -X POST 'http://127.0.0.1:55321/auth/v1/signup' \
  -H 'Content-Type: application/json' \
  -H 'apikey: ANON_KEY' \
  -d '{"email": "test@example.com", "password": "your_password_here"}'

# Note: Le script setup-local.sh crée automatiquement admin@jdr.coffee/admin123

# 4. Générer les types
supabase gen types typescript --local > packages/supabase/src/types.ts
```

## ⚙️ Configuration des Environnements

### Local (Développement)
- **API**: `http://127.0.0.1:55321`
- **Studio**: `http://127.0.0.1:55323`
- **Emails**: `http://127.0.0.1:55324`
- **Ports**: 55321-55327 (évite les conflits avec orguin sur 54321-54327)

### Production
- **API**: Configurez votre propre instance Supabase
- **Référence**: Votre project_ref depuis Supabase Dashboard
- Obtenez vos informations sur: https://app.supabase.com/project/_/settings/api

## 🔄 Basculer entre Environnements

```bash
# Environnement local (Docker)
./scripts/switch-env.sh local

# Environnement de production
./scripts/switch-env.sh prod
```

## 📊 Schéma de Base de Données

### Tables Principales

```sql
-- Proxies Notion (bases de données Notion exposées via l'API)
notion_proxies {
  id: uuid (PK)
  user_id: uuid (FK -> auth.users)
  notion_database_id: text
  notion_database_name: text
  is_public: boolean
  last_synced: timestamp
  created_at: timestamp
  items_count: integer
}

-- Données des pages Notion
notion_proxy_data {
  id: uuid (PK)
  proxy_id: uuid (FK -> notion_proxies)
  notion_page_id: text
  data: jsonb
  last_edited: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

### Sécurité (RLS)

- ✅ Row Level Security activé
- ✅ Policies pour lecture publique des proxies publics
- ✅ Policies pour gestion privée par utilisateur
- ✅ Policies pour accès aux données liées

### Seed Data

Le fichier `supabase/seed.sql` ne crée **aucune donnée d'exemple**. Il vérifie uniquement que les tables requises existent après les migrations. Les utilisateurs créent leurs propres proxies via l'interface d'administration.

## 🔄 Migrations

### Créer une Migration

```bash
# Créer une nouvelle migration
supabase migration new nom_de_la_migration

# Éditer le fichier créé dans supabase/migrations/
```

### Appliquer les Migrations

```bash
# Local
supabase db reset  # Recrée la DB avec toutes les migrations

# Production (attention!)
supabase db push
```

### Migrer vers un Environnement

```bash
# Staging (test)
./scripts/migrate-env.sh staging

# Production (attention!)
./scripts/migrate-env.sh production

# Dry-run pour voir ce qui serait fait
./scripts/migrate-env.sh production --dry-run
```

## 🛠️ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `./scripts/setup-local.sh` | Setup complet automatisé |
| `./scripts/switch-env.sh [local\|prod]` | Basculer entre environnements |
| `./scripts/migrate-env.sh [staging\|production]` | Migrer vers un environnement |

## 💻 Développement

### URLs Importantes

- **Admin App**: http://localhost:3002
- **Test DB**: http://localhost:3002/dashboard/test-db
- **Studio**: http://127.0.0.1:55323
- **Emails**: http://127.0.0.1:55324

### Utilisateur de Test (Local uniquement)

Le script `setup-local.sh` crée automatiquement:
- **Email**: `admin@jdr.coffee`
- **Password**: `admin123`

⚠️ **Ces identifiants sont uniquement pour le développement local Docker.**

### Commandes Utiles

```bash
# Démarrer/Arrêter Supabase
supabase start
supabase stop --no-backup

# Voir les logs
supabase logs

# Générer les types
supabase gen types typescript --local > packages/supabase/src/types.ts

# Reset complet
supabase db reset
```

### Types TypeScript

Les types sont générés automatiquement dans `packages/supabase/src/types.ts` :

```typescript
import { Database } from '@workspace/supabase/types';

// Exemple d'utilisation
type NotionProxy = Database['public']['Tables']['notion_proxies']['Row'];
```

## 🚀 Déploiement

### Workflow Recommandé

1. **Développement**: Développer en local
2. **Test**: Migrer vers staging
3. **Validation**: Tester en staging
4. **Production**: Migrer vers production

### Pipeline de Migration

```bash
# 1. Tester localement
supabase db reset
pnpm test

# 2. Migrer vers staging
./scripts/migrate-env.sh staging

# 3. Tests en staging
# [Tests manuels ou automatisés]

# 4. Migrer vers production
./scripts/migrate-env.sh production
```

### Rollback

En cas de problème :

```bash
# Revenir à la migration précédente
supabase migration repair --status reverted

# Ou restaurer depuis un backup
# (selon votre stratégie de backup)
```

## 🔧 Troubleshooting

### Problèmes Courants

**Port déjà utilisé**
```bash
# Vérifier les ports
lsof -i :55321
# Arrêter Supabase
supabase stop --no-backup
```

**Problèmes d'authentification**
```bash
# Recréer l'utilisateur de test
./scripts/setup-local.sh
```

**Types non à jour**
```bash
# Régénérer les types
supabase gen types typescript --local > packages/supabase/src/types.ts
```

### Logs et Debugging

```bash
# Logs Supabase
supabase logs

# Logs spécifiques
supabase logs --service postgres
supabase logs --service gotrue
```

## 📝 Bonnes Pratiques

1. **Toujours tester en local** avant de migrer
2. **Utiliser le dry-run** pour les migrations critiques
3. **Sauvegarder** avant les migrations de production
4. **Monitorer** les logs après déploiement
5. **Versionner** toutes les migrations
6. **Tester le rollback** sur staging

## 🔗 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [CLI Supabase](https://supabase.com/docs/guides/cli)
- [Migrations](https://supabase.com/docs/guides/cli/local-development)
- [TypeScript Types](https://supabase.com/docs/guides/api/generating-types)