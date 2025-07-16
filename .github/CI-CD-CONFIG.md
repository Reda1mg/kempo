# 🔧 Configuration CI/CD

## Variables d'Environment GitHub

### Repository Variables
```env
NODE_VERSION=20
PNPM_VERSION=9
CI_TIMEOUT=30
TEST_TIMEOUT=60
```

### Environment Variables par Branche

#### Development (`dev`)
```env
ENVIRONMENT=development
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
DEBUG=true
```

#### Staging (`main`)
```env
ENVIRONMENT=staging
API_URL=https://staging-api.kempo-tournament.com
FRONTEND_URL=https://staging.kempo-tournament.com
DEBUG=false
```

#### Production (`prod`)
```env
ENVIRONMENT=production
API_URL=https://api.kempo-tournament.com
FRONTEND_URL=https://kempo-tournament.com
DEBUG=false
```

## Configuration SonarQube

### sonar-project.properties
```properties
sonar.projectKey=kempo-tournament
sonar.organization=your-org
sonar.sources=backend/src,project/src
sonar.tests=backend/tests,project/src/__tests__
sonar.exclusions=**/node_modules/**,**/build/**,**/dist/**
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js
sonar.javascript.lcov.reportPaths=project/coverage/lcov.info
```

## Configuration Codecov

### codecov.yml
```yaml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 1%
    patch:
      default:
        target: 70%
        threshold: 5%
```

## Protection des Branches

### Règles recommandées
- **main**: Requiert PR + 1 approbation + tests passés
- **prod**: Requiert PR + 2 approbations + tests passés + déploiement staging validé
- **dev**: Requiert tests passés uniquement

### Configuration GitHub
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "test-and-validate",
      "security-and-quality",
      "build"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null
}
```

## Configuration AWS

### IAM Policy pour CI/CD
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::kempo-tournament-backups/*",
        "arn:aws:s3:::kempo-tournament-backups"
      ]
    }
  ]
}
```

## Hooks Git

### pre-commit
```bash
#!/bin/bash
# Exécuter les tests avant chaque commit
npm run test:quick
npm run lint
```

### pre-push
```bash
#!/bin/bash
# Exécuter les tests complets avant push
npm run test:full
npm run security:check
```

## Configuration IDE

### .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "typescript.preferences.organizeImports": true
}
```

## Monitoring et Alertes

### Configuration Slack
```yaml
slack:
  webhook_url: "${{ secrets.SLACK_WEBHOOK_URL }}"
  channel: "#devops"
  username: "GitHub Actions"
  icon_emoji: ":github:"
```

### Configuration Email
```yaml
email:
  to: "team@kempo-tournament.com"
  from: "ci-cd@kempo-tournament.com"
  subject: "[${{ github.ref_name }}] Deployment Status"
```

## Scripts NPM

### Package.json (Backend)
```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "migration:generate": "mikro-orm migration:generate",
    "migration:run": "mikro-orm migration:run",
    "security:audit": "npm audit",
    "security:check": "npm audit --audit-level=high"
  }
}
```

### Package.json (Frontend)
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:ci": "CI=true react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

## Optimisations Performance

### Cache Configuration
```yaml
cache:
  paths:
    - node_modules/
    - ~/.pnpm-store/
    - build/
  key: ${{ runner.os }}-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### Parallel Jobs
```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest]
  parallel: 4
```

## Sécurité

### Secrets Rotation
- Renouveler les secrets tous les 90 jours
- Utiliser des tokens avec permissions minimales
- Monitorer les accès aux secrets

### Scan de Sécurité
```yaml
security:
  - name: "Dependency Check"
    tool: "npm audit"
    level: "high"
  - name: "Code Scanning"
    tool: "CodeQL"
    languages: ["javascript", "typescript"]
  - name: "Secret Detection"
    tool: "custom"
    patterns: ["API_KEY", "SECRET", "TOKEN"]
```

## Déploiement

### Stratégies de Déploiement
- **Blue-Green**: Déploiement sans interruption
- **Canary**: Déploiement progressif
- **Rolling**: Mise à jour progressive

### Configuration Nginx
```nginx
upstream kempo_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name kempo-tournament.com;
    
    location / {
        root /var/www/kempo-frontend;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://kempo_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Maintenance

### Tâches Récurrentes
- **Quotidien**: Tests automatiques, sauvegardes
- **Hebdomadaire**: Audit de sécurité complet
- **Mensuel**: Mise à jour des dépendances
- **Trimestriel**: Review de la configuration CI/CD

### Métriques à Surveiller
- Temps de build
- Taux de réussite des tests
- Couverture de code
- Temps de déploiement
- Disponibilité des services
