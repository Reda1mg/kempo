# 🔐 Configuration des Secrets GitHub Actions

## 📋 Secrets Nécessaires

### 🔧 Pour commencer (minimum requis)
```
# Pas de secrets obligatoires pour la version de base
# GitHub fournit automatiquement GITHUB_TOKEN
```

### 🚀 Pour le déploiement (optionnel)
```
DEPLOY_HOST=votre-serveur.com
DEPLOY_USER=deploy
DEPLOY_KEY=votre-clé-ssh-privée
```

### 🗄️ Base de données production (optionnel)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre-mot-de-passe
DB_NAME=kempo_prod
```

## 🛠️ Comment ajouter les secrets

1. **Aller dans votre repo GitHub**
2. **Settings** → **Secrets and variables** → **Actions**
3. **Cliquer sur "New repository secret"**
4. **Ajouter nom et valeur**

## 🎯 Exemple de configuration

```bash
# Secrets pour déploiement automatique
DEPLOY_HOST=123.456.789.101
DEPLOY_USER=root
DEPLOY_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
[votre clé privée SSH]
-----END OPENSSH PRIVATE KEY-----
```

## ⚡ Pour tester localement

```bash
# Frontend
cd project
npm install
npm test
npm run build

# Backend
cd backend
pnpm install
pnpm test
pnpm build
```
