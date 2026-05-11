// run-next.js - 直接运行Next.js开发服务器
const path = require('path');

process.chdir(__dirname);

async function main() {
  console.log('🚀 Starting AIGC Room (Next.js)...');
  
  try {
    const { createServer } = require('http');
    const next = require('next');
    
    const dev = process.env.NODE_ENV !== 'production';
    const app = next({ dev });
    
    await app.prepare();
    
    const handle = app.getRequestHandler();
    
    const server = createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:3000`);
      handle(req, res, parsedUrl);
    });
    
    server.listen(3000, () => {
      console.log('✅ Server running on http://localhost:3000');
      console.log('📝 Admin: http://localhost:3000/admin');
      console.log('🔑 Admin: admin@aigcroom.com / admin123');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\n提示: Next.js可能未正确安装。请运行: npm install');
    process.exit(1);
  }
}

main();
