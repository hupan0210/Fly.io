const fastify = require('fastify')({ logger: false }) // 关闭冗余日志

// 🍎 苹果风格 HTML 模板
const htmlTemplate = (data) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fly.io 控制中心</title>
    <style>
        :root {
            --bg: #f5f5f7;
            --card-bg: rgba(255, 255, 255, 0.7);
            --accent: #0071e3;
            --text: #1d1d1f;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            background-color: var(--bg);
            color: var(--text);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
        }
        .card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 40px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            text-align: center;
        }
        .icon { font-size: 64px; margin-bottom: 20px; display: block; }
        h1 { font-size: 24px; font-weight: 600; margin: 10px 0; }
        p { color: #86868b; font-size: 14px; margin-bottom: 30px; }
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            text-align: left;
        }
        .stat-item {
            background: rgba(255,255,255,0.4);
            padding: 15px;
            border-radius: 16px;
        }
        .stat-label { font-size: 12px; color: #86868b; display: block; margin-bottom: 4px; }
        .stat-value { font-size: 14px; font-weight: 600; color: var(--accent); }
        .footer { margin-top: 30px; font-size: 12px; color: #aeaeb2; }
    </style>
</head>
<body>
    <div class="card">
        <span class="icon">🚀</span>
        <h1>Fly.io 节点已就绪</h1>
        <p>轻量化服务运行在新加坡机房</p>
        
        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">🖥️ 内存规格</span>
                <span class="stat-value">${data.memory_limit_mb} MB</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">⚡ 运行时</span>
                <span class="stat-value">Node.js 20</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">🌐 域名</span>
                <span class="stat-value">112583.xyz</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">🛡️ 状态</span>
                <span class="stat-value">加密传输</span>
            </div>
        </div>

        <div class="footer">
            最后更新: ${new Date().toLocaleTimeString('zh-CN')}
        </div>
    </div>
</body>
</html>
`

// 1. 首页路由：渲染 Apple Style 页面
fastify.get('/', async (request, reply) => {
  const data = {
    memory_limit_mb: process.env.FLY_VM_MEMORY_MB || '256'
  }
  reply.type('text/html').send(htmlTemplate(data))
})

// 2. 健康检查接口 (保持 JSON，方便系统探测)
fastify.get('/health', async (request, reply) => {
  return { status: "alive" }
})

const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' })
    console.log(`Server running at http://0.0.0.0:8080`)
  } catch (err) {
    process.exit(1)
  }
}
start()
