// security/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class EncryptionService {
  private static readonly ALGORITHM = 'aes-256-cbc';
  private static readonly KEY_LENGTH = 32;

  /**
   * Génère une clé de chiffrement sécurisée
   */
  static generateEncryptionKey(): string {
    return randomBytes(this.KEY_LENGTH).toString('hex');
  }

  /**
   * Chiffre les données sensibles
   */
  static encrypt(text: string, key: string): string {
    const iv = randomBytes(16);
    const keyBuffer = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    const cipher = createCipheriv(this.ALGORITHM, keyBuffer, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Déchiffre les données
   */
  static decrypt(encryptedText: string, key: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encrypted = textParts.join(':');
    const keyBuffer = Buffer.from(key.slice(0, 32).padEnd(32, '0'));
    
    const decipher = createDecipheriv(this.ALGORITHM, keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
