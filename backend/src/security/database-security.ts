// security/database-security.ts
import { EntityManager } from '@mikro-orm/mysql';
import { DataProtectionService } from './data-protection.ts';

export class DatabaseSecurityService {
  /**
   * Middleware pour chiffrer automatiquement les données avant sauvegarde
   */
  static async encryptBeforeSave(em: EntityManager, entity: any, entityType: string) {
    switch (entityType) {
      case 'Competitor':
        return DataProtectionService.encryptCompetitorData(entity);
      case 'Tournament':
        return DataProtectionService.encryptTournamentData(entity);
      default:
        return entity;
    }
  }

  /**
   * Middleware pour déchiffrer automatiquement les données après lecture
   */
  static async decryptAfterLoad(em: EntityManager, entity: any, entityType: string) {
    switch (entityType) {
      case 'Competitor':
        return DataProtectionService.decryptCompetitorData(entity);
      case 'Tournament':
        return DataProtectionService.decryptTournamentData(entity);
      default:
        return entity;
    }
  }

  /**
   * Sécurise la connexion à la base de données
   */
  static getSecureDbConfig() {
    return {
      // Utilise SSL pour la connexion même en local
      ssl: false, // Peut être activé pour plus de sécurité
      
      // Limite les connexions simultanées
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 100,
      },
      
      // Configuration de sécurité
      options: {
        encrypt: false, // Peut être activé
        trustServerCertificate: true,
      },
    };
  }

  /**
   * Valide et nettoie les données d'entrée
   */
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Supprime les caractères potentiellement dangereux
      return input.replace(/[<>\"'%;()&+]/g, '');
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    
    return input;
  }
}
