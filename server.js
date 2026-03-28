const fastify = require('fastify')({ logger: false });
const os = require('os');

// 🍎 苹果风格 HTML 模板 (升级版 2.0：含实时监控和小白指南)
const htmlTemplate = (monitorData) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fly.io 极简控制面板</title>
    <style>
        :root {
            --bg: #f5f5f7;
            --card-bg: rgba(255, 255, 255, 0.7);
            --accent: #0071e3;
            --text: #1d1d1f;
            --secondary-text: #86868b;
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
            padding: 20px;
        }
        .container {
            width: 90%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.3);
            text-align: center;
        }
        .icon { font-size: 48px; margin-bottom: 10px; display: block; }
        h1 { font-size: 20px; font-weight: 600; margin: 0; }
        .subtitle { color: var(--secondary-text); font-size: 12px; margin-bottom: 20px; }

        /* 监控图表样式 */
        .monitor-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .monitor-item {
            background: rgba(255,255,255,0.4);
            padding: 20px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .stat-label { font-size: 12px; color: var(--secondary-text); margin-bottom: 10px; }
        
        /* 圆环进度条 */
        .progress-ring {
            position: relative;
            width: 80px;
            height: 80px;
        }
        .progress-ring__circle {
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            stroke: var(--accent);
            fill: none;
            stroke-dasharray: 226.2; /* 2 * PI * 36 */
            stroke-dashoffset: ${226.2 * (1 - monitorData.cpuUsage / 100)}; /* 初始值 */
            transition: stroke-dashoffset 0.35s;
        }
        .mem-circle {
             stroke: #34c759; /* 绿色 */
             stroke-dashoffset: ${226.2 * (1 - monitorData.memUsage / 100)};
        }
        .progress-value {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
            font-weight: 600;
        }

        /* 部署指南样式 */
        .guide-card { text-align: left; }
        .guide-title { font-size: 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .guide-content { display: none; margin-top: 15px; font-size: 13px; line-height: 1.6; color: #424245; }
        .guide-content.show { display: block; }
        code { background: rgba(0,0,0,0.05); padding: 2px 5px; border-radius: 4px; font-family: Menlo, monospace; font-size: 12px; }
        .step { margin-bottom: 10px; border-left: 2px solid var(--accent); padding-left: 10px; }

    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <span class="icon">💻</span>
            <h1>Fly.io 极简控制面板</h1>
            <p class="subtitle">运行于新加坡 (sin) 机房 | 成本 $0.00/月</p>
            
            <div class="monitor-group">
                <div class="monitor-item">
                    <span class="stat-label">🖥️ CPU 使用率</span>
                    <div class="progress-ring">
                        <svg width="80" height="80">
                            <circle class="progress-ring__circle" stroke-width="8" r="36" cx="40" cy="40"/>
                        </svg>
                        <div class="progress-value">${monitorData.cpuUsage}%</div>
                    </div>
                </div>
                
                <div class="monitor-item">
                    <span class="stat-label">💾 内存占用</span>
                    <div class="progress-ring">
                        <svg width="80" height="80">
                            <circle class="progress-ring__circle mem-circle" stroke-width="8" r="36" cx="40" cy="40"/>
                        </svg>
                        <div class="progress-value">${monitorData.memUsage}%</div>
                    </div>
                    <span style="font-size: 10px; color: #aeaeb2; margin-top: 5px;">${monitorData.memUsedMB} / ${monitorData.memTotalMB} MB</span>
                </div>
            </div>

            <div style="font-size: 10px; color: #aeaeb2;">
                最后更新: ${new Date().toLocaleTimeString('zh-CN')}
                <a href="/" style="color: var(--accent); text-decoration: none; margin-left: 10px;">🔄 刷新</a>
            </div>
        </div>

        <div class="card guide-card">
            <div class="guide-title" onclick="toggleGuide()">
                <span>🐣 $0.00 快速部署指南</span>
                <span id="guide-icon">➕</span>
            </div>
            <div class="guide-content" id="guide-content">
                <div class="step"><strong>1. 创建仓库</strong>：在 GitHub 新建一个仓库。</div>
                <div class="step"><strong>2. 复制文件</strong>：将本项目根目录下的 <code>package.json</code>, <code>server.js</code>, <code>Dockerfile</code>, <code>fly.toml</code> 放入你的仓库。</div>
                <div class="step"><strong>3. 绑定 Fly.io</strong>：登录 Fly.io Dashboard，点击 "Launch from GitHub"，选择你的仓库。</div>
                <div class="step"><strong>4. 配置 Token</strong>：运行 <code>fly auth token</code> 获取密钥，存入 GitHub 仓库 Settings 的 Secrets (<code>FLY_API_TOKEN</code>)。</div>
                <div class="step"><strong>5. 自动化</strong>：在仓库新建 <code>.github/workflows/fly.yml</code> 即可实现 push 代码自动更新。</div>
                <p style="color: #aeaeb2; font-size: 11px;">*注: 域名需在 Fly.io 面板 Certificates 页绑定并通过 CNAME 解析。</p>
            </div>
        </div>
    </div>

    <script>
        function toggleGuide() {
            const content = document.getElementById('guide-content');
            const icon = document.getElementById('guide-icon');
            content.classList.toggle('show');
            icon.innerText = content.classList.contains('show') ? '➖' : '➕';
        }
    </script>
</body>
</html>
`;

// 首页：计算监控数据并渲染
fastify.get('/', async (req, reply) => {
    // 1. 计算内存
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = ((usedMem / totalMem) * 100).toFixed(1);

    // 2. 计算 CPU (简易版：获取当前负载)
    // 真正的 CPU 计算需要取两个时间点的差值，这里为了轻量采用 loadavg (1分钟负载)
    // 对于 shared-cpu-1x，loadavg / cpus 即可勉强估算
    const cpus = os.cpus().length;
    const loadAvg = os.loadavg()[0]; // 获取 1 分钟负载
    const cpuUsage = ((loadAvg / cpus) * 100).toFixed(1);

    const monitorData = {
        cpuUsage: cpuUsage > 100 ? 100 : cpuUsage, // 负载高时可能超 100
        memUsage: memUsage,
        memUsedMB: (usedMem / 1024 / 1024).toFixed(0),
        memTotalMB: (totalMem / 1024 / 1024).toFixed(0)
    };

    reply.type('text/html').send(htmlTemplate(monitorData));
});

// 健康检查
fastify.get('/health', async () => ({ status: "alive" }));

const start = async () => {
    try {
        await fastify.listen({ port: 8080, host: '0.0.0.0' });
        console.log(`Server is running.`);
    } catch (err) {
        process.exit(1);
    }
};
start();
