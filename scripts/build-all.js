
const { execSync } = require('child_process');

console.log('🏗️ Building all platforms...');

try {
  // Build web version
  console.log('🌐 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build Windows executable
  console.log('💻 Building Windows application...');
  execSync('node scripts/build-electron.js', { stdio: 'inherit' });

  // Prepare Android build
  console.log('📱 Preparing Android build...');
  execSync('node scripts/build-android.js', { stdio: 'inherit' });

  console.log('✅ All builds completed successfully!');
  console.log('');
  console.log('📁 Output locations:');
  console.log('   Web: dist/');
  console.log('   Windows: dist-electron/');
  console.log('   Android: android/ (open in Android Studio)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
