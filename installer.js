
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 AIGC Room 安装启动器');
console.log('='.repeat(60));

const projectDir = __dirname;
const nodePath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node.exe';
const npmPath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node_modules\\npm\\bin\\npm-cli.js';
const npxPath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node_modules\\npm\\bin\\npx-cli.js';

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: projectDir,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`命令失败，代码: ${code}`));
      }
    });

    child.on('error', reject);
  });
}

function runCommandSync(cmd, args, options = {}) {
  return spawnSync(cmd, args, {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true,
    ...options
  });
}

async function main() {
  try {
    // 1. 安装依赖
    console.log('\n[1/4] 正在安装依赖...');
    console.log('   (这可能需要几分钟，请稍候)');
    const nodeModulesExists = fs.existsSync(path.join(projectDir, 'node_modules'));
    
    if (!nodeModulesExists) {
      const installResult = runCommandSync(nodePath, [npmPath, 'install']);
      if (installResult.status !== 0) {
        console.error('❌ 依赖安装失败！');
        process.exit(1);
      }
    } else {
      console.log('✅ 依赖已安装');
    }

    // 2. 初始化数据库
    console.log('\n[2/4] 正在初始化数据库...');
    try {
      runCommandSync(nodePath, [npxPath, 'prisma', 'db', 'push']);
      console.log('✅ 数据库初始化完成');
    } catch (e) {
      console.warn('⚠️ 数据库初始化可能有问题，但继续尝试...');
    }

    // 3. 生成 Prisma 客户端
    console.log('\n[3/4] 正在生成 Prisma 客户端...');
    try {
      runCommandSync(nodePath, [npxPath, 'prisma', 'generate']);
      console.log('✅ Prisma 客户端生成完成');
    } catch (e) {
      console.warn('⚠️ Prisma 生成可能有问题，但继续尝试...');
    }

    // 4. 启动开发服务器
    console.log('\n[4/4] 正在启动开发服务器...');
    console.log('\n🌐 访问地址：');
    console.log('   首页：http://localhost:3000');
    console.log('   后台：http://localhost:3000/admin');
    console.log('\n' + '='.repeat(60));
    console.log('🚀 启动中，请稍候...');
    console.log('='.repeat(60));

    // 启动 Next.js
    const nextProcess = spawn(nodePath, [npmPath, 'run', 'dev'], {
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

  } catch (err) {
    console.error('\n❌ 错误：', err.message);
    process.exit(1);
  }
}

main();
