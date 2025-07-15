# Kempo Tournament Management System

## Description
Application de gestion de tournois de Kempo avec système de bracket, télécommande administrative et scoreboard en temps réel.

## Architecture
- **Frontend**: React.js avec CSS Modules
- **Backend**: Node.js avec Hono framework
- **Database**: PostgreSQL avec MikroORM
- **Synchronisation**: LocalStorage + Events pour communication temps réel

## Fonctionnalités
- ✅ Gestion des compétiteurs et catégories
- ✅ Système de bracket horizontal avec design moderne
- ✅ Télécommande administrative intégrée
- ✅ Scoreboard dynamique synchronisé
- ✅ Gestion des scores, fautes (keikuka) et timer
- ✅ Communication cross-tab en temps réel
- ✅ Page Support avec intégration Jira Service Desk

## Structure du projet
```
kempo-main/
├── backend/           # API Node.js + Hono
├── project/           # Frontend React
└── mock-server.js     # Serveur de test
```

## Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd project
npm install
npm start
```

### Serveur Mock (pour développement)
```bash
node mock-server.js
```

## Ports
- Frontend: http://localhost:3002
- Backend: http://localhost:8000 (ou 3001)
- Mock Server: http://localhost:8000

## Version
Version actuelle: v1.1.0-support-page
- Télécommande fonctionnelle
- Synchronisation temps réel
- Design moderne et responsive
- Page Support avec intégration Jira Service Desk
