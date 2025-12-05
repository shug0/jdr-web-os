# 📝 Changelog - JDR Coffee

Toutes les modifications importantes de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Non publié]

### 🎉 Ajouté
- **Setup Supabase Local Complet** : Configuration Docker avec ports personnalisés (55321-55327)
- **Scripts d'Automation** : `setup-local.sh`, `switch-env.sh`, `migrate-env.sh`
- **Documentation Complète** : README.md, SUPABASE.md, DEVELOPMENT.md
- **Authentication Flow** : Login, reset password, forgot password
- **TypeScript Types** : Types générés automatiquement depuis la DB Supabase
- **Admin Interface** : Dashboard avec gestion des proxies Notion
- **Database Test Page** : Interface de debug et vérification DB
- **Environment Switching** : Basculement facile local/production

### 🏗️ Architecture
- **Monorepo Structure** : Apps et packages organisés avec Turbo
- **Supabase Package** : Client, types et configuration centralisés
- **UI Package** : Composants shadcn/ui partagés
- **Admin App** : Next.js 15 avec App Router
- **Combien App** : Calculateur de prix pour JDR

### 🗄️ Base de Données
- **Tables** : `notion_proxies`, `notion_proxy_data`
- **RLS Policies** : Sécurité au niveau des lignes
- **Migrations** : Synchronisation schema production → local
- **Seed Minimal** : Vérification schema uniquement (pas de données d'exemple)

### ⚙️ Configuration
- **Environnements** : Local (Docker) et Production configurés
- **Variables ENV** : Configuration complète pour développement/production  
- **Port Isolation** : Ports 55321-55327 pour éviter conflits avec autres projets
- **Email Templates** : Templates personnalisés JDR Coffee

### 🛠️ Développement
- **Scripts Automation** : Setup en une commande
- **TypeScript Strict** : Compilation sans erreurs
- **Biome Linting** : Code quality et formatting
- **Build Success** : Build de production fonctionnel
- **Dev Hot Reload** : Développement avec rechargement automatique

### 🔧 Outils
- **Supabase CLI** : Gestion locale de la base de données
- **Docker Integration** : Services isolés et reproductibles
- **Migration Scripts** : Déploiement automatisé entre environnements
- **Type Generation** : Types TypeScript synchronisés avec le schema DB

## [Version Précédente] - Avant Setup Supabase

### Contexte Initial
- Monorepo shadcn/ui basique
- Applications séparées sans base de données commune
- Configuration manuelle requise pour chaque environnement

---

## 🏷️ Format des Versions

- **Major** (X.0.0) : Changements incompatibles avec versions précédentes
- **Minor** (0.X.0) : Nouvelles fonctionnalités compatibles avec versions précédentes  
- **Patch** (0.0.X) : Corrections de bugs compatibles avec versions précédentes

## 🏆 Types de Changements

- **🎉 Ajouté** : Nouvelles fonctionnalités
- **🔄 Modifié** : Changements dans les fonctionnalités existantes
- **❌ Déprécié** : Fonctionnalités qui seront supprimées
- **🗑️ Supprimé** : Fonctionnalités supprimées
- **🐛 Corrigé** : Corrections de bugs
- **🔒 Sécurité** : Corrections de vulnérabilités

---

*Ce changelog est maintenu manuellement. Veuillez le mettre à jour lors de chaque release importante.*