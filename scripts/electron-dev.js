
const { spawn } = require('child_process');
const { execSync } = require('child_process');

console.log('⚡ Starting Electron development mode...');

// Start the web dev server
console.log('🌐 Starting web development server...');
const webServer = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

// Wait a bit for the web server to start
setTimeout(() => {
  console.log('⚡ Starting Electron...');
  const electron = spawn('npx', ['electron', 'electron/main.js'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electron.on('close', () => {
    console.log('🛑 Electron closed, stopping web server...');
    webServer.kill();
    process.exit(0);
  });
}, 3000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('🛑 Stopping development servers...');
  webServer.kill();
  process.exit(0);
});
