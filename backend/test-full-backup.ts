// test-full-backup.ts
import { AWSBackupService } from './src/security/aws-backup-service.ts';
import 'dotenv/config';

console.log('🎯 Test sauvegarde complète...\n');

async function testFullBackup() {
  try {
    // Initialiser
    await AWSBackupService.initialize();
    
    // Tester une sauvegarde complète
    console.log('🔄 Création d\'une sauvegarde de test...');
    const backupFileName = await AWSBackupService.backupNow();
    
    console.log(`✅ Sauvegarde créée avec succès: ${backupFileName}`);
    
    // Lister les sauvegardes après création
    console.log('\n📁 Sauvegardes après création:');
    const backups = await AWSBackupService.listS3Backups();
    backups.forEach(backup => {
      console.log(`  - ${backup.fileName} (${backup.size} bytes) - ${backup.lastModified}`);
    });
    
    console.log('\n🎉 Test complet terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du test complet:', error);
    console.log('\n💡 Vérifiez que votre base de données MySQL est démarrée');
  }
}

testFullBackup();
