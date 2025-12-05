# 👩‍💻 Guide de Développement - JDR Coffee

Guide pratique pour les développeurs travaillant sur le projet JDR Coffee.

## 🚀 Premier Setup (Nouveau Développeur)

### 1. Prérequis Système

```bash
# Node.js 22+ et pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh

# Supabase CLI
pnpm add -g supabase

# Docker (pour Supabase local)
# Installer Docker Desktop depuis https://docker.com
```

### 2. Clone et Setup Initial

```bash
# Clone du repo
git clone <repo-url>
cd jdr-coffee

# Installation des dépendances
pnpm install

# Setup automatique complet (recommandé)
./scripts/setup-local.sh
```

Le script `setup-local.sh` fait tout automatiquement :
- ✅ Démarre Supabase local (Docker)
- ✅ Applique les migrations de production
- ✅ Crée l'utilisateur de test `admin@jdr.coffee`
- ✅ Génère les types TypeScript
- ✅ Configure tous les environnements

### 3. Vérification du Setup

```bash
# Test de compilation
pnpm typecheck

# Test de build
pnpm build

# Démarrage en dev
pnpm dev
```

**URLs à vérifier :**
- Admin: http://localhost:3002 (login: voir identifiants de test local)
- Combien: http://localhost:3001
- Supabase Studio: http://127.0.0.1:55323

**Identifiants de test (local uniquement):**
Le script `setup-local.sh` crée: `admin@jdr.coffee` / `admin123`

## 💻 Workflow de Développement

### Démarrage Quotidien

```bash
# 1. Synchroniser avec le repo
git pull origin main

# 2. Mettre à jour les dépendances si nécessaire
pnpm install

# 3. Démarrer Supabase (si pas déjà fait)
supabase start

# 4. Démarrer le dev
pnpm dev
```

### Workflow Feature

```bash
# 1. Créer une branche
git checkout -b feature/ma-nouvelle-feature

# 2. Développer...
# Modifier les fichiers nécessaires

# 3. Tests locaux
pnpm typecheck      # Vérification TypeScript
pnpm lint           # Linting
pnpm build          # Test de build

# 4. Commit et push
git add .
git commit -m "feat: ma nouvelle feature"
git push origin feature/ma-nouvelle-feature
```

### Structure de Commit

Utiliser [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: ajout de la fonctionnalité X
fix: correction du bug Y
docs: mise à jour documentation
style: formatting, indentation
refactor: refactoring sans changement de comportement
test: ajout ou modification de tests
chore: tâches de maintenance
```

## 🗄️ Travail avec la Base de Données

### Modifications de Schéma

```bash
# 1. Créer une nouvelle migration
supabase migration new nom_descriptif

# 2. Éditer le fichier dans supabase/migrations/
# Ajouter le SQL nécessaire

# 3. Appliquer localement
supabase db reset

# 4. Régénérer les types
supabase gen types typescript --local > packages/supabase/src/types.ts
```

### Exemple Migration

```sql
-- Dans supabase/migrations/XXXXXX_add_user_preferences.sql
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light',
  language text DEFAULT 'fr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Reset de la DB Locale

```bash
# Reset complet (perte des données locales)
supabase db reset

# Ou relancer le setup complet
./scripts/setup-local.sh
```

## 🧩 Développement des Applications

### Admin App (`apps/admin`)

Interface principale pour la gestion des proxies Notion.

**Structure :**
```
apps/admin/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Routes d'authentification
│   ├── dashboard/         # Interface principale
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── common/            # Composants génériques
│   └── features/          # Composants spécifiques
└── types/                 # Types TypeScript
```

**Commandes :**
```bash
pnpm dev:admin        # Dev admin uniquement
pnpm build:admin      # Build admin
```

### Combien App (`apps/combien`)

Calculateur de monnaie pour JDR.

**Commandes :**
```bash
pnpm dev:combien      # Dev combien uniquement  
pnpm build:combien    # Build combien
```

### Package UI (`packages/ui`)

Composants shadcn/ui partagés entre les applications.

**Ajout d'un composant :**
```bash
# Ajouter un composant shadcn/ui
pnpm dlx shadcn@latest add dialog -c apps/admin
pnpm dlx shadcn@latest add button -c apps/combien
```

### Package Supabase (`packages/supabase`)

Configuration et types Supabase.

**Fichiers importants :**
- `src/types.ts` - Types générés automatiquement
- `src/client.ts` - Client Supabase browser
- `src/server.ts` - Client Supabase server
- `src/provider.tsx` - Context React
- `src/queries.ts` - Requêtes communes

## 🔧 Debugging & Troubleshooting

### Problèmes Courants

**"Port already in use"**
```bash
# Vérifier les ports utilisés
lsof -i :55321
lsof -i :3002

# Arrêter Supabase
supabase stop --no-backup

# Redémarrer
supabase start
```

**"Types not found"**
```bash
# Régénérer les types
supabase gen types typescript --local > packages/supabase/src/types.ts
```

**"Auth not working"**
```bash
# Recréer l'utilisateur de test
./scripts/setup-local.sh
```

**"Migration failed"**
```bash
# Reset complet de la DB
supabase db reset
```

### Logs et Monitoring

```bash
# Logs Supabase
supabase logs

# Logs spécifiques
supabase logs --service postgres
supabase logs --service gotrue

# Status des services
supabase status
```

### Variables d'Environnement

**Configuration :**
Utilisez les fichiers `.env.example` dans chaque app comme référence.

```bash
# Copiez les fichiers exemple
cp apps/admin/.env.example apps/admin/.env.local

# Pour Supabase local, les clés sont générées par `supabase start`
# Voir la sortie de la commande pour récupérer:
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Pour Notion API
# Créez une intégration sur: https://www.notion.so/my-integrations
NOTION_API_KEY=ntn_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 📱 Tests

### Tests Manuels

1. **Authentification :**
   - Login/Logout avec les identifiants de test local
   - Reset password flow

2. **Proxies Notion :**
   - Création d'un nouveau proxy
   - Synchronisation des données
   - Affichage public/privé

3. **Calculateur (Combien) :**
   - Conversions Or/Argent/Cuivre
   - Interface responsive

### Tests Automatisés (TODO)

```bash
# Tests unitaires (à implémenter)
pnpm test

# Tests E2E (à implémenter)  
pnpm test:e2e
```

## 🚀 Déploiement

### Environnements

- **Local** : Développement (Docker)
- **Staging** : Tests d'intégration (à configurer)
- **Production** : Configurez votre propre instance Supabase

### Pipeline de Migration

```bash
# 1. Développement local
supabase db reset
pnpm build

# 2. Test staging (quand configuré)
./scripts/migrate-env.sh staging

# 3. Production (avec précaution!)
./scripts/migrate-env.sh production --dry-run  # Vérifier
./scripts/migrate-env.sh production           # Appliquer
```

## 📋 Checklist Pull Request

Avant de créer une PR :

- [ ] `pnpm typecheck` passe sans erreur
- [ ] `pnpm lint` passe (warnings OK)
- [ ] `pnpm build` réussit
- [ ] Tests manuels effectués
- [ ] Documentation mise à jour si nécessaire
- [ ] Migrations testées localement
- [ ] Types régénérés si schéma modifié

## 🔗 Ressources Utiles

### Documentation
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Outils
- [Supabase Studio](http://127.0.0.1:55323) - Interface DB
- [Email Testing](http://127.0.0.1:55324) - Interface emails locaux

### Extensions VSCode Recommandées
- TypeScript et JavaScript
- Tailwind CSS IntelliSense
- PostCSS Language Support
- Supabase
- Biome (linter)

## 💡 Conseils

1. **Toujours tester localement** avant de push
2. **Utiliser les types TypeScript** générés par Supabase
3. **Suivre la convention de nommage** des composants
4. **Documenter les nouvelles API** et composants
5. **Utiliser les scripts d'automation** plutôt que les commandes manuelles
6. **Faire des commits atomiques** avec des messages clairs

## 🆘 Support

- **Documentation** : Voir SUPABASE.md et README.md
- **Issues** : Ouvrir un ticket GitHub
- **Questions** : Demander à l'équipe

Bon développement ! 🎲☕