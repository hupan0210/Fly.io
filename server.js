const fastify = require('fastify')({ logger: false });
const os = require('os');

/**
 * 🍎 苹果风格 HTML 模板 2.1
 * 包含：实时 CPU/内存圆环监控、折叠式小白指南、个人 GitHub 仓库链接
 */
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
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
            background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
            color: var(--text);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
        .card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 28px;
            padding: 35px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.12);
            border: 1px solid rgba(255,255,255,0.3);
            text-align: center;
        }
        .icon { font-size: 50px; margin-bottom: 15px; display: block; }
        h1 { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.5px; }
        .subtitle { color: var(--secondary-text); font-size: 13px; margin: 8px 0 25px 0; }

        /* 监控圆环布局 */
        .monitor-group { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .monitor-item {
            background: rgba(255,255,255,0.4);
            padding: 20px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .stat-label { font-size: 11px; font-weight: 500; color: var(--secondary-text); margin-bottom: 12px; text-transform: uppercase; }
        
        .progress-ring { position: relative; width: 80px; height: 80px; }
        .progress-ring__circle {
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            stroke: var(--accent);
            fill: none;
            stroke-dasharray: 226.2;
            stroke-dashoffset: ${226.2 * (1 - monitorData.cpuUsage / 100)};
            transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mem-circle { stroke: #34c759; stroke-dashoffset: ${226.2 * (1 - monitorData.memUsage / 100)}; }
        .progress-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; font-weight: 700; }

        /* 指南与链接 */
        .guide-card { text-align: left; padding: 25px; }
        .guide-header { cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 15px; }
        .guide-content { display: none; margin-top: 15px; font-size: 13px; color: #424245; line-height: 1.6; }
        .guide-content.show { display: block; }
        .step { margin-bottom: 8px; border-left: 3px solid var(--accent); padding-left: 12px; }
        
        .repo-link {
            display: inline-flex;
            align-items: center;
            margin-top: 20px;
            padding: 8px 16px;
            background: #1d1d1f;
            color: white;
            text-decoration: none;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .repo-link:hover { opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <span class="icon">🍎</span>
            <h1>Fly.io 极简控制面板</h1>
            <p class="subtitle">Singapore Node | 256MB RAM | $0/mo</p>
            
            <div class="monitor-group">
                <div class="monitor-item">
                    <span class="stat-label">🖥️ CPU Load</span>
                    <div class="progress-ring">
                        <svg width="80" height="80"><circle class="progress-ring__circle" stroke-width="8" r="36" cx="40" cy="40"/></svg>
                        <div class="progress-value">${monitorData.cpuUsage}%</div>
                    </div>
                </div>
                <div class="monitor-item">
                    <span class="stat-label">💾 Memory</span>
                    <div class="progress-ring">
                        <svg width="80" height="80"><circle class="progress-ring__circle mem-circle" stroke-width="8" r="36" cx="40" cy="40"/></svg>
                        <div class="progress-value">${monitorData.memUsage}%</div>
                    </div>
                    <span style="font-size: 10px; color: #86868b; margin-top: 8px;">${monitorData.memUsedMB}MB / ${monitorData.memTotalMB}MB</span>
                </div>
            </div>

            <div style="font-size: 11px; color: #aeaeb2;">
                自动更新于: ${new Date().toLocaleTimeString('zh-CN')}
            </div>
            
            <a href="https://github.com/hupan0210/Fly.io/" target="_blank" class="repo-link">
                📦 获取开源源码
            </a>
        </div>

        <div class="card guide-card">
            <div class="guide-header" onclick="toggleGuide()">
                <span>🐣 $0 成本快速部署教程</span>
                <span id="guide-icon">＋</span>
            </div>
            <div class="guide-content" id="guide-content">
                <div class="step">1. <b>Fork 仓库</b>：访问 <a href="https://github.com/hupan0210/Fly.io/" style="color:var(--accent)">hupan0210/Fly.io</a>。</div>
                <div class="step">2. <b>连接 Fly.io</b>：在 Fly 面板选择从 GitHub 导入此仓库。</div>
                <div class="step">3. <b>配置密钥</b>：将 <code>fly auth token</code> 存入 GitHub Secrets (FLY_API_TOKEN)。</div>
                <div class="step">4. <b>GitOps</b>：每次修改代码 <code>git push</code> 后页面自动更新。</div>
            </div>
        </div>
    </div>

    <script>
        function toggleGuide() {
            const content = document.getElementById('guide-content');
            const icon = document.getElementById('guide-icon');
            content.classList.toggle('show');
            icon.innerText = content.classList.contains('show') ? '－' : '＋';
        }
    </script>
</body>
</html>
`;

fastify.get('/', async (req, reply) => {
    const totalMem = os.totalmem();
    const usedMem = totalMem - os.freemem();
    const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
    
    // 轻量级 CPU 负载计算
    const cpus = os.cpus().length;
    const loadAvg = os.loadavg()[0]; 
    const cpuUsage = ((loadAvg / cpus) * 100).toFixed(1);

    const monitorData = {
        cpuUsage: cpuUsage > 100 ? 100 : cpuUsage,
        memUsage: memUsage,
        memUsedMB: (usedMem / 1024 / 1024).toFixed(0),
        memTotalMB: (totalMem / 1024 / 1024).toFixed(0)
    };

    reply.type('text/html').send(htmlTemplate(monitorData));
});

fastify.get('/health', async () => ({ status: "alive" }));

const start = async () => {
    try {
        await fastify.listen({ port: 8080, host: '0.0.0.0' });
    } catch (err) {
        process.exit(1);
    }
};
start();
