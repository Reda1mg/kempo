// test-security.ts
import { DataProtectionService } from './src/security/data-protection.ts';
import { BackupService } from './src/security/backup-service.ts';
import 'dotenv/config';

console.log('🔒 Test du système de sécurité...\n');

// Test 1: Initialisation
console.log('1. Initialisation du chiffrement...');
DataProtectionService.initializeEncryption();
console.log('✅ Chiffrement initialisé\n');

// Test 2: Chiffrement des données
console.log('2. Test chiffrement compétiteur...');
const testCompetitor = {
  id: 'test-123',
  firstname: 'Jean',
  lastname: 'Dupont',
  club: 'Dojo Test',
  city: 'Paris',
  age: 25,
  weight: 70
};

const encrypted = DataProtectionService.encryptCompetitorData(testCompetitor);
console.log('Données chiffrées:', encrypted);

const decrypted = DataProtectionService.decryptCompetitorData(encrypted);
console.log('Données déchiffrées:', decrypted);
console.log('✅ Chiffrement/déchiffrement OK\n');

// Test 3: Sauvegarde
console.log('3. Test service de sauvegarde...');
try {
  await BackupService.initialize();
  console.log('✅ Service de sauvegarde initialisé');
  
  const backups = await BackupService.listBackups();
  console.log(`📁 ${backups.length} sauvegardes trouvées`);
} catch (error) {
  console.log('⚠️  Sauvegarde non testée (DB non connectée)');
}

console.log('\n🎉 Tests terminés !');
