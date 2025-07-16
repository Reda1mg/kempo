// security/data-protection.ts
import { EncryptionService } from './encryption.ts';

export class DataProtectionService {
  private static encryptionKey: string;

  /**
   * Initialise la clé de chiffrement (à faire au démarrage)
   */
  static initializeEncryption() {
    // En production, stockez cette clé dans un fichier sécurisé
    this.encryptionKey = process.env.ENCRYPTION_KEY || EncryptionService.generateEncryptionKey();
  }

  /**
   * Chiffre les données sensibles des compétiteurs
   */
  static encryptCompetitorData(competitor: any) {
    return {
      ...competitor,
      firstname: EncryptionService.encrypt(competitor.firstname, this.encryptionKey),
      lastname: EncryptionService.encrypt(competitor.lastname, this.encryptionKey),
      club: competitor.club ? EncryptionService.encrypt(competitor.club, this.encryptionKey) : null,
      city: competitor.city ? EncryptionService.encrypt(competitor.city, this.encryptionKey) : null,
    };
  }

  /**
   * Déchiffre les données des compétiteurs
   */
  static decryptCompetitorData(competitor: any) {
    return {
      ...competitor,
      firstname: EncryptionService.decrypt(competitor.firstname, this.encryptionKey),
      lastname: EncryptionService.decrypt(competitor.lastname, this.encryptionKey),
      club: competitor.club ? EncryptionService.decrypt(competitor.club, this.encryptionKey) : null,
      city: competitor.city ? EncryptionService.decrypt(competitor.city, this.encryptionKey) : null,
    };
  }

  /**
   * Chiffre les données sensibles des tournois
   */
  static encryptTournamentData(tournament: any) {
    return {
      ...tournament,
      name: EncryptionService.encrypt(tournament.name, this.encryptionKey),
      city: tournament.city ? EncryptionService.encrypt(tournament.city, this.encryptionKey) : null,
    };
  }

  /**
   * Déchiffre les données des tournois
   */
  static decryptTournamentData(tournament: any) {
    return {
      ...tournament,
      name: EncryptionService.decrypt(tournament.name, this.encryptionKey),
      city: tournament.city ? EncryptionService.decrypt(tournament.city, this.encryptionKey) : null,
    };
  }
}
