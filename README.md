# 🚀 Fly.io 极致性价比控制面板 (256MB 极速部署版)

[![Fly Deploy](https://github.com/hupan0210/Fly.io/actions/workflows/fly.yml/badge.svg)](https://github.com/hupan0210/Fly.io/actions)

本项目是一个基于 **Node.js (Fastify)** 的高性能、轻量化监控面板。专为 Fly.io 的 **$0.00 Hobby Plan** 设计，通过极致的资源压缩与 GitOps 自动化，实现在 256MB 内存限制下的稳健运行。

---

## 🌐 实时访问 (Demo)
- **生产域名**: [https://fly.112583.xyz](https://fly.112583.xyz)
- **原始域名**: [https://nlbw-test-app.fly.dev](https://nlbw-test-app.fly.dev)

---

## ⚙️ 核心配置 (Infrastructure as Code)

| 资源项 | 配置规格 | 计费状态 | 说明 |
| :--- | :--- | :--- | :--- |
| **计算 (VM)** | `shared-cpu-1x` | **免费** | 100% 免费额度覆盖 |
| **内存 (RAM)** | `256MB` | **免费** | 配合指令强制限制堆内存 |
| **网络 (IP)** | `Shared IPv4` | **免费** | 共享 Anycast IP，无固定月租 |
| **自动缩放** | `Scale to Zero` | **节省时长** | 无人访问自动关机，节省额度 |
| **机房 (Region)** | `sin` (Singapore) | **低延迟** | 亚太地区最佳连接性能 |

---

## 🛠️ 技术栈与 2.0 监控特性

* **🍎 视觉方案**：Apple 风格极简设计，磨砂玻璃（Backdrop Blur）质感。
* **📊 实时监控**：利用 Node.js `os` 模块实现 **CPU 负载** 与 **内存占用** 的实时圆环图表显示，无需额外 Agent。
* **⚡ 性能优化**：采用 `node:iron-slim` 镜像，启动指令 `node --max-old-space-size=200`，杜绝 OOM。
* **🛡️ 隐藏功能**：内建反向代理接口 `/proxy?url=xxx`，可作为个人 API 中转站（需自行在代码中启用）。

---

## 📦 部署工作流 (GitOps)



1.  **代码变更**：在 GitHub 直接修改 `server.js` 或配置。
2.  **自动触发**：GitHub Actions 捕获 Push 事件，调用远程构建（Remote Builder）。
3.  **平滑更新**：新镜像部署成功后，旧机器自动下线。

---

## 🐣 小白 1 分钟快速“薅羊毛”教程

只需 4 步，你也能拥有属于自己的免费小服务器面板：

### 1. 准备仓库
在 GitHub 新建一个仓库，并将本项目根目录下的 `package.json`, `server.js`, `Dockerfile`, `fly.toml` 放入你的仓库。

### 2. 绑定令牌 (Token)
1.  在本机终端运行 `fly auth token` 复制密钥（类似 `FlyV1...`）。
2.  进入你的 GitHub 仓库 -> **Settings** -> **Secrets and variables** -> **Actions**。
3.  新建 **Repository secret**：
    * **Name**: `FLY_API_TOKEN`
    * **Value**: 粘贴你的密钥。

### 3. 配置自动流水线
在仓库新建路径 `.github/workflows/fly.yml`，粘贴本项目中的 Actions 脚本。从此，你的每一次 Push 都将自动发布。

### 4. 绑定域名 (可选)
1.  在 **Cloudflare** 解析 `CNAME` 记录到 `xxx.fly.dev`。
2.  在 Fly.io 控制面板的 **Certificates** 页面输入你的域名，系统自动申请并续期 SSL。

---

## ⚠️ 避坑与安全预警
> [!IMPORTANT]
> - **严禁点击**：面板上的 **Assign Dedicated IPv4**。Shared IPv4 是免费的，Dedicated 会产生 **$2/月** 的账单。
> - **内存锁定**：务必保持 `fly.toml` 中的 `memory_mb = 256`，这是免费层级的红线。
> - **高可用警告**：Fly 面板会提示你运行 2 台机器以保证可用性，请无视。对于个人项目，**1 台机器**配合 `min_machines_running = 0` 最具性价比。

---
*Updated: 2026-03-29 | Powered by Fly.io & Cloudflare*
