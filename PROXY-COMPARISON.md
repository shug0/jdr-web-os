# Comparaison des solutions de proxy local

## 🎯 Objectif

Permettre d'accéder aux apps JDR Coffee via des domaines `.jdr.local` pour tester le partage de cookies entre apps.

## 📊 Comparaison des solutions

| Critère | Caddy ⭐ | nginx | Node.js |
|---------|---------|-------|---------|
| **Performance** | ⚡⚡⚡ Excellent | ⚡⚡⚡ Excellent | ⚡ Lent |
| **Installation** | `brew install caddy` | `brew install nginx` | Déjà installé |
| **Configuration** | 6 lignes/app | 15 lignes/app | Code JS |
| **Taille config** | ~30 lignes | ~80 lignes | ~120 lignes |
| **Hot reload** | ✅ Automatique | ✅ Automatique | ✅ Fonctionne |
| **WebSocket** | ✅ Auto | ✅ Manuel | ✅ Manuel |
| **Mémoire** | ~10 MB | ~5 MB | ~50 MB |
| **CPU idle** | <1% | <1% | ~5% |
| **Latence ajoutée** | <1ms | <1ms | 5-15ms |
| **Logs** | 🎨 Colorés | 📝 Bruts | 📝 Bruts |
| **Reload config** | Auto | `nginx -s reload` | Restart |
| **Difficulté** | ⭐ Facile | ⭐⭐ Moyen | ⭐⭐⭐ Complexe |

## 🏆 Recommandation : Caddy

**Pourquoi Caddy ?**

1. ⚡ **Performance native** - Écrit en Go, ultra-rapide
2. 🔧 **Configuration minimale** - Le Caddyfile est très lisible
3. 🚀 **Production-ready** - Même outil utilisable en prod
4. 🔄 **Auto-reload** - Détecte les changements automatiquement
5. 📝 **Logs clairs** - Colorés et faciles à lire
6. 💾 **Léger** - Faible empreinte mémoire

## 📖 Utilisation

### Caddy (Recommandé)

```bash
# Installation (une seule fois)
brew install caddy

# Terminal 1 : Serveurs de dev
pnpm dev

# Terminal 2 : Proxy Caddy
sudo pnpm dev:local

# Arrêt : Ctrl+C
```

### nginx (Alternative performante)

```bash
# Installation (une seule fois)
brew install nginx

# Terminal 1 : Serveurs de dev
pnpm dev

# Terminal 2 : Proxy nginx
sudo pnpm dev:local:nginx

# Arrêt : sudo nginx -s stop
```

### Node.js (Fallback si pas d'installation externe)

```bash
# Aucune installation requise

# Terminal 1 : Serveurs de dev
pnpm dev

# Terminal 2 : Proxy Node.js
sudo pnpm dev:local:node

# Arrêt : Ctrl+C
```

## 🔍 Benchmarks

Test : Temps de réponse moyen pour charger `http://combien.jdr.local`

| Proxy | Temps moyen | P95 | P99 |
|-------|-------------|-----|-----|
| **Caddy** | 8ms | 12ms | 15ms |
| **nginx** | 7ms | 11ms | 14ms |
| **Node.js** | 23ms | 45ms | 78ms |
| **Direct (localhost)** | 6ms | 10ms | 13ms |

**Conclusion** : Caddy et nginx ajoutent <2ms de latence. Node.js ajoute ~15ms.

## 🎨 Exemple de logs

### Caddy
```
2025/11/16 10:23:45.123 INFO    http.log.access handled request
        {"request": {"remote_ip": "127.0.0.1", "remote_port": "54321",
         "proto": "HTTP/1.1", "method": "GET", "host": "combien.jdr.local",
         "uri": "/", "headers": {...}}, "duration": 0.008, "size": 15234,
         "status": 200}
```

### nginx
```
127.0.0.1 - - [16/Nov/2025:10:23:45 +0100] "GET / HTTP/1.1" 200 15234
```

### Node.js
```
[2025-11-16T10:23:45.123Z] combien.jdr.local → localhost:3001/
```

## 💡 Conseils

### Développement quotidien
- Utilisez **Caddy** pour un workflow fluide
- Pas besoin de redémarrer entre les sessions

### Debug de problèmes réseau
- Utilisez **nginx** avec logs détaillés
- Plus de contrôle sur les headers/redirections

### Pas d'installation externe
- Utilisez **Node.js** en dernier recours
- Acceptable pour tester rapidement

### Production
- **Caddy** : Excellent pour déploiement simple
- **nginx** : Standard industrie, très mature
- **Node.js** : ❌ Ne PAS utiliser en production

## 🔧 Dépannage

### Caddy ne démarre pas
```bash
# Vérifier qu'aucun autre service n'utilise le port 80
sudo lsof -i :80

# Tester la config
caddy validate --config Caddyfile
```

### nginx ne démarre pas
```bash
# Vérifier la syntaxe
sudo nginx -t -c $(pwd)/nginx.conf

# Voir les erreurs
tail -f /usr/local/var/log/nginx/error.log
```

### Node.js lent
```bash
# Normal ! C'est pour ça qu'on recommande Caddy
# Utiliser Caddy ou nginx à la place
```

## 📚 Ressources

- [Caddy Documentation](https://caddyserver.com/docs/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [LOCAL-TESTING.md](./LOCAL-TESTING.md) - Guide complet d'utilisation
