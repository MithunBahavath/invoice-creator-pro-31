
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Invoice Creator Pro - Quick Start');
console.log('=====================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

try {
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Setup development environment
  console.log('\n🛠️ Setting up development environment...');
  execSync('node scripts/setup-dev.js', { stdio: 'inherit' });

  // Build web version
  console.log('\n🌐 Building web version...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Setup completed successfully!\n');
  console.log('📝 What you can do now:');
  console.log('   🌐 Web: npm run dev');
  console.log('   💻 Windows: node scripts/electron-dev.js');
  console.log('   📱 Android: npx cap run android');
  console.log('   🏗️ Build all: node scripts/build-all.js\n');
  console.log('📖 For detailed instructions, see BUILD_INSTRUCTIONS.md');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Ensure Node.js 16+ is installed');
  console.log('   2. Check internet connection');
  console.log('   3. Try running: npm cache clean --force');
  console.log('   4. See BUILD_INSTRUCTIONS.md for details');
  process.exit(1);
}
