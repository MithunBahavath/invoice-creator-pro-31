
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 Building Android APK...');

try {
  // Build the web app first
  console.log('🌐 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if Android platform is added
  const androidPath = path.join(process.cwd(), 'android');
  if (!fs.existsSync(androidPath)) {
    console.log('📦 Adding Android platform...');
    execSync('npx cap add android', { stdio: 'inherit' });
  }

  // Sync the web build with Capacitor
  console.log('🔄 Syncing with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });

  // Copy web assets
  execSync('npx cap copy android', { stdio: 'inherit' });

  console.log('✅ Android project prepared!');
  console.log('📝 To build APK:');
  console.log('   1. Open Android Studio');
  console.log('   2. Open the android/ folder');
  console.log('   3. Build > Generate Signed Bundle/APK');
  console.log('   4. Or run: cd android && ./gradlew assembleDebug');

} catch (error) {
  console.error('❌ Android build preparation failed:', error.message);
  process.exit(1);
}
