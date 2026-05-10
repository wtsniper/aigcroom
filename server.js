const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

// ============================================
// 数据库（JSON 文件存储）
// ============================================
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('DB load error:', e.message);
  }
  return { users: [], tools: [], reviews: [], subscriptions: [], affiliateLinks: [], solutions: [] };
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let db = loadDB();

// 创建默认管理员账户
if (!db.users.find(u => u.email === 'admin@aigcroom.com')) {
  db.users.push({
    id: crypto.randomUUID(),
    name: 'Admin',
    email: 'admin@aigcroom.com',
    password: hashPassword('admin123'),
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  });
  saveDB(db);
  console.log('默认管理员已创建: admin@aigcroom.com / admin123');
}

// ============================================
// 工具函数
// ============================================
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'aigcroom_salt').digest('hex');
}

function generateToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const signature = crypto.createHmac('sha256', 'aigcroom_secret').update(JSON.stringify(payload)).digest('hex');
  return Buffer.from(JSON.stringify(payload) + '.' + signature).toString('base64');
}

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split('.');
    const signature = parts.pop();
    const payload = JSON.parse(parts.join('.'));
    const expectedSig = crypto.createHmac('sha256', 'aigcroom_secret').update(JSON.stringify(payload)).digest('hex');
    if (signature !== expectedSig) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function sendHTML(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function requireAuth(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;
  return verifyToken(match[1]);
}

// ============================================
// 路由处理
// ============================================
async function handleAPI(req, res, url) {
  const user = requireAuth(req);

  // 注册
  if (url === '/api/auth/register' && req.method === 'POST') {
    const body = await parseBody(req);
    if (!body.email || !body.password) return sendJSON(res, 400, { error: '邮箱和密码必填' });
    if (db.users.find(u => u.email === body.email)) return sendJSON(res, 409, { error: '用户已存在' });
    
    const newUser = {
      id: crypto.randomUUID(),
      name: body.name || body.email.split('@')[0],
      email: body.email,
      password: hashPassword(body.password),
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    db.subscriptions.push({
      id: crypto.randomUUID(),
      userId: newUser.id,
      plan: 'FREE',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    });
    saveDB(db);
    
    const token = generateToken(newUser);
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=86400`);
    return sendJSON(res, 201, { user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  }

  // 登录
  if (url === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const foundUser = db.users.find(u => u.email === body.email && u.password === hashPassword(body.password));
    if (!foundUser) return sendJSON(res, 401, { error: '邮箱或密码错误' });
    
    const token = generateToken(foundUser);
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=86400`);
    return sendJSON(res, 200, { user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role } });
  }

  // 获取当前用户
  if (url === '/api/auth/me' && req.method === 'GET') {
    if (!user) return sendJSON(res, 401, { error: '未登录' });
    const foundUser = db.users.find(u => u.id === user.id);
    if (!foundUser) return sendJSON(res, 404, { error: '用户不存在' });
    return sendJSON(res, 200, { user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role } });
  }

  // 登出
  if (url === '/api/auth/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0');
    return sendJSON(res, 200, { message: '已登出' });
  }

  // 评测管理 - 获取列表
  if (url === '/api/reviews' && req.method === 'GET') {
    return sendJSON(res, 200, { reviews: db.reviews });
  }

  // 评测管理 - 创建
  if (url === '/api/reviews' && req.method === 'POST') {
    if (!user || user.role !== 'ADMIN') return sendJSON(res, 403, { error: '无权限' });
    const body = await parseBody(req);
    const newReview = {
      id: crypto.randomUUID(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 200),
      status: body.status || 'DRAFT',
      authorId: user.id,
      authorName: user.name || 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.reviews.push(newReview);
    saveDB(db);
    return sendJSON(res, 201, { review: newReview });
  }

  // 评测管理 - 更新
  if (url.match(/^\/api\/reviews\/[^/]+$/) && req.method === 'PUT') {
    if (!user || user.role !== 'ADMIN') return sendJSON(res, 403, { error: '无权限' });
    const id = url.split('/').pop();
    const idx = db.reviews.findIndex(r => r.id === id);
    if (idx === -1) return sendJSON(res, 404, { error: '评测不存在' });
    const body = await parseBody(req);
    db.reviews[idx] = { ...db.reviews[idx], ...body, updatedAt: new Date().toISOString() };
    saveDB(db);
    return sendJSON(res, 200, { review: db.reviews[idx] });
  }

  // 评测管理 - 删除
  if (url.match(/^\/api\/reviews\/[^/]+$/) && req.method === 'DELETE') {
    if (!user || user.role !== 'ADMIN') return sendJSON(res, 403, { error: '无权限' });
    const id = url.split('/').pop();
    db.reviews = db.reviews.filter(r => r.id !== id);
    saveDB(db);
    return sendJSON(res, 200, { message: '已删除' });
  }

  // 工具管理 - 获取列表
  if (url === '/api/tools' && req.method === 'GET') {
    return sendJSON(res, 200, { tools: db.tools });
  }

  // 工具管理 - 创建
  if (url === '/api/tools' && req.method === 'POST') {
    if (!user || user.role !== 'ADMIN') return sendJSON(res, 403, { error: '无权限' });
    const body = await parseBody(req);
    const newTool = {
      id: crypto.randomUUID(),
      name: body.name,
      description: body.description,
      category: body.category || 'AI',
      pricing: body.pricing || 'FREE',
      websiteUrl: body.websiteUrl || '',
      affiliateUrl: body.affiliateUrl || '',
      rating: body.rating || 0,
      status: body.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.tools.push(newTool);
    saveDB(db);
    return sendJSON(res, 201, { tool: newTool });
  }

  // 统计数据
  if (url === '/api/stats' && req.method === 'GET') {
    if (!user || user.role !== 'ADMIN') return sendJSON(res, 403, { error: '无权限' });
    return sendJSON(res, 200, {
      users: db.users.length,
      tools: db.tools.length,
      reviews: db.reviews.length,
      subscriptions: db.subscriptions.length,
      revenue: db.subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0)
    });
  }

  return null;
}

// ============================================
// HTML 页面
// ============================================
function getHomePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIGC Room - Discover the Best AI Tools</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: #111; border-bottom: 1px solid #222; padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: #aaa; text-decoration: none; font-size: 14px; transition: color 0.2s; }
    .nav-links a:hover { color: #fff; }
    .hero { text-align: center; padding: 100px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .hero h1 { font-size: 48px; margin-bottom: 16px; }
    .hero p { font-size: 20px; opacity: 0.9; max-width: 600px; margin: 0 auto 32px; }
    .btn { display: inline-block; padding: 12px 32px; background: #fff; color: #764ba2; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: transform 0.2s; cursor: pointer; border: none; }
    .btn:hover { transform: translateY(-2px); }
    .section { padding: 80px 0; }
    .section-title { text-align: center; font-size: 32px; margin-bottom: 48px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; transition: transform 0.2s, border-color 0.2s; cursor: pointer; }
    .card:hover { transform: translateY(-4px); border-color: #667eea; }
    .card h3 { font-size: 20px; margin-bottom: 8px; }
    .card p { color: #888; font-size: 14px; line-height: 1.6; }
    .rating { color: #fbbf24; margin: 8px 0; }
    .badge { display: inline-block; padding: 4px 8px; background: #667eea33; color: #667eea; border-radius: 4px; font-size: 12px; margin-right: 8px; }
    footer { background: #111; border-top: 1px solid #222; padding: 40px 0; text-align: center; color: #666; }
    .auth-buttons { display: flex; gap: 12px; align-items: center; }
    .auth-btn { padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; cursor: pointer; border: none; }
    .login-btn { color: #aaa; background: transparent; border: 1px solid #333; }
    .register-btn { background: #667eea; color: #fff; }
    .user-info { color: #fff; font-size: 14px; }
    .logout-btn { color: #ff6b6b; background: transparent; border: 1px solid #ff6b6b; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo" onclick="location.href='/'">AIGC Room</div>
        <ul class="nav-links">
          <li><a href="/tools">AI Tools</a></li>
          <li><a href="/reviews">Reviews</a></li>
          <li><a href="/compare">Compare</a></li>
          <li><a href="/solutions">Solutions</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
        <div class="auth-buttons" id="authButtons"></div>
      </nav>
    </div>
  </header>

  <section class="hero">
    <h1>Discover the Best AI Tools</h1>
    <p>In-depth reviews, comparisons, and curated solutions to help you choose the right AI tools for your business.</p>
    <a href="/tools" class="btn">Explore AI Tools</a>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">Featured AI Tools</h2>
      <div class="grid">
        <div class="card">
          <h3>ChatGPT Plus</h3>
          <div class="rating">★★★★★ 4.9</div>
          <p>The most advanced AI chatbot with GPT-4, DALL-E image generation, and plugin support.</p>
          <div style="margin-top: 12px;">
            <span class="badge">Chatbot</span>
            <span class="badge">Writing</span>
            <span class="badge">Coding</span>
          </div>
        </div>
        <div class="card">
          <h3>Midjourney</h3>
          <div class="rating">★★★★★ 4.8</div>
          <p>State-of-the-art AI image generation tool with stunning artistic quality and style control.</p>
          <div style="margin-top: 12px;">
            <span class="badge">Image</span>
            <span class="badge">Design</span>
            <span class="badge">Art</span>
          </div>
        </div>
        <div class="card">
          <h3>Claude Pro</h3>
          <div class="rating">★★★★☆ 4.7</div>
          <p>Anthropic's powerful AI assistant with long context window and excellent reasoning capabilities.</p>
          <div style="margin-top: 12px;">
            <span class="badge">Chatbot</span>
            <span class="badge">Analysis</span>
            <span class="badge">Writing</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background: #111;">
    <div class="container">
      <h2 class="section-title">Latest Reviews</h2>
      <div class="grid" id="reviewsGrid">
        <div class="card">
          <h3>ChatGPT vs Claude: Which AI Assistant is Better in 2026?</h3>
          <div style="color: #888; font-size: 12px; margin: 8px 0;">May 10, 2026</div>
          <p>A comprehensive comparison of the two leading AI assistants across multiple dimensions.</p>
        </div>
        <div class="card">
          <h3>Top 10 AI Image Generators: Midjourney vs DALL-E vs Stable Diffusion</h3>
          <div style="color: #888; font-size: 12px; margin: 8px 0;">May 8, 2026</div>
          <p>We tested the best AI image generators to help you find the perfect tool for your needs.</p>
        </div>
        <div class="card">
          <h3>Best AI Writing Tools for Content Creators: Complete Guide</h3>
          <div style="color: #888; font-size: 12px; margin: 8px 0;">May 5, 2026</div>
          <p>Find the ideal AI writing assistant for blog posts, marketing copy, and creative writing.</p>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2026 AIGC Room. All rights reserved.</p>
    </div>
  </footer>

  <script>
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        const authDiv = document.getElementById('authButtons');
        if (data.user) {
          authDiv.innerHTML = \`
            <span class="user-info">\${data.user.name} (\${data.user.role})</span>
            \${data.user.role === 'ADMIN' ? '<a href="/admin" style="color:#667eea;font-size:14px;">管理后台</a>' : ''}
            <button class="logout-btn" onclick="logout()">登出</button>
          \`;
        } else {
          authDiv.innerHTML = \`
            <a href="/login" class="auth-btn login-btn">Login</a>
            <a href="/register" class="auth-btn register-btn">Register</a>
          \`;
        }
      } catch {
        document.getElementById('authButtons').innerHTML = \`
          <a href="/login" class="auth-btn login-btn">Login</a>
          <a href="/register" class="auth-btn register-btn">Register</a>
        \`;
      }
    }

    async function logout() {
      await fetch('/api/auth/logout', { method: 'POST' });
      location.reload();
    }

    checkAuth();
  </script>
</body>
</html>`;
}

function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - AIGC Room</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-box { background: #111; border: 1px solid #222; border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; }
    h1 { text-align: center; margin-bottom: 24px; font-size: 24px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 8px; font-size: 14px; color: #aaa; }
    input { width: 100%; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; }
    input:focus { outline: none; border-color: #667eea; }
    .btn { width: 100%; padding: 12px; background: #667eea; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn:hover { background: #5568d3; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { background: #ff000022; color: #ff6b6b; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .link { text-align: center; margin-top: 16px; font-size: 14px; color: #aaa; }
    .link a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>Login to AIGC Room</h1>
    <div id="error"></div>
    <form id="loginForm">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn" id="submitBtn">Login</button>
    </form>
    <div class="link">Don't have an account? <a href="/register">Sign up</a></div>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const errorDiv = document.getElementById('error');
      btn.disabled = true;
      btn.textContent = 'Logging in...';
      errorDiv.innerHTML = '';
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          })
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/';
        } else {
          errorDiv.innerHTML = '<div class="error">' + data.error + '</div>';
        }
      } catch (err) {
        errorDiv.innerHTML = '<div class="error">Network error</div>';
      }
      btn.disabled = false;
      btn.textContent = 'Login';
    });
  </script>
</body>
</html>`;
}

function getRegisterPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register - AIGC Room</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .register-box { background: #111; border: 1px solid #222; border-radius: 12px; padding: 40px; width: 100%; max-width: 400px; }
    h1 { text-align: center; margin-bottom: 24px; font-size: 24px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 8px; font-size: 14px; color: #aaa; }
    input { width: 100%; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; }
    input:focus { outline: none; border-color: #667eea; }
    .btn { width: 100%; padding: 12px; background: #667eea; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn:hover { background: #5568d3; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .error { background: #ff000022; color: #ff6b6b; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .success { background: #00ff0022; color: #6bffa1; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .link { text-align: center; margin-top: 16px; font-size: 14px; color: #aaa; }
    .link a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="register-box">
    <h1>Create Account</h1>
    <div id="message"></div>
    <form id="registerForm">
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="name" placeholder="Your name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="email" placeholder="you@example.com" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="password" placeholder="At least 6 characters" required minlength="6">
      </div>
      <button type="submit" class="btn" id="submitBtn">Register</button>
    </form>
    <div class="link">Already have an account? <a href="/login">Login</a></div>
  </div>
  <script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const msgDiv = document.getElementById('message');
      btn.disabled = true;
      btn.textContent = 'Registering...';
      msgDiv.innerHTML = '';
      
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          })
        });
        const data = await res.json();
        if (res.ok) {
          msgDiv.innerHTML = '<div class="success">Registration successful! Redirecting...</div>';
          setTimeout(() => window.location.href = '/', 1000);
        } else {
          msgDiv.innerHTML = '<div class="error">' + data.error + '</div>';
        }
      } catch (err) {
        msgDiv.innerHTML = '<div class="error">Network error</div>';
      }
      btn.disabled = false;
      btn.textContent = 'Register';
    });
  </script>
</body>
</html>`;
}

function getAdminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - AIGC Room</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #111; border-right: 1px solid #222; padding: 20px 0; }
    .sidebar-title { padding: 0 20px 20px; font-size: 18px; font-weight: bold; color: #667eea; }
    .sidebar-menu { list-style: none; }
    .sidebar-menu li a { display: block; padding: 12px 20px; color: #aaa; text-decoration: none; font-size: 14px; transition: all 0.2s; }
    .sidebar-menu li a:hover, .sidebar-menu li a.active { background: #667eea22; color: #667eea; }
    .main { flex: 1; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .header h1 { font-size: 24px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; }
    .stat-card h3 { font-size: 14px; color: #888; margin-bottom: 8px; }
    .stat-card .value { font-size: 32px; font-weight: bold; }
    .card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 18px; margin-bottom: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #aaa; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 12px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 14px; }
    .form-group textarea { min-height: 150px; resize: vertical; font-family: inherit; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #667eea; }
    .btn { padding: 10px 20px; background: #667eea; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: #5568d3; }
    .btn-danger { background: #ff4444; }
    .btn-danger:hover { background: #cc0000; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #222; }
    th { color: #888; font-size: 12px; font-weight: normal; }
    td { font-size: 14px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge-draft { background: #66666633; color: #888; }
    .badge-published { background: #00ff0022; color: #6bffa1; }
    .message { padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .message-success { background: #00ff0022; color: #6bffa1; }
    .message-error { background: #ff000022; color: #ff6b6b; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-title">AIGC Admin</div>
      <ul class="sidebar-menu">
        <li><a href="#" class="active" onclick="showTab('dashboard')">Dashboard</a></li>
        <li><a href="#" onclick="showTab('reviews')">Reviews</a></li>
        <li><a href="#" onclick="showTab('tools')">Tools</a></li>
        <li><a href="#" onclick="showTab('publish')">Publish Review</a></li>
        <li><a href="/">Back to Site</a></li>
      </ul>
    </aside>
    <main class="main">
      <div class="header">
        <h1 id="pageTitle">Dashboard</h1>
        <div id="userInfo"></div>
      </div>

      <div id="message"></div>

      <!-- Dashboard -->
      <div id="tab-dashboard">
        <div class="stats">
          <div class="stat-card"><h3>Total Users</h3><div class="value" id="statUsers">0</div></div>
          <div class="stat-card"><h3>Total Tools</h3><div class="value" id="statTools">0</div></div>
          <div class="stat-card"><h3>Total Reviews</h3><div class="value" id="statReviews">0</div></div>
          <div class="stat-card"><h3>Revenue</h3><div class="value" id="statRevenue">$0</div></div>
        </div>
      </div>

      <!-- Reviews List -->
      <div id="tab-reviews" class="hidden">
        <div class="card">
          <h2>All Reviews</h2>
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody id="reviewsTable"></tbody>
          </table>
        </div>
      </div>

      <!-- Tools List -->
      <div id="tab-tools" class="hidden">
        <div class="card">
          <h2>All Tools</h2>
          <table>
            <thead><tr><th>Name</th><th>Category</th><th>Pricing</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody id="toolsTable"></tbody>
          </table>
        </div>
      </div>

      <!-- Publish Review -->
      <div id="tab-publish" class="hidden">
        <div class="card">
          <h2>Publish New Review</h2>
          <form id="reviewForm">
            <div class="form-group">
              <label>Title</label>
              <input type="text" id="reviewTitle" placeholder="Review title" required>
            </div>
            <div class="form-group">
              <label>Excerpt</label>
              <input type="text" id="reviewExcerpt" placeholder="Short description">
            </div>
            <div class="form-group">
              <label>Content</label>
              <textarea id="reviewContent" placeholder="Review content (supports Markdown)" required></textarea>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select id="reviewStatus">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <button type="submit" class="btn">Publish Review</button>
          </form>
        </div>
      </div>
    </main>
  </div>

  <script>
    let currentUser = null;

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user || data.user.role !== 'ADMIN') {
          window.location.href = '/login';
          return;
        }
        currentUser = data.user;
        document.getElementById('userInfo').textContent = data.user.name;
        loadStats();
        loadReviews();
        loadTools();
      } catch {
        window.location.href = '/login';
      }
    }

    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statUsers').textContent = data.users;
        document.getElementById('statTools').textContent = data.tools;
        document.getElementById('statReviews').textContent = data.reviews;
        document.getElementById('statRevenue').textContent = '$' + data.revenue;
      } catch {}
    }

    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        const tbody = document.getElementById('reviewsTable');
        tbody.innerHTML = data.reviews.map(r => \`
          <tr>
            <td>\${r.title}</td>
            <td><span class="badge badge-\${r.status.toLowerCase()}">\${r.status}</span></td>
            <td>\${r.authorName}</td>
            <td>\${new Date(r.createdAt).toLocaleDateString()}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteReview('\${r.id}')">Delete</button></td>
          </tr>
        \`).join('');
      } catch {}
    }

    async function loadTools() {
      try {
        const res = await fetch('/api/tools');
        const data = await res.json();
        const tbody = document.getElementById('toolsTable');
        tbody.innerHTML = data.tools.map(t => \`
          <tr>
            <td>\${t.name}</td>
            <td>\${t.category}</td>
            <td>\${t.pricing}</td>
            <td>\${t.rating}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteTool('\${t.id}')">Delete</button></td>
          </tr>
        \`).join('') || '<tr><td colspan="5">No tools yet</td></tr>';
      } catch {}
    }

    async function deleteReview(id) {
      if (!confirm('Delete this review?')) return;
      await fetch('/api/reviews/' + id, { method: 'DELETE' });
      loadReviews();
      loadStats();
    }

    async function deleteTool(id) {
      if (!confirm('Delete this tool?')) return;
      await fetch('/api/tools/' + id, { method: 'DELETE' });
      loadTools();
      loadStats();
    }

    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: document.getElementById('reviewTitle').value,
          excerpt: document.getElementById('reviewExcerpt').value,
          content: document.getElementById('reviewContent').value,
          status: document.getElementById('reviewStatus').value
        })
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('Review published!', 'success');
        document.getElementById('reviewForm').reset();
        loadReviews();
        loadStats();
      } else {
        showMessage(data.error, 'error');
      }
    });

    function showMessage(msg, type) {
      const div = document.getElementById('message');
      div.innerHTML = '<div class="message message-' + type + '">' + msg + '</div>';
      setTimeout(() => div.innerHTML = '', 3000);
    }

    function showTab(tab) {
      document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
      document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('pageTitle').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
    }

    checkAuth();
  </script>
</body>
</html>`;
}

function getPricingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing - AIGC Room</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header { background: #111; border-bottom: 1px solid #222; padding: 16px 0; }
    nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; }
    .nav-links { display: flex; gap: 24px; list-style: none; }
    .nav-links a { color: #aaa; text-decoration: none; font-size: 14px; }
    .hero { text-align: center; padding: 80px 20px; }
    .hero h1 { font-size: 40px; margin-bottom: 16px; }
    .hero p { color: #888; font-size: 18px; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 40px 0 80px; }
    .pricing-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 32px; text-align: center; transition: transform 0.2s; }
    .pricing-card:hover { transform: translateY(-4px); }
    .pricing-card.popular { border-color: #667eea; }
    .pricing-card h3 { font-size: 20px; margin-bottom: 8px; }
    .price { font-size: 48px; font-weight: bold; margin: 16px 0; }
    .price span { font-size: 16px; color: #888; }
    .features { list-style: none; margin: 24px 0; text-align: left; }
    .features li { padding: 8px 0; color: #aaa; font-size: 14px; }
    .features li::before { content: "✓ "; color: #6bffa1; }
    .btn { display: inline-block; padding: 12px 32px; background: #667eea; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; width: 100%; }
    .btn:hover { background: #5568d3; }
    footer { background: #111; border-top: 1px solid #222; padding: 40px 0; text-align: center; color: #666; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <nav>
        <div class="logo" onclick="location.href='/'">AIGC Room</div>
        <ul class="nav-links">
          <li><a href="/tools">AI Tools</a></li>
          <li><a href="/reviews">Reviews</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <div class="hero">
    <h1>Simple, Transparent Pricing</h1>
    <p>Choose the plan that works best for you</p>
  </div>
  <div class="container">
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3>Free</h3>
        <div class="price">$0<span>/month</span></div>
        <ul class="features">
          <li>Access to basic reviews</li>
          <li>Compare up to 3 tools</li>
          <li>Community support</li>
        </ul>
        <button class="btn">Get Started</button>
      </div>
      <div class="pricing-card popular">
        <h3>Pro</h3>
        <div class="price">$19<span>/month</span></div>
        <ul class="features">
          <li>All Free features</li>
          <li>Unlimited tool comparisons</li>
          <li>Exclusive in-depth reviews</li>
          <li>Priority support</li>
          <li>Early access to new content</li>
        </ul>
        <button class="btn" onclick="alert('Payment integration coming soon!')">Subscribe Pro</button>
      </div>
      <div class="pricing-card">
        <h3>Premium</h3>
        <div class="price">$49<span>/month</span></div>
        <ul class="features">
          <li>All Pro features</li>
          <li>1-on-1 consultation</li>
          <li>Custom tool recommendations</li>
          <li>API access</li>
          <li>White-label reports</li>
        </ul>
        <button class="btn" onclick="alert('Payment integration coming soon!')">Subscribe Premium</button>
      </div>
    </div>
  </div>
  <footer>
    <div class="container">
      <p>&copy; 2026 AIGC Room. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

// ============================================
// 主服务器
// ============================================
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`).pathname;
  console.log(`${req.method} ${url}`);

  // API 路由
  const apiResult = await handleAPI(req, res, url);
  if (apiResult) return;

  // 页面路由
  switch (url) {
    case '/':
    case '/index.html':
      return sendHTML(res, 200, getHomePage());
    case '/login':
      return sendHTML(res, 200, getLoginPage());
    case '/register':
      return sendHTML(res, 200, getRegisterPage());
    case '/admin':
      return sendHTML(res, 200, getAdminPage());
    case '/pricing':
      return sendHTML(res, 200, getPricingPage());
    case '/tools':
      return sendHTML(res, 200, getHomePage().replace('<section class="hero">', '<section class="hero" style="display:none"><section class="section" style="padding-top:40px">'));
    case '/reviews':
      return sendHTML(res, 200, getHomePage().replace('<section class="hero">', '<section class="hero" style="display:none"><section class="section" style="padding-top:40px">'));
    case '/compare':
      return sendHTML(res, 200, '<html><body style="background:#0a0a0a;color:#fff;text-align:center;padding:100px"><h1>Compare Page - Coming Soon</h1><a href="/" style="color:#667eea">Back to Home</a></body></html>');
    case '/solutions':
      return sendHTML(res, 200, '<html><body style="background:#0a0a0a;color:#fff;text-align:center;padding:100px"><h1>Solutions Page - Coming Soon</h1><a href="/" style="color:#667eea">Back to Home</a></body></html>');
    default:
      return sendHTML(res, 404, '<html><body style="background:#0a0a0a;color:#fff;text-align:center;padding:100px"><h1>404 - Page Not Found</h1><a href="/" style="color:#667eea">Back to Home</a></body></html>');
  }
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  AIGC Room Server`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  Admin: http://localhost:${PORT}/admin`);
  console.log(`  Default Admin: admin@aigcroom.com / admin123`);
  console.log(`========================================\n`);
});
