
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Electron app for Windows...');

try {
  // Check if electron dependencies are installed
  const electronBuilderPath = path.join(process.cwd(), 'node_modules', '.bin', 'electron-builder');
  if (!fs.existsSync(electronBuilderPath)) {
    console.log('📦 Installing Electron dependencies...');
    execSync('npm install electron electron-builder --save-dev', { stdio: 'inherit' });
  }

  // Build the web app first
  console.log('🌐 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create electron package.json if it doesn't exist
  const electronPackageJson = {
    "name": "invoice-creator-pro",
    "version": "1.0.0",
    "description": "Invoice Creator Pro Desktop Application",
    "main": "electron/main.js",
    "scripts": {
      "electron": "electron .",
      "electron-dev": "NODE_ENV=development electron .",
      "dist": "electron-builder"
    },
    "build": {
      "appId": "com.invoice-creator-pro.app",
      "productName": "Invoice Creator Pro",
      "directories": {
        "output": "dist-electron"
      },
      "files": [
        "dist/**/*",
        "electron/**/*",
        "node_modules/**/*"
      ],
      "win": {
        "target": "nsis",
        "icon": "public/favicon.ico"
      },
      "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true
      }
    }
  };

  fs.writeFileSync('electron-package.json', JSON.stringify(electronPackageJson, null, 2));

  // Build the electron app
  console.log('⚡ Building Electron application...');
  execSync('npx electron-builder --config electron-package.json', { stdio: 'inherit' });

  console.log('✅ Electron build completed! Check the dist-electron folder.');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
