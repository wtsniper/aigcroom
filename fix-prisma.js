
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🛠️ 修复 Prisma 问题...');
console.log('='.repeat(50));

const projectDir = __dirname;
const nodePath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node.exe';
const npxPath = 'C:\\nodejs\\node-v24.11.0-win-x64\\node_modules\\npm\\bin\\npx-cli.js';

function run(cmd, args) {
  console.log(`\n▶ 执行：${cmd} ${args.join(' ')}`);
  const result = spawnSync(cmd, args, {
    cwd: projectDir,
    stdio: 'inherit',
    shell: true
  });
  return result.status === 0;
}

// 1. 确保数据库存在
console.log('\n[1/3] 初始化数据库...');
const dbPath = path.join(projectDir, 'prisma', 'dev.db');
if (!fs.existsSync(dbPath)) {
  console.log('   ⚠️ 数据库不存在，创建中...');
}
run(nodePath, [npxPath, 'prisma', 'db', 'push']);

// 2. 生成 Prisma Client
console.log('\n[2/3] 生成 Prisma Client...');
run(nodePath, [npxPath, 'prisma', 'generate']);

// 3. 检查 Prisma Client 是否生成成功
console.log('\n[3/3] 检查 Prisma Client...');
const prismaClientPath = path.join(projectDir, 'node_modules', '.prisma', 'client');
if (fs.existsSync(prismaClientPath)) {
  console.log('   ✅ Prisma Client 已生成');
} else {
  console.log('   ⚠️ Prisma Client 可能还没完全生成，但继续尝试...');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Prisma 修复完成！');
console.log('💡 现在刷新浏览器页面试试！');
