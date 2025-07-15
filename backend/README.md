# Kempo Backend

## Prérequis

- Node.js (v18+)
- MySQL 8.0+
- npm ou pnpm

## Installation

### Méthode 1 : Script automatique (recommandé)

**Windows :**
```bash
setup.bat
```

**Linux/Mac :**
```bash
chmod +x setup.sh
./setup.sh
```

### Méthode 2 : Installation manuelle

1. **Configurer MySQL :**
   - Créer la base de données : `CREATE DATABASE kemp_grp;`
   - Ou exécuter : `mysql -u root -p < setup-db.sql`

2. **Configurer les variables d'environnement :**
   - Modifier `src/mikro-orm.config.ts`
   - Remplacer `YOUR_MYSQL_PASSWORD` par votre mot de passe MySQL

3. **Installer les dépendances :**
```bash
npm install
```

4. **Exécuter les migrations :**
```bash
npx mikro-orm-esm migration:up
```

5. **Exécuter les seeders :**
```bash
npx mikro-orm-esm seeder:run
```

## Démarrage

```bash
npm run dev
```

Le serveur démarre sur http://localhost:3000

## API Documentation

Une fois le serveur démarré, la documentation API est disponible sur :
http://localhost:3000/docs

## Problèmes courants

### Erreur de connexion MySQL
- Vérifier que MySQL est démarré
- Vérifier les credentials dans `mikro-orm.config.ts`
- Vérifier que la base de données `kemp_grp` existe

### Erreur de migration
- Supprimer les fichiers `.snapshot-*.json` si nécessaire
- Réexécuter : `npx mikro-orm-esm migration:create`


