// start-dev.js - 启动开发服务器
const { spawn } = require('child_process');
const path = require('path');

process.chdir(__dirname);

console.log('🚀 Starting AIGC Room development server...');

// 使用 next dev
const nextDev = spawn('node', [
  '--experimental-modules',
  '-e',
  `
    const next = require('next');
    const app = next({ dev: true });
    
    app.prepare().then(() => {
      const server = require('http').createServer(app.getRequestHandler());
      server.listen(3000, () => {
        console.log('✅ Server running on http://localhost:3000');
      });
    });
  `
], {
  stdio: 'inherit',
  env: { ...process.env }
});

nextDev.on('close', (code) => {
  console.log(`Next.js dev process exited with code ${code}`);
  process.exit(code);
});
