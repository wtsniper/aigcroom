const { execSync } = require('child_process');
const path = require('path');

console.log('=== AIGC Room Server Starter ===');
console.log('Installing dependencies...');

try {
  execSync('npm install --legacy-peer-deps', { 
    cwd: __dirname, 
    stdio: 'inherit' 
  });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\nStarting Next.js dev server...');
console.log('Server will be available at http://localhost:3000\n');

try {
  execSync('npx next dev', { 
    cwd: __dirname, 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Server error:', error.message);
  process.exit(1);
}
