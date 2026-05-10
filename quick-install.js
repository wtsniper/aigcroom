
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始安装...\n');

try {
  // 删除旧的 node_modules 和 lock 文件
  console.log('📦 清理旧文件...');
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  const lockPath = path.join(__dirname, 'package-lock.json');

  if (fs.existsSync(nodeModulesPath)) {
    try {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    } catch (e) {
      // 忽略错误，继续执行
    }
  }
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
  }

  console.log('✅ 清理完成\n');

  // 安装依赖
  console.log('📥 安装依赖...');
  execSync('npm install', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  console.log('\n✅ 依赖安装完成\n');

  // 初始化数据库
  console.log('💾 初始化数据库...');
  execSync('npx prisma db push', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  console.log('\n✅ 数据库初始化完成\n');

  // 启动服务器
  console.log('🚀 启动开发服务器...\n');
  console.log('🌐 访问: http://localhost:3000');
  console.log('   后台: http://localhost:3000/admin\n');

  execSync('npm run dev', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

} catch (error) {
  console.error('\n❌ 错误:', error.message);
  console.error('请尝试手动在终端运行命令。');
}
