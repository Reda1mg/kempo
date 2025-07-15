@echo off
REM Script de setup pour le projet Kempo Backend (Windows)
REM Ce script configure la base de données et exécute les migrations

echo 🚀 Setup du projet Kempo Backend
echo =================================

REM Vérifier si MySQL est installé
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL n'est pas installé ou n'est pas dans le PATH
    pause
    exit /b 1
)

echo ✅ MySQL détecté

REM Installer les dépendances npm
echo 📦 Installation des dépendances npm...
npm install

REM Créer la base de données
echo 🗄️ Configuration de la base de données...
echo Veuillez entrer votre mot de passe MySQL root:
mysql -u root -p < setup-db.sql

REM Exécuter les migrations
echo 🔄 Exécution des migrations...
npx mikro-orm-esm migration:up

REM Exécuter les seeders
echo 🌱 Exécution des seeders...
npx mikro-orm-esm seeder:run

echo ✅ Setup terminé avec succès!
echo 💡 Vous pouvez maintenant démarrer l'application avec: npm run dev
pause
