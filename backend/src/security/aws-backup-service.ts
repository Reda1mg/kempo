// security/aws-backup-service.ts
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import * as cron from 'node-cron';

const execAsync = promisify(exec);

export class AWSBackupService {
  private static s3Client: S3Client;
  private static readonly BUCKET_NAME = process.env.AWS_S3_BUCKET || 'kempo-tournament-backups-prod';
  private static readonly LOCAL_BACKUP_DIR = './backups';
  private static readonly MAX_BACKUPS = 10; // 10 jours de rétention
  private static readonly BACKUP_HOUR = 3; // 3h du matin

  /**
   * Initialise le service AWS S3
   */
  static async initialize() {
    try {
      // Configuration AWS
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION || 'eu-west-3',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      });

      // Créer le dossier local
      await fs.mkdir(this.LOCAL_BACKUP_DIR, { recursive: true });
      
      console.log('☁️  Service AWS S3 Backup initialisé');
      console.log(`📦 Bucket: ${this.BUCKET_NAME}`);
    } catch (error) {
      console.error('❌ Erreur initialisation AWS S3:', error);
      throw error;
    }
  }

  /**
   * Crée une sauvegarde locale et l'upload sur S3
   */
  static async createBackup() {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `kempo-backup-${timestamp}.sql`;
    const localBackupPath = path.join(this.LOCAL_BACKUP_DIR, backupFileName);
    
    try {
      console.log('🔄 Création sauvegarde...');
      console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`);
      
      // 1. Créer le dump MySQL local
      await this.createLocalDump(localBackupPath);
      
      // 2. Uploader sur S3
      await this.uploadToS3(localBackupPath, backupFileName);
      
      // 3. Nettoyer les anciennes sauvegardes
      await this.cleanOldBackups();
      
      const duration = (Date.now() - startTime) / 1000;
      console.log(`✅ Sauvegarde complète: ${backupFileName} (${duration}s)`);
      
      return backupFileName;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Crée un dump MySQL local
   */
  private static async createLocalDump(backupPath: string) {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'kempo_collab'
    };

    const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > "${backupPath}"`;
    
    await execAsync(command);
    console.log(`💾 Dump local créé: ${backupPath}`);
  }

  /**
   * Upload le fichier sur S3
   */
  private static async uploadToS3(filePath: string, fileName: string) {
    const fileContent = await fs.readFile(filePath);
    
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `backups/${fileName}`,
      Body: fileContent,
      ContentType: 'application/sql',
      Metadata: {
        'created-at': new Date().toISOString(),
        'source': 'kempo-tournament-system'
      }
    });

    await this.s3Client.send(command);
    console.log(`☁️  Fichier uploadé sur S3: ${fileName}`);
  }

  /**
   * Liste les sauvegardes sur S3
   */
  static async listS3Backups() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.BUCKET_NAME,
        Prefix: 'backups/',
        MaxKeys: 100
      });

      const response = await this.s3Client.send(command);
      
      return response.Contents?.map(obj => ({
        fileName: obj.Key?.split('/').pop(),
        size: obj.Size,
        lastModified: obj.LastModified
      })) || [];
    } catch (error) {
      console.error('❌ Erreur listing S3:', error);
      return [];
    }
  }

  /**
   * Nettoie les anciennes sauvegardes (local et S3)
   */
  private static async cleanOldBackups() {
    // Nettoyage local
    try {
      const localFiles = await fs.readdir(this.LOCAL_BACKUP_DIR);
      const backupFiles = localFiles
        .filter(file => file.endsWith('.sql'))
        .sort()
        .reverse();

      if (backupFiles.length > this.MAX_BACKUPS) {
        const toDelete = backupFiles.slice(this.MAX_BACKUPS);
        
        for (const file of toDelete) {
          await fs.unlink(path.join(this.LOCAL_BACKUP_DIR, file));
          console.log(`🗑️  Sauvegarde locale supprimée: ${file}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur nettoyage local:', error);
    }

    // Nettoyage S3
    try {
      const s3Backups = await this.listS3Backups();
      const sortedBackups = s3Backups
        .sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0));

      if (sortedBackups.length > this.MAX_BACKUPS) {
        const toDelete = sortedBackups.slice(this.MAX_BACKUPS);
        
        for (const backup of toDelete) {
          const command = new DeleteObjectCommand({
            Bucket: this.BUCKET_NAME,
            Key: `backups/${backup.fileName}`
          });
          
          await this.s3Client.send(command);
          console.log(`☁️🗑️  Sauvegarde S3 supprimée: ${backup.fileName}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur nettoyage S3:', error);
    }
  }

  /**
   * Démarre la sauvegarde automatique avec cron
   */
  static startAutomaticBackup() {
    // Sauvegarde toutes les 24h à 3h00
    cron.schedule('0 3 * * *', async () => {
      try {
        console.log('🕐 Démarrage sauvegarde automatique (3h00)...');
        await this.createBackup();
        console.log('✅ Sauvegarde automatique terminée');
      } catch (error) {
        console.error('❌ Erreur sauvegarde automatique:', error);
      }
    });
    
    console.log('⏰ Sauvegarde automatique programmée (3h00 chaque jour)');
    console.log('📅 Rétention: 10 jours glissants');
  }

  /**
   * Sauvegarde manuelle immédiate
   */
  static async backupNow() {
    console.log('⚡ Sauvegarde manuelle démarrée...');
    return await this.createBackup();
  }

  /**
   * Vérifie la configuration AWS et la connectivité
   */
  static async testAWSConnection() {
    try {
      console.log('🔍 Test de connexion AWS S3...');
      
      // Test de listing du bucket
      const backups = await this.listS3Backups();
      console.log(`✅ Connexion S3 OK - ${backups.length} sauvegardes trouvées`);
      
      // Test d'upload d'un fichier de test
      const testContent = `Test connexion - ${new Date().toISOString()}`;
      const testCommand = new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: 'test-connection.txt',
        Body: testContent,
        ContentType: 'text/plain'
      });
      
      await this.s3Client.send(testCommand);
      console.log('✅ Test upload S3 OK');
      
      // Supprimer le fichier de test
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: 'test-connection.txt'
      });
      
      await this.s3Client.send(deleteCommand);
      console.log('✅ Test de suppression S3 OK');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur test AWS:', error);
      throw error;
    }
  }

  /**
   * Restaure une sauvegarde depuis S3
   */
  static async restoreFromS3(fileName: string) {
    try {
      // À implémenter selon vos besoins
      console.log(`🔄 Restauration depuis S3: ${fileName}`);
      // Télécharger depuis S3 et restaurer en DB
    } catch (error) {
      console.error('❌ Erreur restauration S3:', error);
      throw error;
    }
  }
}
