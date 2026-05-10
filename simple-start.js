
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 AIGC Room - 简单启动');
console.log('='.repeat(60));

const projectDir = __dirname;
const nodePath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node.exe';
const nextBin = path.join(projectDir, 'node_modules', '.bin', 'next.cmd');
const nextJs = path.join(projectDir, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log('\n[1/2] 检查文件...');
console.log('   Next.js bin:', nextJs);

if (fs.existsSync(nextJs)) {
  console.log('   ✅ Next.js 已安装');
} else {
  console.log('   ⚠️ Next.js 可能没完全安装，但继续尝试...');
}

console.log('\n[2/2] 启动开发服务器...');
console.log('\n🌐 访问地址：');
console.log('   首页：http://localhost:3000');
console.log('   后台：http://localhost:3000/admin');
console.log('\n' + '='.repeat(60));

const options = {
  cwd: projectDir,
  stdio: 'inherit',
  shell: true
};

let server;

if (fs.existsSync(nextJs)) {
  server = spawn(nodePath, [nextJs, 'dev'], options);
} else if (fs.existsSync(nextBin)) {
  server = spawn(nextBin, ['dev'], options);
} else {
  console.log('❌ 找不到 Next.js！请先运行 npm install');
  process.exit(1);
}

server.on('error', (err) => {
  console.error('❌ 启动失败：', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`\n👋 服务器已退出，代码：${code}`);
  process.exit(code || 0);
});
