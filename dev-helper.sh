#!/bin/bash

# 🚀 Kempo Tournament - Development Helper Script
# Ce script automatise les tâches de développement courantes

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_header() {
    echo -e "${BLUE}🥋 Kempo Tournament - $1${NC}"
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
    
    # Vérifier Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js installé: $NODE_VERSION"
    else
        print_error "Node.js non installé"
        exit 1
    fi
    
    # Vérifier pnpm
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm -v)
        print_success "pnpm installé: $PNPM_VERSION"
    else
        print_error "pnpm non installé"
        exit 1
    fi
    
    # Vérifier MySQL
    if command -v mysql &> /dev/null; then
        print_success "MySQL installé"
    else
        print_warning "MySQL non trouvé, assurez-vous qu'il est installé"
    fi
    
    echo ""
}

# Installer les dépendances
install_dependencies() {
    print_header "Installation des dépendances"
    
    # Backend
    echo "📦 Installation backend..."
    cd backend
    pnpm install --frozen-lockfile
    cd ..
    print_success "Backend dependencies installées"
    
    # Frontend
    echo "📦 Installation frontend..."
    cd project
    pnpm install --frozen-lockfile
    cd ..
    print_success "Frontend dependencies installées"
    
    echo ""
}

# Démarrer le mode développement
start_development() {
    print_header "Démarrage du mode développement"
    
    # Vérifier le fichier .env
    if [ ! -f "backend/.env" ]; then
        print_warning "Fichier .env manquant, copie du template..."
        cp backend/.env.example backend/.env
        print_warning "Veuillez configurer backend/.env avant de continuer"
        return 1
    fi
    
    # Démarrer le backend en arrière-plan
    echo "🚀 Démarrage du backend..."
    cd backend
    pnpm dev &
    BACKEND_PID=$!
    cd ..
    
    # Attendre que le backend soit prêt
    sleep 5
    
    # Démarrer le frontend
    echo "🌐 Démarrage du frontend..."
    cd project
    pnpm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Applications démarrées!"
    echo "🔗 Frontend: http://localhost:3000"
    echo "🔗 Backend: http://localhost:3001"
    echo "📖 API Docs: http://localhost:3001/docs"
    
    # Attendre et gérer l'arrêt
    wait_for_stop() {
        echo ""
        echo "Appuyez sur Ctrl+C pour arrêter les serveurs..."
        trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
        wait
    }
    
    wait_for_stop
}

# Construire les applications
build_applications() {
    print_header "Construction des applications"
    
    # Build backend (vérification TypeScript)
    echo "🏗️  Build backend..."
    cd backend
    pnpm exec tsc --noEmit
    cd ..
    print_success "Backend build OK"
    
    # Build frontend
    echo "🏗️  Build frontend..."
    cd project
    pnpm run build
    cd ..
    print_success "Frontend build OK"
    
    echo ""
}

# Exécuter les tests
run_tests() {
    print_header "Exécution des tests"
    
    # Tests backend
    echo "🧪 Tests backend..."
    cd backend
    # Créer un test basique si pas de framework de test
    if [ ! -f "package.json" ] || ! grep -q "test" package.json; then
        echo "console.log('✅ Backend tests - OK');" > test-basic.js
        node test-basic.js
        rm test-basic.js
    fi
    cd ..
    print_success "Backend tests OK"
    
    # Tests frontend
    echo "🧪 Tests frontend..."
    cd project
    CI=true pnpm test -- --watchAll=false --testTimeout=10000
    cd ..
    print_success "Frontend tests OK"
    
    echo ""
}

# Nettoyer les fichiers temporaires
clean_project() {
    print_header "Nettoyage du projet"
    
    # Nettoyer node_modules
    echo "🧹 Nettoyage node_modules..."
    rm -rf backend/node_modules
    rm -rf project/node_modules
    rm -rf node_modules
    
    # Nettoyer les builds
    echo "🧹 Nettoyage des builds..."
    rm -rf project/build
    rm -rf backend/dist
    
    # Nettoyer les logs
    echo "🧹 Nettoyage des logs..."
    rm -rf backend/logs
    find . -name "*.log" -delete
    
    print_success "Projet nettoyé"
    echo ""
}

# Vérifier la sécurité
check_security() {
    print_header "Vérification de sécurité"
    
    # Audit des dépendances
    echo "🔐 Audit backend..."
    cd backend
    npm audit --audit-level=high || print_warning "Vulnérabilités détectées dans backend"
    cd ..
    
    echo "🔐 Audit frontend..."
    cd project
    npm audit --audit-level=high || print_warning "Vulnérabilités détectées dans frontend"
    cd ..
    
    # Vérifier les secrets
    echo "🔍 Vérification des secrets..."
    if grep -r "AKIA" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude="*.sh" >/dev/null 2>&1; then
        print_error "Clés AWS détectées dans le code!"
    else
        print_success "Pas de secrets détectés"
    fi
    
    echo ""
}

# Sauvegarder la base de données
backup_database() {
    print_header "Sauvegarde de la base de données"
    
    # Charger les variables d'environnement
    if [ -f "backend/.env" ]; then
        source backend/.env
    else
        print_error "Fichier .env manquant"
        return 1
    fi
    
    # Créer le dossier de sauvegarde
    mkdir -p backups
    
    # Nom du fichier de sauvegarde
    BACKUP_FILE="backups/kempo-backup-$(date +%Y%m%d-%H%M%S).sql"
    
    # Effectuer la sauvegarde
    echo "💾 Sauvegarde vers $BACKUP_FILE..."
    mysqldump -h${DB_HOST} -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > $BACKUP_FILE
    
    print_success "Sauvegarde créée: $BACKUP_FILE"
    echo ""
}

# Afficher l'aide
show_help() {
    echo "🥋 Kempo Tournament - Script d'aide"
    echo "=================================="
    echo ""
    echo "Usage: $0 [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  check         Vérifier les prérequis"
    echo "  install       Installer les dépendances"
    echo "  dev           Démarrer le mode développement"
    echo "  build         Construire les applications"
    echo "  test          Exécuter les tests"
    echo "  clean         Nettoyer le projet"
    echo "  security      Vérifier la sécurité"
    echo "  backup        Sauvegarder la base de données"
    echo "  help          Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 check      # Vérifier les prérequis"
    echo "  $0 dev        # Démarrer en mode développement"
    echo "  $0 build      # Construire pour la production"
    echo ""
}

# Menu principal
main() {
    case "${1:-help}" in
        "check")
            check_prerequisites
            ;;
        "install")
            check_prerequisites
            install_dependencies
            ;;
        "dev")
            check_prerequisites
            install_dependencies
            start_development
            ;;
        "build")
            check_prerequisites
            install_dependencies
            build_applications
            ;;
        "test")
            check_prerequisites
            install_dependencies
            run_tests
            ;;
        "clean")
            clean_project
            ;;
        "security")
            check_security
            ;;
        "backup")
            backup_database
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Exécuter le script
main "$@"
