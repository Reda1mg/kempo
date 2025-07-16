// debug-aws-keys.ts
import 'dotenv/config';

console.log('🔍 Diagnostic des clés AWS...\n');

console.log('Configuration actuelle:');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET);

console.log('\n📋 Vérifications:');

// Vérifier Access Key ID
const accessKey = process.env.AWS_ACCESS_KEY_ID || '';
if (accessKey.startsWith('AKIA')) {
  console.log('✅ Access Key ID format OK');
} else {
  console.log('❌ Access Key ID doit commencer par AKIA');
}

// Vérifier Secret Access Key
const secretKey = process.env.AWS_SECRET_ACCESS_KEY || '';
if (secretKey === 'your-secret-key-from-iam' || secretKey.length < 20) {
  console.log('❌ Secret Access Key doit être remplacée par votre vraie clé');
} else {
  console.log('✅ Secret Access Key semble OK');
}

// Vérifier longueurs
console.log(`\n📏 Longueurs:`);
console.log(`Access Key ID: ${accessKey.length} caractères`);
console.log(`Secret Access Key: ${secretKey.length} caractères`);

if (accessKey.length !== 20) {
  console.log('⚠️  Access Key ID devrait faire 20 caractères');
}

if (secretKey.length !== 40) {
  console.log('⚠️  Secret Access Key devrait faire 40 caractères');
}
