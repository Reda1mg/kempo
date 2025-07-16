# 🚀 Guide de Démarrage CI/CD - Kempo Tournament

## 📋 Checklist de Mise en Place

### ✅ **Phase 1: Activation de Base**
- [ ] Vérifier que les fichiers sont dans `.github/workflows/`
- [ ] Faire un commit et push sur la branche `dev`
- [ ] Vérifier que les Actions s'exécutent dans l'onglet "Actions" de GitHub

### ✅ **Phase 2: Configuration des Branches**
```bash
# Créer les branches si elles n'existent pas
git checkout -b dev
git checkout -b main
git checkout -b prod
```

### ✅ **Phase 3: Test du Pipeline**
```bash
# 1. Modifier un fichier
echo "test" >> README.md

# 2. Commit et push
git add .
git commit -m "test: CI/CD pipeline"
git push origin dev

# 3. Vérifier dans GitHub Actions
```

## 🔄 **Workflow Simplifié**

### 📝 **Développement** (`dev` branch)
```bash
git checkout dev
# Faire vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin dev
```
➡️ **Déclenche**: Tests + Build

### 🔄 **Staging** (`main` branch)
```bash
git checkout main
git merge dev
git push origin main
```
➡️ **Déclenche**: Tests + Build + Sécurité

### 🚀 **Production** (`prod` branch)
```bash
git checkout prod
git merge main
git push origin prod
```
➡️ **Déclenche**: Tests + Build + Sécurité + Déploiement

## 📦 **Création de Release**
```bash
# Créer un tag
git tag v1.0.0
git push origin v1.0.0
```
➡️ **Déclenche**: Création automatique de release

## 🔍 **Vérification**

### ✅ **Vérifier que ça fonctionne**
1. Aller dans **GitHub** → **Actions**
2. Voir les workflows en cours
3. Vérifier les logs en cas d'erreur

### ❌ **En cas d'erreur**
1. Cliquer sur le workflow échoué
2. Voir les logs détaillés
3. Corriger le problème
4. Recommencer

## 🎯 **Structure des Fichiers**
```
.github/
├── workflows/
│   ├── ci-cd.yml          # Pipeline principal
│   └── release.yml        # Gestion des releases
├── SECRETS-SIMPLE.md      # Configuration des secrets
└── README-CICD.md         # Ce guide
```

## 📞 **Support**
- Les workflows sont simples et commentés
- Chaque étape est explicite
- Les erreurs sont visibles dans les logs GitHub Actions
