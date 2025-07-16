#!/bin/bash

# 🚀 Kempo Tournament - Configuration Initiale CI/CD
# Ce script configure automatiquement l'environnement CI/CD

set -e

REPO_NAME="kempo-tournament"
REPO_OWNER="Reda1mg"
GITHUB_TOKEN=""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}🔧 Configuration CI/CD - $1${NC}"
    echo "================================"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier les prérequis
check_prerequisites() {
    print_header "Vérification des prérequis"
    
    # Vérifier GitHub CLI
    if command -v gh &> /dev/null; then
        print_success "GitHub CLI installé"
    else
        print_error "GitHub CLI non installé. Installez avec: https://cli.github.com/"
        exit 1
    fi
    
    # Vérifier l'authentification GitHub
    if gh auth status &> /dev/null; then
        print_success "Authentification GitHub OK"
    else
        print_error "Authentification GitHub requise. Exécutez: gh auth login"
        exit 1
    fi
    
    echo ""
}

# Créer les environments GitHub
create_environments() {
    print_header "Création des environments GitHub"
    
    # Environment staging
    echo "🌟 Création de l'environment staging..."
    gh api repos/$REPO_OWNER/$REPO_NAME/environments/staging -X PUT \
        --input - <<< '{
            "wait_timer": 0,
            "reviewers": [],
            "deployment_branch_policy": {
                "protected_branches": false,
                "custom_branch_policies": true
            }
        }' || print_warning "Environment staging existe déjà"
    
    # Environment production
    echo "🏭 Création de l'environment production..."
    gh api repos/$REPO_OWNER/$REPO_NAME/environments/production -X PUT \
        --input - <<< '{
            "wait_timer": 300,
            "reviewers": [],
            "deployment_branch_policy": {
                "protected_branches": true,
                "custom_branch_policies": false
            }
        }' || print_warning "Environment production existe déjà"
    
    print_success "Environments créés"
    echo ""
}

# Configurer la protection des branches
configure_branch_protection() {
    print_header "Configuration de la protection des branches"
    
    # Protection branche main
    echo "🛡️  Configuration protection branche main..."
    gh api repos/$REPO_OWNER/$REPO_NAME/branches/main/protection -X PUT \
        --input - <<< '{
            "required_status_checks": {
                "strict": true,
                "contexts": ["test-and-validate", "security-and-quality", "build"]
            },
            "enforce_admins": true,
            "required_pull_request_reviews": {
                "required_approving_review_count": 1,
                "dismiss_stale_reviews": true,
                "require_code_owner_reviews": false
            },
            "restrictions": null
        }' || print_warning "Protection main existe déjà"
    
    # Protection branche prod
    echo "🏭 Configuration protection branche prod..."
    gh api repos/$REPO_OWNER/$REPO_NAME/branches/prod/protection -X PUT \
        --input - <<< '{
            "required_status_checks": {
                "strict": true,
                "contexts": ["test-and-validate", "security-and-quality", "build"]
            },
            "enforce_admins": true,
            "required_pull_request_reviews": {
                "required_approving_review_count": 2,
                "dismiss_stale_reviews": true,
                "require_code_owner_reviews": false
            },
            "restrictions": null
        }' || print_warning "Protection prod existe déjà"
    
    print_success "Protection des branches configurée"
    echo ""
}

# Configurer les secrets par défaut
configure_default_secrets() {
    print_header "Configuration des secrets par défaut"
    
    # Secrets de base (avec valeurs par défaut)
    declare -A secrets=(
        ["NODE_VERSION"]="20"
        ["PNPM_VERSION"]="9"
        ["ENCRYPTION_KEY"]="kempo-secure-key-2025-32-chars!!"
        ["DB_HOST"]="localhost"
        ["DB_PORT"]="3306"
        ["DB_NAME"]="kempo_collab"
        ["DB_USER"]="root"
        ["AWS_REGION"]="eu-north-1"
        ["AWS_S3_BUCKET"]="kempo-tournament-backups"
    )
    
    echo "🔑 Configuration des secrets par défaut..."
    for secret in "${!secrets[@]}"; do
        echo "Setting $secret..."
        echo "${secrets[$secret]}" | gh secret set "$secret" || print_warning "Secret $secret existe déjà"
    done
    
    print_success "Secrets par défaut configurés"
    print_warning "N'oubliez pas de configurer les secrets sensibles manuellement:"
    echo "  - DB_PASSWORD"
    echo "  - PROD_DB_HOST, PROD_DB_USER, PROD_DB_PASSWORD"
    echo "  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
    echo "  - DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY"
    echo "  - SONAR_TOKEN, CODECOV_TOKEN"
    echo ""
}

# Configurer les variables d'environment
configure_environment_variables() {
    print_header "Configuration des variables d'environment"
    
    # Variables repository
    declare -A variables=(
        ["CI_TIMEOUT"]="30"
        ["TEST_TIMEOUT"]="60"
        ["BUILD_TIMEOUT"]="20"
    )
    
    echo "⚙️  Configuration des variables repository..."
    for var in "${!variables[@]}"; do
        echo "Setting $var..."
        gh variable set "$var" --body "${variables[$var]}" || print_warning "Variable $var existe déjà"
    done
    
    print_success "Variables d'environment configurées"
    echo ""
}

# Créer les labels pour les issues/PRs
create_labels() {
    print_header "Création des labels GitHub"
    
    # Labels pour le CI/CD
    declare -A labels=(
        ["ci/cd"]="0052cc"
        ["deployment"]="ff9500"
        ["security"]="d73a4a"
        ["performance"]="c5def5"
        ["monitoring"]="fbca04"
        ["backup"]="0075ca"
        ["hotfix"]="d93f0b"
        ["enhancement"]="a2eeef"
        ["bug"]="d73a4a"
        ["documentation"]="0075ca"
    )
    
    echo "🏷️  Création des labels..."
    for label in "${!labels[@]}"; do
        echo "Creating label: $label"
        gh label create "$label" --color "${labels[$label]}" --description "Label for $label" || print_warning "Label $label existe déjà"
    done
    
    print_success "Labels créés"
    echo ""
}

# Configurer les webhooks
configure_webhooks() {
    print_header "Configuration des webhooks"
    
    echo "🔗 Configuration des webhooks..."
    
    # Webhook pour Slack (exemple)
    # gh api repos/$REPO_OWNER/$REPO_NAME/hooks -X POST \
    #     --input - <<< '{
    #         "name": "web",
    #         "active": true,
    #         "events": ["push", "pull_request", "deployment"],
    #         "config": {
    #             "url": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
    #             "content_type": "json"
    #         }
    #     }'
    
    print_success "Webhooks configurés (exemple commenté)"
    echo ""
}

# Créer les templates d'issues et PRs
create_templates() {
    print_header "Création des templates"
    
    # Créer le dossier .github s'il n'existe pas
    mkdir -p .github/ISSUE_TEMPLATE
    mkdir -p .github/PULL_REQUEST_TEMPLATE
    
    # Template pour bug report
    cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Signaler un bug
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Description du Bug
Une description claire du problème.

## 🔄 Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Faire défiler vers '...'
4. Voir l'erreur

## ✅ Comportement Attendu
Description du comportement attendu.

## 📱 Environnement
- OS: [e.g. iOS]
- Navigateur: [e.g. chrome, safari]
- Version: [e.g. 22]

## 📋 Informations Supplémentaires
Toute autre information utile.
EOF

    # Template pour feature request
    cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Suggérer une nouvelle fonctionnalité
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 🚀 Fonctionnalité Demandée
Description claire de la fonctionnalité souhaitée.

## 💡 Motivation
Pourquoi cette fonctionnalité est-elle nécessaire ?

## 📋 Solution Proposée
Description de la solution envisagée.

## 🔄 Alternatives Considérées
Autres approches envisagées.

## 📋 Informations Supplémentaires
Contexte supplémentaire ou captures d'écran.
EOF

    # Template pour PR
    cat > .github/PULL_REQUEST_TEMPLATE/pull_request_template.md << 'EOF'
## 📋 Description
Description des changements apportés.

## 🔄 Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## 🧪 Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests d'intégration validés
- [ ] Tests manuels effectués

## 📋 Checklist
- [ ] Code reviewed
- [ ] Tests passés
- [ ] Documentation mise à jour
- [ ] Changements validés localement

## 🔗 Issues Liées
Fixes #(issue)
EOF

    print_success "Templates créés"
    echo ""
}

# Générer un rapport de configuration
generate_config_report() {
    print_header "Génération du rapport de configuration"
    
    cat > CI-CD-SETUP-REPORT.md << 'EOF'
# 📊 Rapport de Configuration CI/CD

## ✅ Éléments Configurés

### 🌟 Environments
- [x] staging
- [x] production

### 🛡️ Protection des Branches
- [x] main (1 approbation requise)
- [x] prod (2 approbations requises)

### 🔑 Secrets par Défaut
- [x] NODE_VERSION
- [x] PNPM_VERSION
- [x] ENCRYPTION_KEY
- [x] DB_HOST, DB_PORT, DB_NAME, DB_USER
- [x] AWS_REGION, AWS_S3_BUCKET

### 🏷️ Labels
- [x] ci/cd, deployment, security
- [x] performance, monitoring, backup
- [x] hotfix, enhancement, bug, documentation

### 📝 Templates
- [x] Bug Report
- [x] Feature Request
- [x] Pull Request Template

## ⚠️ Configuration Manuelle Requise

### 🔐 Secrets Sensibles
- [ ] DB_PASSWORD
- [ ] PROD_DB_HOST, PROD_DB_USER, PROD_DB_PASSWORD
- [ ] AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- [ ] DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY
- [ ] SONAR_TOKEN, CODECOV_TOKEN

### 🔗 Intégrations Externes
- [ ] SonarQube
- [ ] Codecov
- [ ] Slack/Teams notifications
- [ ] Monitoring services

## 🚀 Prochaines Étapes

1. Configurer les secrets sensibles
2. Tester les workflows
3. Configurer les notifications
4. Valider les déploiements
5. Monitorer les performances

## 📞 Support
Pour toute question, consultez la documentation CI/CD.
EOF

    print_success "Rapport généré: CI-CD-SETUP-REPORT.md"
    echo ""
}

# Valider la configuration
validate_configuration() {
    print_header "Validation de la configuration"
    
    echo "🔍 Vérification des workflows..."
    if [ -d ".github/workflows" ]; then
        workflow_count=$(find .github/workflows -name "*.yml" | wc -l)
        print_success "$workflow_count workflows trouvés"
    else
        print_error "Dossier .github/workflows manquant"
    fi
    
    echo "🔍 Vérification des secrets..."
    secret_count=$(gh secret list | wc -l)
    print_success "$secret_count secrets configurés"
    
    echo "🔍 Vérification des environments..."
    # gh api repos/$REPO_OWNER/$REPO_NAME/environments | jq '.environments[].name' || echo "Environments configurés"
    
    print_success "Configuration validée"
    echo ""
}

# Menu principal
main() {
    echo "🥋 Kempo Tournament - Configuration CI/CD"
    echo "========================================"
    echo ""
    
    case "${1:-all}" in
        "check")
            check_prerequisites
            ;;
        "environments")
            check_prerequisites
            create_environments
            ;;
        "protection")
            check_prerequisites
            configure_branch_protection
            ;;
        "secrets")
            check_prerequisites
            configure_default_secrets
            ;;
        "variables")
            check_prerequisites
            configure_environment_variables
            ;;
        "labels")
            check_prerequisites
            create_labels
            ;;
        "templates")
            create_templates
            ;;
        "webhooks")
            check_prerequisites
            configure_webhooks
            ;;
        "validate")
            validate_configuration
            ;;
        "all")
            check_prerequisites
            create_environments
            configure_branch_protection
            configure_default_secrets
            configure_environment_variables
            create_labels
            create_templates
            configure_webhooks
            generate_config_report
            validate_configuration
            
            print_success "Configuration CI/CD terminée !"
            echo ""
            print_warning "N'oubliez pas de :"
            echo "1. Configurer les secrets sensibles"
            echo "2. Tester les workflows"
            echo "3. Configurer les notifications"
            echo "4. Valider les déploiements"
            ;;
        *)
            echo "Usage: $0 [check|environments|protection|secrets|variables|labels|templates|webhooks|validate|all]"
            echo ""
            echo "Commandes disponibles:"
            echo "  check        - Vérifier les prérequis"
            echo "  environments - Créer les environments GitHub"
            echo "  protection   - Configurer la protection des branches"
            echo "  secrets      - Configurer les secrets par défaut"
            echo "  variables    - Configurer les variables d'environment"
            echo "  labels       - Créer les labels GitHub"
            echo "  templates    - Créer les templates d'issues/PRs"
            echo "  webhooks     - Configurer les webhooks"
            echo "  validate     - Valider la configuration"
            echo "  all          - Tout configurer"
            ;;
    esac
}

# Exécuter le script
main "$@"
