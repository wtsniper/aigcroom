const http = require('http')

const BASE_URL = 'http://localhost:3000'

const tests = [
  { name: '首页', path: '/', method: 'GET' },
  { name: '工具列表页', path: '/tools', method: 'GET' },
  { name: '评测列表页', path: '/reviews', method: 'GET' },
  { name: '解决方案页', path: '/solutions', method: 'GET' },
  { name: '对比页', path: '/compare', method: 'GET' },
  { name: '定价页', path: '/pricing', method: 'GET' },
  { name: '登录页', path: '/login', method: 'GET' },
  { name: '注册页', path: '/register', method: 'GET' },
  { name: '管理后台', path: '/admin', method: 'GET' },
  { name: 'API: 工具列表', path: '/api/tools', method: 'GET' },
  { name: 'API: 评测列表', path: '/api/reviews', method: 'GET' },
  { name: 'API: 解决方案', path: '/api/solutions', method: 'GET' },
  { name: 'API: 联盟链接', path: '/api/affiliate', method: 'GET' },
  { name: 'API: 数据分析', path: '/api/analytics', method: 'GET' },
  { name: 'API: 用户登录', path: '/api/auth/login', method: 'POST', body: { email: 'admin@aigcroom.com', password: 'admin123' } },
  { name: 'API: 用户注册', path: '/api/auth/register', method: 'POST', body: { name: 'Test User 3', email: `test${Date.now()}@test.com`, password: 'test123' } },
]

function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusMessage: res.statusMessage,
          data: data.substring(0, 500),
        })
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    if (test.body) {
      req.write(JSON.stringify(test.body))
    }
    req.end()
  })
}

async function runTests() {
  console.log('========================================')
  console.log('       AIGC Room 全面测试报告')
  console.log('========================================\n')

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      const result = await makeRequest(test)
      const status = result.status >= 200 && result.status < 400 ? '✅ 通过' : '❌ 失败'
      if (result.status >= 200 && result.status < 400) {
        passed++
      } else {
        failed++
      }
      console.log(`${status} | ${test.name}`)
      console.log(`       状态码: ${result.status} ${result.statusMessage}`)
      if (result.status >= 400) {
        console.log(`       响应: ${result.data.substring(0, 200)}`)
      }
      console.log()
    } catch (error) {
      failed++
      console.log(`❌ 失败 | ${test.name}`)
      console.log(`       错误: ${error.message}`)
      console.log()
    }
  }

  console.log('========================================')
  console.log(`测试结果: ${passed} 通过, ${failed} 失败, 共 ${tests.length} 项`)
  console.log('========================================')
}

runTests().catch(console.error)
