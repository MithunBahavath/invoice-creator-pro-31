
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up development environment...');

try {
  // Install Electron dependencies
  console.log('📦 Installing Electron dependencies...');
  execSync('npm install electron electron-builder --save-dev', { stdio: 'inherit' });

  // Check if Capacitor dependencies are already installed
  const capacitorCorePath = './node_modules/@capacitor/core';
  if (!fs.existsSync(capacitorCorePath)) {
    console.log('📱 Installing Capacitor dependencies...');
    execSync('npm install @capacitor/core @capacitor/cli @capacitor/android', { stdio: 'inherit' });
  }

  // Initialize Capacitor if not already done
  const capacitorConfigPath = './capacitor.config.ts';
  if (fs.existsSync(capacitorConfigPath)) {
    console.log('📱 Capacitor already configured');
  } else {
    console.log('📱 Initializing Capacitor...');
    execSync('npx cap init', { stdio: 'inherit' });
  }

  console.log('✅ Development environment setup complete!');
  console.log('');
  console.log('📝 Available commands:');
  console.log('   npm run dev - Start web development server');
  console.log('   node scripts/electron-dev.js - Start Electron development');
  console.log('   node scripts/build-electron.js - Build Windows executable');
  console.log('   node scripts/build-android.js - Prepare Android build');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
