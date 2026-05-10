
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCli = 'C:\\nodejs\\node-v24.11.0-win-x64\\node_modules\\npm\\bin\\npm-cli.js';
const node = 'C:\\nodejs\\node-v24.11.0-win-x64\\node.exe';

console.log('Testing npm install...');
console.log('CWD:', __dirname);

const result = spawnSync(node, [npmCli, 'install'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

console.log('Exit code:', result.status);

if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('✅ node_modules exists!');
} else {
  console.log('❌ node_modules does not exist!');
}
