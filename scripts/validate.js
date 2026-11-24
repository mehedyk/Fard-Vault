import fs from 'fs';

const files = [
  'api/keys.js',
  'api/vault.js',
  'api/lib/db.js',
  'api/lib/auth.js',
  'scripts/migrate-from-supabase.js',
  'src/lib/crypto.js',
  'src/lib/auth-service.js',
  'src/lib/vault-service.js',
  'package.json',
  'vercel.json',
  'index.html',
  'login.html',
  'register.html',
  'vault.html',
  'test.html'
];

let allPassed = true;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.json')) {
      JSON.parse(content);
      console.log('✅ JSON Valid:', file);
    } else if (file.endsWith('.html')) {
      if (!content.includes('<!DOCTYPE html>')) throw new Error('Missing DOCTYPE');
      if (content.includes('pw-generator-fard.netlify.app')) throw new Error('Outdated password generator link present');
      if (!content.includes('https://fard-pw.netlify.app/')) throw new Error('New password generator link missing');
      if (!content.includes('/favicon.svg') && !content.includes('/favicon.ico')) throw new Error('Favicon link missing');
      console.log('✅ HTML Valid & Links Verified:', file);
    } else {
      console.log('✅ JS File Present:', file, `(${content.length} bytes)`);
    }
  } catch (err) {
    console.error('❌ Validation Error in', file, ':', err.message);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n🎉 ALL FILES PASSED VALIDATION!');
} else {
  process.exit(1);
}
