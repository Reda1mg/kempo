// test-aws-backup.ts
import { AWSBackupService } from './src/security/aws-backup-service.ts';
import 'dotenv/config';

console.log('☁️  Test du service AWS S3 Backup - Production\n');

async function testAWSBackup() {
  try {
    // Test 1: Initialisation
    console.log('1. Initialisation AWS S3...');
    await AWSBackupService.initialize();
    console.log('✅ AWS S3 initialisé\n');

    // Test 2: Test de connexion
    console.log('2. Test de connexion AWS...');
    await AWSBackupService.testAWSConnection();
    console.log('✅ Connexion AWS validée\n');

    // Test 3: Lister les sauvegardes existantes
    console.log('3. Liste des sauvegardes S3...');
    const backups = await AWSBackupService.listS3Backups();
    console.log(`📁 ${backups.length} sauvegardes trouvées sur S3:`);
    backups.forEach(backup => {
      console.log(`  - ${backup.fileName} (${backup.size} bytes) - ${backup.lastModified}`);
    });

    // Test 4: Informations de configuration
    console.log('\n4. Configuration actuelle:');
    console.log(`📦 Bucket: ${process.env.AWS_S3_BUCKET}`);
    console.log(`🌍 Région: ${process.env.AWS_REGION}`);
    console.log(`⏰ Heure: 3h00 du matin`);
    console.log(`📅 Rétention: 10 jours glissants`);
    
    console.log('\n✅ Tests AWS terminés avec succès !');
    console.log('🚀 Votre application est prête pour la sauvegarde automatique');
  } catch (error) {
    console.error('❌ Erreur lors du test AWS:', error);
    console.log('\n🔧 Vérifiez:');
    console.log('- Vos clés AWS dans le fichier .env');
    console.log('- Que le bucket S3 existe');
    console.log('- Les permissions IAM');
  }
}

testAWSBackup();
