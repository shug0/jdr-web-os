# Test local avec domaines .jdr.local

Ce guide explique comment tester le partage de cookies entre les apps JDR Coffee en développement local.

## 🎯 Objectif

Simuler l'environnement de production avec des domaines `.jdr.local` pour tester le partage de cookies entre toutes les apps, exactement comme en production avec `.jdr.coffee`.

## 📋 Prérequis

### 1. Configuration de `/etc/hosts`

Ajoutez ces lignes à votre fichier `/etc/hosts` :

```bash
sudo nano /etc/hosts
```

Ajoutez :
```
127.0.0.1 jdr.local
127.0.0.1 web.jdr.local
127.0.0.1 combien.jdr.local
127.0.0.1 pnj.jdr.local
127.0.0.1 admin.jdr.local
```

Sauvegardez et quittez (Ctrl+X, Y, Enter).

### 2. Vérification

Testez que la configuration fonctionne :

```bash
ping jdr.local
# Devrait répondre depuis 127.0.0.1
```

## 🚀 Utilisation

### Terminal 1 : Démarrer les serveurs de développement

```bash
pnpm dev
```

Cela démarre tous les serveurs Next.js :
- Web : `localhost:3000`
- Combien : `localhost:3001`
- PNJ : `localhost:3002`
- Admin : `localhost:3003`

### Terminal 2 : Démarrer le proxy local

```bash
# Option A : Caddy (Recommandé - Rapide) ⚡
brew install caddy  # Installation une seule fois
sudo pnpm dev:local

# Option B : Node.js (Plus lent)
sudo pnpm dev:local:node

# Option C : nginx
brew install nginx  # Installation une seule fois
sudo pnpm dev:local:nginx
```

⚠️ **Nécessite `sudo`** car le proxy utilise le port 80.

Le proxy route :
- `http://jdr.local` → `localhost:3000` (web)
- `http://web.jdr.local` → `localhost:3000` (web)
- `http://combien.jdr.local` → `localhost:3001` (combien)
- `http://pnj.jdr.local` → `localhost:3002` (pnj)
- `http://admin.jdr.local` → `localhost:3003` (admin)

## ✅ Test du partage de cookies

1. **Ouvrez** `http://combien.jdr.local` dans votre navigateur
2. **Changez le thème** (light/dark) via le toggle de thème
3. **Ouvrez** `http://pnj.jdr.local` dans un nouvel onglet
4. **Vérifiez** que le thème est synchronisé immédiatement !

### Vérification des cookies

Dans les DevTools de votre navigateur :
1. Application/Storage → Cookies
2. Cherchez le cookie `jdr-context`
3. Vérifiez que :
   - **Domain** : `.jdr.local` ✅
   - **Path** : `/`
   - **Value** : `{"theme":"dark"}` ou `{"theme":"light"}`

## 🔍 Debug

### Le proxy ne démarre pas

```bash
# Vérifier si le port 80 est utilisé
sudo lsof -i :80

# Arrêter le processus si nécessaire
sudo kill -9 <PID>
```

### Les domaines ne résolvent pas

Vérifiez `/etc/hosts` :
```bash
cat /etc/hosts | grep jdr.local
```

Vous devriez voir toutes les entrées listées.

### Hot Module Replacement (HMR) ne fonctionne pas

Le proxy supporte les WebSockets pour HMR. Si ça ne fonctionne pas :
1. Redémarrez le proxy
2. Vérifiez que tous les dev servers sont bien démarrés
3. Rechargez la page

### Les cookies ne se partagent pas

Vérifiez dans DevTools :
1. Le cookie existe bien
2. Le domain est `.jdr.local` (avec le point)
3. Le path est `/`
4. Vous accédez bien aux domaines via `http://` (pas `https://`)

## 🆚 Différences avec la production

| Aspect | Production | Local |
|--------|-----------|-------|
| Domain | `.jdr.coffee` | `.jdr.local` |
| HTTPS | ✅ Oui | ❌ Non |
| Cookie `secure` | ✅ Oui | ❌ Non |
| Port | 443 (HTTPS) | 80 (HTTP) |

## 🎉 Avantages

✅ Test réaliste du partage de cookies
✅ Synchronisation temps réel entre apps
✅ Hot Module Replacement fonctionne
✅ Proche de l'environnement de production
✅ Facile à démarrer/arrêter

## 🔧 Troubleshooting

### Permission denied sur port 80

Le port 80 nécessite les privilèges root :
```bash
# Option A : Caddy (Recommandé - Rapide) ⚡
brew install caddy  # Installation une seule fois
sudo pnpm dev:local

# Option B : Node.js (Plus lent)
sudo pnpm dev:local:node

# Option C : nginx
brew install nginx  # Installation une seule fois
sudo pnpm dev:local:nginx
```

### Autre serveur sur port 80 (Apache, nginx, etc.)

Arrêtez le serveur existant ou modifiez `scripts/local-proxy.js` pour utiliser un autre port (ex: 8080) et accédez via `http://combien.jdr.local:8080`.

### Cache de DNS

Si les domaines ne résolvent pas immédiatement :
```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

## 📝 Notes

- **Ne committez jamais** de modifications à `/etc/hosts`
- Le proxy est **uniquement pour le développement local**
- Les cookies `.jdr.local` sont **automatiquement nettoyés** si vous testez en production
- Utilisez `pnpm dev` normalement si vous n'avez pas besoin de tester les cookies
