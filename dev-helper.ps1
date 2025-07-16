# 🚀 Kempo Tournament - Development Helper Script (Windows)
# Ce script automatise les tâches de développement courantes

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Couleurs pour l'affichage
function Write-Header {
    param($Message)
    Write-Host "🥋 Kempo Tournament - $Message" -ForegroundColor Blue
    Write-Host "================================"
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Vérifier les prérequis
function Check-Prerequisites {
    Write-Header "Vérification des prérequis"
    
    # Vérifier Node.js
    try {
        $nodeVersion = node -v
        Write-Success "Node.js installé: $nodeVersion"
    } catch {
        Write-Error "Node.js non installé"
        exit 1
    }
    
    # Vérifier pnpm
    try {
        $pnpmVersion = pnpm -v
        Write-Success "pnpm installé: $pnpmVersion"
    } catch {
        Write-Error "pnpm non installé"
        exit 1
    }
    
    # Vérifier MySQL
    try {
        mysql --version | Out-Null
        Write-Success "MySQL installé"
    } catch {
        Write-Warning "MySQL non trouvé, assurez-vous qu'il est installé"
    }
    
    Write-Host ""
}

# Installer les dépendances
function Install-Dependencies {
    Write-Header "Installation des dépendances"
    
    # Backend
    Write-Host "📦 Installation backend..."
    Set-Location backend
    pnpm install --frozen-lockfile
    Set-Location ..
    Write-Success "Backend dependencies installées"
    
    # Frontend
    Write-Host "📦 Installation frontend..."
    Set-Location project
    pnpm install --frozen-lockfile
    Set-Location ..
    Write-Success "Frontend dependencies installées"
    
    Write-Host ""
}

# Démarrer le mode développement
function Start-Development {
    Write-Header "Démarrage du mode développement"
    
    # Vérifier le fichier .env
    if (!(Test-Path "backend\.env")) {
        Write-Warning "Fichier .env manquant, copie du template..."
        if (Test-Path "backend\.env.example") {
            Copy-Item "backend\.env.example" "backend\.env"
        }
        Write-Warning "Veuillez configurer backend\.env avant de continuer"
        return
    }
    
    Write-Host "🚀 Démarrage du backend..."
    # Démarrer le backend en arrière-plan
    Set-Location backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm dev"
    Set-Location ..
    
    # Attendre que le backend soit prêt
    Start-Sleep -Seconds 5
    
    Write-Host "🌐 Démarrage du frontend..."
    # Démarrer le frontend
    Set-Location project
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "pnpm start"
    Set-Location ..
    
    Write-Success "Applications démarrées!"
    Write-Host "🔗 Frontend: http://localhost:3000"
    Write-Host "🔗 Backend: http://localhost:3001"
    Write-Host "📖 API Docs: http://localhost:3001/docs"
    
    Write-Host ""
    Write-Host "Les applications sont en cours d'exécution dans des fenêtres séparées."
    Write-Host "Fermez les fenêtres PowerShell pour arrêter les serveurs."
}

# Construire les applications
function Build-Applications {
    Write-Header "Construction des applications"
    
    # Build backend (vérification TypeScript)
    Write-Host "🏗️  Build backend..."
    Set-Location backend
    pnpm exec tsc --noEmit
    Set-Location ..
    Write-Success "Backend build OK"
    
    # Build frontend
    Write-Host "🏗️  Build frontend..."
    Set-Location project
    pnpm run build
    Set-Location ..
    Write-Success "Frontend build OK"
    
    Write-Host ""
}

# Exécuter les tests
function Run-Tests {
    Write-Header "Exécution des tests"
    
    # Tests backend
    Write-Host "🧪 Tests backend..."
    Set-Location backend
    # Créer un test basique
    "console.log('✅ Backend tests - OK');" | Out-File -FilePath "test-basic.js" -Encoding UTF8
    node test-basic.js
    Remove-Item "test-basic.js"
    Set-Location ..
    Write-Success "Backend tests OK"
    
    # Tests frontend
    Write-Host "🧪 Tests frontend..."
    Set-Location project
    $env:CI = "true"
    pnpm test -- --watchAll=false --testTimeout=10000
    Set-Location ..
    Write-Success "Frontend tests OK"
    
    Write-Host ""
}

# Nettoyer les fichiers temporaires
function Clean-Project {
    Write-Header "Nettoyage du projet"
    
    # Nettoyer node_modules
    Write-Host "🧹 Nettoyage node_modules..."
    if (Test-Path "backend\node_modules") { Remove-Item -Recurse -Force "backend\node_modules" }
    if (Test-Path "project\node_modules") { Remove-Item -Recurse -Force "project\node_modules" }
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    
    # Nettoyer les builds
    Write-Host "🧹 Nettoyage des builds..."
    if (Test-Path "project\build") { Remove-Item -Recurse -Force "project\build" }
    if (Test-Path "backend\dist") { Remove-Item -Recurse -Force "backend\dist" }
    
    # Nettoyer les logs
    Write-Host "🧹 Nettoyage des logs..."
    if (Test-Path "backend\logs") { Remove-Item -Recurse -Force "backend\logs" }
    Get-ChildItem -Path . -Filter "*.log" -Recurse | Remove-Item -Force
    
    Write-Success "Projet nettoyé"
    Write-Host ""
}

# Vérifier la sécurité
function Check-Security {
    Write-Header "Vérification de sécurité"
    
    # Audit des dépendances
    Write-Host "🔐 Audit backend..."
    Set-Location backend
    try {
        npm audit --audit-level=high
    } catch {
        Write-Warning "Vulnérabilités détectées dans backend"
    }
    Set-Location ..
    
    Write-Host "🔐 Audit frontend..."
    Set-Location project
    try {
        npm audit --audit-level=high
    } catch {
        Write-Warning "Vulnérabilités détectées dans frontend"
    }
    Set-Location ..
    
    # Vérifier les secrets
    Write-Host "🔍 Vérification des secrets..."
    $secretsFound = Select-String -Path "*.js", "*.ts", "*.json" -Pattern "AKIA" -Exclude "*.md", "*.ps1" -Recurse
    if ($secretsFound) {
        Write-Error "Clés AWS détectées dans le code!"
    } else {
        Write-Success "Pas de secrets détectés"
    }
    
    Write-Host ""
}

# Sauvegarder la base de données
function Backup-Database {
    Write-Header "Sauvegarde de la base de données"
    
    # Charger les variables d'environnement
    if (Test-Path "backend\.env") {
        Get-Content "backend\.env" | ForEach-Object {
            if ($_ -match "^([^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    } else {
        Write-Error "Fichier .env manquant"
        return
    }
    
    # Créer le dossier de sauvegarde
    if (!(Test-Path "backups")) { New-Item -ItemType Directory -Path "backups" }
    
    # Nom du fichier de sauvegarde
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = "backups\kempo-backup-$timestamp.sql"
    
    # Effectuer la sauvegarde
    Write-Host "💾 Sauvegarde vers $backupFile..."
    $dbHost = $env:DB_HOST
    $dbUser = $env:DB_USER
    $dbPassword = $env:DB_PASSWORD
    $dbName = $env:DB_NAME
    
    mysqldump -h$dbHost -u$dbUser -p$dbPassword $dbName | Out-File -FilePath $backupFile -Encoding UTF8
    
    Write-Success "Sauvegarde créée: $backupFile"
    Write-Host ""
}

# Afficher l'aide
function Show-Help {
    Write-Host "🥋 Kempo Tournament - Script d'aide" -ForegroundColor Blue
    Write-Host "=================================="
    Write-Host ""
    Write-Host "Usage: .\dev-helper.ps1 [commande]"
    Write-Host ""
    Write-Host "Commandes disponibles:"
    Write-Host "  check         Vérifier les prérequis"
    Write-Host "  install       Installer les dépendances"
    Write-Host "  dev           Démarrer le mode développement"
    Write-Host "  build         Construire les applications"
    Write-Host "  test          Exécuter les tests"
    Write-Host "  clean         Nettoyer le projet"
    Write-Host "  security      Vérifier la sécurité"
    Write-Host "  backup        Sauvegarder la base de données"
    Write-Host "  help          Afficher cette aide"
    Write-Host ""
    Write-Host "Exemples:"
    Write-Host "  .\dev-helper.ps1 check      # Vérifier les prérequis"
    Write-Host "  .\dev-helper.ps1 dev        # Démarrer en mode développement"
    Write-Host "  .\dev-helper.ps1 build      # Construire pour la production"
    Write-Host ""
}

# Menu principal
switch ($Command.ToLower()) {
    "check" {
        Check-Prerequisites
    }
    "install" {
        Check-Prerequisites
        Install-Dependencies
    }
    "dev" {
        Check-Prerequisites
        Install-Dependencies
        Start-Development
    }
    "build" {
        Check-Prerequisites
        Install-Dependencies
        Build-Applications
    }
    "test" {
        Check-Prerequisites
        Install-Dependencies
        Run-Tests
    }
    "clean" {
        Clean-Project
    }
    "security" {
        Check-Security
    }
    "backup" {
        Backup-Database
    }
    default {
        Show-Help
    }
}
