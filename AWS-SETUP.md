# 🚀 Configuration AWS S3 pour Kempo Tournament

## Étape 1 : Créer le bucket S3

1. **Accéder à S3** :
   - Dans la console AWS, cherchez "S3"
   - Cliquez sur "Create bucket"

2. **Configuration du bucket** :
   - **Nom** : `kempo-tournament-backups-prod`
   - **Région** : `Europe (Paris) eu-west-3` (recommandé)
   - **Block Public Access** : Laissez COCHÉ (sécurité)
   - **Versioning** : Activé (optionnel)
   - **Encryption** : Server-side encryption (AES-256)

3. **Cliquer sur "Create bucket"**

## Étape 2 : Créer un utilisateur IAM

1. **Accéder à IAM** :
   - Cherchez "IAM" dans la console
   - Cliquez sur "Users" → "Create user"

2. **Configuration utilisateur** :
   - **Nom** : `kempo-backup-user`
   - **Access type** : Programmatic access
   - **Permissions** : Attach existing policies directly

3. **Créer une policy personnalisée** :
   - Cliquez sur "Create policy"
   - Onglet JSON, coller le code ci-dessous :

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
        "arn:aws:s3:::kempo-tournament-backups-prod",
        "arn:aws:s3:::kempo-tournament-backups-prod/*"
      ]
    }
  ]
}
```

4. **Finaliser** :
   - Nom de la policy : `KempoBackupPolicy`
   - Attacher cette policy à l'utilisateur
   - **IMPORTANT** : Noter l'Access Key ID et Secret Access Key

## Étape 3 : Configurer le lifecycle sur le bucket

1. **Retourner sur S3** → votre bucket
2. **Onglet "Management"** → "Create lifecycle rule"
3. **Configuration** :
   - **Nom** : `kempo-backup-lifecycle`
   - **Scope** : Apply to all objects
   - **Transitions** : Aucune
   - **Expiration** : Delete objects after 10 days
   - **Delete incomplete uploads** : 1 day

## Étape 4 : Tester la connexion

Une fois les clés obtenues, les ajouter dans votre .env et tester.
