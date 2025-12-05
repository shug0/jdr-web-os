# 🎲 JDR Coffee - Plateforme de Jeu de Rôle

Plateforme complète pour la gestion de sessions de jeu de rôle avec intégration Notion et système de proxies.

## 🏗️ Architecture

Monorepo avec:
- **Admin App** (`apps/admin`) - Interface d'administration Next.js 15
- **Combien App** (`apps/combien`) - Calculateur de prix pour JDR
- **UI Package** (`packages/ui`) - Composants shadcn/ui partagés
- **Supabase Package** (`packages/supabase`) - Configuration et types Supabase

## 🚀 Quick Start

### Prérequis

```bash
# Node.js 22+, pnpm, Docker
# Installer pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh

# Installer Supabase CLI
pnpm add -g supabase
```

### Installation

```bash
# 1. Installer les dépendances
pnpm install

# 2. Setup Supabase local (automatisé)
./scripts/setup-local.sh

# 3. Démarrer en mode développement
pnpm dev
```

### URLs de Développement

- **Admin**: http://localhost:3002
- **Combien**: http://localhost:3001
- **Supabase Studio**: http://127.0.0.1:55323
- **Emails**: http://127.0.0.1:55324

### Compte de Test (Local uniquement)

Le script `setup-local.sh` crée automatiquement un compte de test pour le développement local:
- **Email**: `admin@jdr.coffee`
- **Password**: `admin123`

⚠️ **Ces identifiants sont uniquement pour le développement local Docker. Ne les utilisez JAMAIS en production.**

## 📊 Applications

### Admin App (Port 3002)
Interface principale pour:
- 🗄️ Gestion des proxies Notion
- 👤 Authentification utilisateurs
- 📊 Dashboard de monitoring
- 🔧 Configuration et diagnostics

### Combien App (Port 3001)
Calculateur de monnaie pour JDR:
- 💰 Conversion Or/Argent/Cuivre
- 🧮 Calculs automatiques de prix
- ⚡ Interface rapide et intuitive

## 🗄️ Base de Données

### Configuration Supabase

- **Local**: `http://127.0.0.1:55321`
- **Production**: Configurez votre propre instance Supabase
- **Ports locaux**: 55321-55327 (évite conflits avec autres projets)

Voir les fichiers `.env.example` dans chaque app pour la configuration complète.

### Tables Principales

```sql
notion_proxies {
  id: uuid (PK)
  user_id: uuid (FK)
  notion_database_id: text
  notion_database_name: text
  is_public: boolean
  last_synced: timestamp
  items_count: integer
}

notion_proxy_data {
  id: uuid (PK)
  proxy_id: uuid (FK)
  notion_page_id: text
  data: jsonb
  last_edited: timestamp
}
```

## 🛠️ Développement

### Commandes Principales

```bash
# Développement
pnpm dev                    # Démarrer tous les apps
pnpm dev:admin             # Admin app seulement
pnpm dev:combien           # Combien app seulement

# Build & Test
pnpm build                 # Build tous les projets
pnpm typecheck            # Vérification TypeScript
pnpm lint                 # Linting Biome

# Supabase
supabase start            # Démarrer base locale
supabase stop             # Arrêter base locale
supabase db reset         # Reset avec migrations
```

### Scripts Utiles

```bash
# Basculer environnements
./scripts/switch-env.sh local     # Local Docker
./scripts/switch-env.sh prod      # Production

# Migration environnements
./scripts/migrate-env.sh staging
./scripts/migrate-env.sh production --dry-run
```

### Ajout de Composants UI

```bash
# Ajouter un composant shadcn/ui
pnpm dlx shadcn@latest add button -c apps/admin
pnpm dlx shadcn@latest add dialog -c apps/combien
```

### Types TypeScript

Les types Supabase sont générés automatiquement:

```typescript
import { Database, NotionProxy } from '@workspace/supabase';

// Types disponibles
type Proxy = NotionProxy;
type ProxyData = Database['public']['Tables']['notion_proxy_data']['Row'];
```

## 🔧 Configuration

### Variables d'Environnement

Chaque application possède un fichier `.env.example` avec toutes les variables nécessaires.

```bash
# Copiez les fichiers exemple et remplissez vos valeurs
cp apps/admin/.env.example apps/admin/.env.local
cp apps/combien/.env.example apps/combien/.env.local
cp apps/pnj/.env.example apps/pnj/.env.local

# Pour le développement local avec Supabase Docker
# Les clés sont générées automatiquement par `supabase start`
# Voir la sortie de la commande pour récupérer les clés

# Pour la production
# Obtenez vos clés depuis: https://app.supabase.com/project/_/settings/api
```

### Monorepo Structure

```
jdr-coffee/
├── apps/
│   ├── admin/          # Interface d'admin (Next.js)
│   └── combien/        # Calculateur prix (Next.js)
├── packages/
│   ├── ui/            # Composants shadcn/ui
│   └── supabase/      # Client & types Supabase
├── scripts/           # Scripts d'automation
├── supabase/         # Migrations & config
└── utils/            # Utilitaires partagés
```

## 🚀 Déploiement

### Pipeline Recommandé

1. **Local**: Développement et tests
2. **Staging**: Tests d'intégration
3. **Production**: Déploiement final

```bash
# 1. Test local
pnpm build && pnpm typecheck

# 2. Migration staging
./scripts/migrate-env.sh staging

# 3. Migration production
./scripts/migrate-env.sh production
```

## 📚 Documentation

- [Configuration Supabase](./SUPABASE.md) - Setup détaillé base de données
- [Scripts d'Automation](./scripts/) - Scripts de gestion environnement
- [Types TypeScript](./packages/supabase/src/types.ts) - Types générés auto

## 🔗 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Biome Linter](https://biomejs.dev/)
- [Turbo Monorepo](https://turbo.build/)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 🔒 Sécurité

### Bonnes Pratiques

- ⚠️ **Ne commitez JAMAIS vos fichiers `.env.local`** - ils sont dans `.gitignore` pour une bonne raison
- ⚠️ **Ne partagez JAMAIS vos clés API** dans le code, issues, ou discussions publiques
- ✅ Utilisez les fichiers `.env.example` comme référence pour configurer votre environnement
- ✅ Changez TOUS les secrets en production (utilisez des valeurs différentes du développement local)

### Clés de Développement Local

Les clés dans `scripts/setup-local.sh` sont les **clés par défaut de Supabase local** (générées par Docker).
- Ces clés sont **publiques** et **non sensibles**
- Elles sont identiques pour tous les utilisateurs de Supabase local
- Elles ne peuvent être utilisées que pour accéder à votre instance locale Docker

### Identifiants de Test

Les identifiants `admin@jdr.coffee` / `admin123` sont:
- **Uniquement pour le développement local**
- Créés automatiquement par le script `setup-local.sh`
- ⚠️ **Ne JAMAIS utiliser en production**

### Rotation des Secrets

Si vous rendez ce projet public:
1. Générez de nouvelles clés Supabase pour la production
2. Créez un nouveau token d'intégration Notion
3. Régénérez votre clé API Google Gemini
4. Mettez à jour toutes les variables d'environnement dans Vercel/votre plateforme de déploiement

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
