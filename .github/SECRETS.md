# 🔐 GitHub Actions Secrets Configuration Guide

Ce document explique comment configurer les secrets nécessaires pour les pipelines CI/CD.

## 📋 Secrets Requis

### 🔐 Base de Données
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kempo_collab
DB_USER=root
DB_PASSWORD=your_password_here
```

### 🔐 Production Database
```
PROD_DB_HOST=prod.example.com
PROD_DB_USER=prod_user
PROD_DB_PASSWORD=prod_password
PROD_DB_NAME=kempo_prod
```

### 🔐 Security
```
ENCRYPTION_KEY=your-32-character-encryption-key
```

### ☁️ AWS Configuration
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-north-1
AWS_S3_BUCKET=kempo-tournament-backups-prod
```

### 🚀 Deployment
```
DEPLOY_HOST=your-server.com
DEPLOY_USER=deploy
DEPLOY_KEY=your-ssh-private-key
```

### 📊 Monitoring
```
SONAR_TOKEN=your-sonarqube-token
CODECOV_TOKEN=your-codecov-token
```

## 🔧 Configuration dans GitHub

### 1. Accéder aux Secrets
1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**

### 2. Ajouter les Secrets
Pour chaque secret listé ci-dessus :
1. Cliquez sur **New repository secret**
2. Entrez le nom du secret (ex: `DB_HOST`)
3. Entrez la valeur du secret
4. Cliquez sur **Add secret**

### 3. Configurer les Environments
1. Allez dans **Settings** > **Environments**
2. Créez les environments suivants :
   - `staging`
   - `production`
3. Pour chaque environment, ajoutez les secrets spécifiques

## 🌍 Variables d'Environment

### Variables Repository
```
NODE_VERSION=20
PNPM_VERSION=9
```

### Variables par Environment

#### Staging
```
API_URL=https://staging-api.kempo-tournament.com
FRONTEND_URL=https://staging.kempo-tournament.com
```

#### Production
```
API_URL=https://api.kempo-tournament.com
FRONTEND_URL=https://kempo-tournament.com
```

## 🔒 Bonnes Pratiques de Sécurité

### ✅ À Faire
- Utilisez des mots de passe forts et uniques
- Rotez régulièrement les clés d'accès
- Utilisez des environnements séparés pour staging/production
- Activez la 2FA sur votre compte AWS
- Surveillez les logs d'accès

### ❌ À Éviter
- Ne jamais commiter de secrets dans le code
- Ne pas réutiliser les mêmes mots de passe
- Ne pas partager les clés d'accès
- Ne pas utiliser les mêmes secrets pour différents environnements

## 🔍 Vérification des Secrets

Pour vérifier que vos secrets sont correctement configurés :

1. Déclenchez une pipeline de test
2. Vérifiez les logs pour les erreurs d'authentification
3. Testez les connexions database et AWS
4. Validez les déploiements sur staging avant production

## 🆘 Dépannage

### Problèmes de Database
- Vérifiez les paramètres de connexion
- Assurez-vous que le serveur MySQL est accessible
- Validez les permissions utilisateur

### Problèmes AWS
- Vérifiez les clés d'accès AWS
- Contrôlez les permissions IAM
- Validez la région et le nom du bucket

### Problèmes de Déploiement
- Vérifiez les clés SSH
- Contrôlez les permissions sur le serveur cible
- Validez la configuration réseau

## 📞 Support

Pour toute question sur la configuration des secrets :
1. Consultez la documentation GitHub Actions
2. Vérifiez les logs des pipelines
3. Contactez l'équipe DevOps si nécessaire
