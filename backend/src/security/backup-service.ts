// security/backup-service.ts
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class BackupService {
  private static readonly BACKUP_DIR = './backups';
  private static readonly MAX_BACKUPS = 30; // Garde 30 sauvegardes

  /**
   * Initialise le service de sauvegarde
   */
  static async initialize() {
    try {
      await fs.mkdir(this.BACKUP_DIR, { recursive: true });
      console.log('📁 Service de sauvegarde initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation sauvegarde:', error);
    }
  }

  /**
   * Crée une sauvegarde complète de la base de données
   */
  static async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(this.BACKUP_DIR, `kempo-backup-${timestamp}.sql`);
    
    try {
      const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'kempo_collab'
      };

      const command = `mysqldump -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupFile}`;
      
      await execAsync(command);
      
      console.log(`✅ Sauvegarde créée: ${backupFile}`);
      
      // Nettoyage des anciennes sauvegardes
      await this.cleanOldBackups();
      
      return backupFile;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }

  /**
   * Restaure une sauvegarde
   */
  static async restoreBackup(backupFile: string) {
    try {
      const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'kempo_collab'
      };

      const command = `mysql -h ${dbConfig.host} -P ${dbConfig.port} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < ${backupFile}`;
      
      await execAsync(command);
      
      console.log(`✅ Sauvegarde restaurée: ${backupFile}`);
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      throw error;
    }
  }

  /**
   * Liste les sauvegardes disponibles
   */
  static async listBackups() {
    try {
      const files = await fs.readdir(this.BACKUP_DIR);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort()
        .reverse(); // Plus récent en premier
    } catch (error) {
      console.error('❌ Erreur listage sauvegardes:', error);
      return [];
    }
  }

  /**
   * Supprime les anciennes sauvegardes
   */
  private static async cleanOldBackups() {
    try {
      const backups = await this.listBackups();
      
      if (backups.length > this.MAX_BACKUPS) {
        const toDelete = backups.slice(this.MAX_BACKUPS);
        
        for (const backup of toDelete) {
          const filePath = path.join(this.BACKUP_DIR, backup);
          await fs.unlink(filePath);
          console.log(`🗑️ Ancienne sauvegarde supprimée: ${backup}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur nettoyage sauvegardes:', error);
    }
  }

  /**
   * Démarre la sauvegarde automatique
   */
  static startAutomaticBackup() {
    const interval = 24 * 60 * 60 * 1000; // 24 heures
    
    setInterval(async () => {
      try {
        await this.createBackup();
      } catch (error) {
        console.error('❌ Erreur sauvegarde automatique:', error);
      }
    }, interval);
    
    console.log('🔄 Sauvegarde automatique démarrée (24h)');
  }
}
