# 🚀 Kempo Tournament - CI/CD Pipeline

Ce document explique le système CI/CD complet mis en place pour le projet Kempo Tournament.

## 📋 Vue d'ensemble

Le système CI/CD utilise GitHub Actions pour automatiser :
- ✅ Tests automatisés (unitaires, intégration, sécurité, performance)
- 🔐 Vérifications de sécurité et audits
- 🏗️ Build des applications (frontend React + backend Node.js)
- 🚀 Déploiements automatiques multi-environnements
- 📦 Gestion des releases avec changelog automatique
- 💾 Sauvegardes automatiques AWS S3
- 📊 Monitoring et surveillance continue

## 🔄 Workflows Disponibles

### 1. 🧪 Pipeline Principal (`build.yml`)
**Déclenché par :** Push et Pull Request sur `main`, `dev`, `prod`

**Étapes :**
1. **Tests & Validation** - Tests unitaires, TypeScript check, couverture de code
2. **Sécurité & Qualité** - Audit npm, analyse SonarQube, détection de secrets
3. **Build Applications** - Construction parallèle frontend/backend
4. **Deploy Staging** - Déploiement automatique en staging (`dev`/`main`)
5. **Deploy Production** - Déploiement en production (`prod` uniquement)
6. **Backup & Monitor** - Sauvegarde post-déploiement et monitoring

### 2. 🚀 Déploiement Avancé (`deploy.yml`)
**Déclenché par :** Push sur `prod` ou déclenchement manuel

**Fonctionnalités :**
- Déploiement manuel avec choix d'environnement (staging/production)
- Migrations de base de données automatiques
- Préparation des packages de déploiement
- Vérifications de santé post-déploiement
- Sauvegarde automatique après déploiement
- Notifications de statut

### 3. 🧪 Tests Automatisés (`test.yml`)
**Déclenché par :** Push, Pull Request, ou quotidiennement à 2h

**Types de tests :**
- **Tests unitaires** avec MySQL de test et couverture Codecov
- **Tests d'intégration** avec serveur backend réel
- **Tests de sécurité** - audit npm, détection de secrets, test de chiffrement
- **Tests de performance** - temps de réponse, charge système
- **Rapport de synthèse** - agrégation des résultats

### 4. 📦 Gestion des Releases (`release.yml`)
**Déclenché par :** Tags `v*` ou déclenchement manuel

**Fonctionnalités :**
- Génération automatique de changelog avec comparaison de versions
- Création de packages de release avec instructions de déploiement
- Déploiement automatique en production pour les tags
- Vérifications de santé post-déploiement
- Notifications d'équipe multi-canaux

### 5. 📊 Monitoring & Surveillance (`monitoring.yml`)
**Déclenché par :** Toutes les heures + rapport quotidien à 8h

**Fonctionnalités :**
- **Health Check** - statut application, SSL, DNS
- **Security Monitoring** - surveillance des vulnérabilités
- **Performance Monitoring** - temps de réponse, charge système
- **Backup Monitoring** - vérification et test des sauvegardes
- **Rapport quotidien** - synthèse complète du système
- **Système d'alertes** - notifications en cas de problème
- **Nettoyage automatique** - suppression des données anciennes

## 🛠️ Configuration Requise

### Variables d'Environment GitHub
```bash
# Repository Variables
NODE_VERSION=20
PNPM_VERSION=9
CI_TIMEOUT=30
TEST_TIMEOUT=60
BUILD_TIMEOUT=20
```

### Secrets GitHub (Repository)
```bash
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kempo_collab
DB_USER=root
DB_PASSWORD=your_secure_password

# Production
PROD_DB_HOST=prod.server.com
PROD_DB_USER=prod_user
PROD_DB_PASSWORD=prod_secure_password
PROD_DB_NAME=kempo_prod

# Sécurité
ENCRYPTION_KEY=your-32-character-encryption-key-here

# AWS S3 (Sauvegardes)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-north-1
AWS_S3_BUCKET=kempo-tournament-backups-prod

# Déploiement
DEPLOY_HOST=your-production-server.com
DEPLOY_USER=deploy
DEPLOY_KEY=your-ssh-private-key

# Monitoring & Qualité
SONAR_TOKEN=your-sonarqube-token
CODECOV_TOKEN=your-codecov-token
```

### Environments GitHub
Créez les environnements suivants dans GitHub :
- **`staging`** - Déploiement automatique, pas de reviewers
- **`production`** - Déploiement avec approbation, 2 reviewers requis

## 🌟 Fonctionnalités Avancées

### 🔀 Stratégie de Branches
```
main    → Tests complets → Staging automatique
dev     → Tests complets → Staging automatique  
prod    → Tests complets → Production avec approbation
feature → Tests uniquement
```

### 🎯 Déclencheurs Intelligents
- **Push** sur branches principales → Pipeline complète
- **Pull Request** → Tests complets + preview
- **Tags v*** → Release automatique avec déploiement
- **Schedule quotidien** → Tests de régression + monitoring
- **Manuel** → Déploiement flexible avec choix d'environnement

### 📊 Monitoring & Reporting
- **Codecov** - Couverture de code avec seuils configurables
- **SonarQube** - Qualité du code et détection des bugs
- **GitHub Actions** - Logs détaillés et métriques
- **Surveillance continue** - Health checks, performance, sécurité
- **Alertes automatiques** - Notifications en cas de problème

## 🚀 Utilisation

### ⚡ Démarrage Rapide

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Reda1mg/kempo.git
   cd kempo
   ```

2. **Configuration automatique**
   ```bash
   # Linux/Mac
   chmod +x setup-ci-cd.sh
   ./setup-ci-cd.sh all

   # Windows
   # Voir CI-CD-CONFIG.md pour configuration manuelle
   ```

3. **Utiliser les scripts d'aide**
   ```bash
   # Linux/Mac
   ./dev-helper.sh check
   ./dev-helper.sh install
   ./dev-helper.sh dev

   # Windows
   .\dev-helper.ps1 check
   .\dev-helper.ps1 install
   .\dev-helper.ps1 dev
   ```

### 🔄 Workflow de Développement

1. **Développement local**
   ```bash
   git checkout -b feature/nouvelle-fonctionnalite
   # Développer la fonctionnalité
   ./dev-helper.sh test    # Tests locaux
   git add . && git commit -m "feat: nouvelle fonctionnalité"
   git push origin feature/nouvelle-fonctionnalite
   ```

2. **Pull Request avec tests automatiques**
   - Créer une PR vers `main`
   - Tests automatiques s'exécutent
   - Review et merge après validation

3. **Déploiement Staging**
   ```bash
   git checkout main
   git merge feature/nouvelle-fonctionnalite
   git push origin main
   # → Déploiement automatique en staging
   ```

4. **Déploiement Production**
   ```bash
   git checkout prod
   git merge main
   git push origin prod
   # → Déploiement avec approbation requise
   ```

### 🏷️ Création d'une Release

1. **Release avec tag**
   ```bash
   git checkout main
   git tag v1.2.3
   git push origin v1.2.3
   # → Release automatique avec changelog
   ```

2. **Release manuelle**
   - Aller dans Actions → Release Management
   - Cliquer sur "Run workflow"
   - Spécifier la version (ex: v1.2.3)

## 🔧 Configuration Avancée

### 🎛️ Personnalisation des Tests
Éditez `.github/workflows/test.yml` pour :
- Ajouter de nouveaux types de tests
- Modifier les seuils de couverture
- Configurer des bases de données différentes
- Ajuster les timeouts

### 🚀 Configuration des Déploiements
Éditez `.github/workflows/deploy.yml` pour :
- Modifier les serveurs cibles
- Ajouter des étapes de déploiement
- Configurer les scripts de migration
- Personnaliser les notifications

### 📊 Monitoring Personnalisé
Éditez `.github/workflows/monitoring.yml` pour :
- Ajouter des métriques spécifiques
- Configurer des alertes personnalisées
- Modifier les seuils de performance
- Ajuster les horaires de surveillance

## 🛡️ Sécurité & Bonnes Pratiques

### 🔐 Sécurité des Secrets
- ✅ Tous les secrets sont chiffrés dans GitHub
- ✅ Séparation stricte des environnements
- ✅ Rotation régulière des clés (recommandé: 90 jours)
- ✅ Permissions minimales pour les tokens
- ✅ Audit automatique des accès

### 🧪 Qualité du Code
- ✅ Tests obligatoires avant merge
- ✅ Couverture de code minimum 80%
- ✅ Analyse statique avec SonarQube
- ✅ Détection automatique des vulnérabilités
- ✅ Validation des bonnes pratiques

### 🔄 Déploiement Sécurisé
- ✅ Déploiements avec approbation
- ✅ Rollback automatique en cas d'erreur
- ✅ Tests de santé post-déploiement
- ✅ Sauvegardes automatiques
- ✅ Monitoring en temps réel

## 📞 Support & Documentation

### 📚 Documentation Complète
- **[Configuration CI/CD](.github/CI-CD-CONFIG.md)** - Configuration détaillée
- **[Secrets GitHub](.github/SECRETS.md)** - Guide des secrets
- **[Scripts d'aide](dev-helper.sh)** - Automatisation locale
- **[Sécurité](SECURITY.md)** - Guide de sécurité complet

### 🛠️ Outils de Dépannage
1. **Vérifier les logs** dans GitHub Actions
2. **Valider les secrets** avec les scripts de test
3. **Tester localement** avec les scripts d'aide
4. **Monitorer en temps réel** avec le workflow monitoring

### 🤝 Support Technique
- **📧 Email** : devops@kempo-tournament.com
- **💬 Slack** : #devops-support
- **🐛 Issues** : GitHub Issues avec templates automatiques
- **📖 Wiki** : Documentation complète en ligne

## 🎯 Roadmap & Améliorations

### 📈 Prochaines Fonctionnalités
- [ ] Déploiement Blue-Green
- [ ] Tests de charge automatisés
- [ ] Intégration Kubernetes
- [ ] Monitoring avancé avec Grafana
- [ ] Cache intelligent des builds

### 🔄 Améliorations Continues
- [ ] Optimisation des temps de build
- [ ] Parallélisation avancée des tests
- [ ] Notifications enrichies
- [ ] Dashboard de métriques
- [ ] Intégration JIRA/Trello

---

**🎉 Votre pipeline CI/CD est maintenant configurée et prête pour la production !**

> **Note** : Ce système CI/CD est conçu pour évoluer avec votre projet. N'hésitez pas à l'adapter selon vos besoins spécifiques.
