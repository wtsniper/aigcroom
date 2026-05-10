
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 AIGC Room 启动程序');
console.log('='.repeat(50));

const projectDir = __dirname;

// 1. 检查 node_modules
console.log('\n[1/4] 检查依赖...');
const nodeModulesPath = path.join(projectDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('⚠️ node_modules 不存在，正在安装依赖...');
  try {
    console.log('⏳ 安装中，请稍候...');
    execSync('npm install', { 
      cwd: projectDir, 
      stdio: 'inherit',
      shell: true 
    });
    console.log('✅ 依赖安装完成！');
  } catch (e) {
    console.error('❌ 依赖安装失败！', e.message);
    process.exit(1);
  }
} else {
  console.log('✅ 依赖已安装');
}

// 2. 检查数据库
console.log('\n[2/4] 初始化数据库...');
const dbPath = path.join(projectDir, 'prisma', 'dev.db');
try {
  execSync('npx prisma db push', { 
    cwd: projectDir, 
    stdio: 'inherit',
    shell: true 
  });
  console.log('✅ 数据库初始化完成！');
} catch (e) {
  console.warn('⚠️ 数据库推送可能有问题，但继续尝试...');
}

// 3. 生成 Prisma 客户端
console.log('\n[3/4] 生成 Prisma 客户端...');
try {
  execSync('npx prisma generate', { 
    cwd: projectDir, 
    stdio: 'inherit',
    shell: true 
  });
  console.log('✅ Prisma 客户端生成完成！');
} catch (e) {
  console.warn('⚠️ Prisma 生成可能有问题，但继续尝试...');
}

// 4. 启动开发服务器
console.log('\n[4/4] 启动开发服务器...');
console.log('\n🌐 访问地址：');
console.log('   首页：http://localhost:3000');
console.log('   后台：http://localhost:3000/admin');
console.log('\n' + '='.repeat(50));

const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: projectDir,
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (err) => {
  console.error('❌ 启动失败：', err);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`\n👋 服务器已退出，代码：${code}`);
  process.exit(code || 0);
});
