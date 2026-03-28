# 🚀 Fly.io 极致性价比生产环境 (Hobby Plan)

本仓库用于部署和管理基于 Fly.io PaaS 平台的轻量化 Web 服务。通过优化 Docker 配置与休眠机制，实现全天候 **$0.00** 运行成本。

## 🌐 实时访问
- **生产域名**: [https://fly.112583.xyz](https://fly.112583.xyz)
- **原始域名**: [https://nlbw-test-app.fly.dev](https://nlbw-test-app.fly.dev)

## ⚙️ 核心配置 (Infrastructure as Code)
| 资源项 | 配置规格 | 计费状态 |
| :--- | :--- | :--- |
| **计算 (VM)** | `shared-cpu-1x` (1 vCPU) | 免费额度内 |
| **内存 (RAM)** | `256MB` (极致压缩) | 免费额度内 |
| **网络 (IP)** | `Shared IPv4` + `Dedicated IPv6` | **免费** |
| **自动缩放** | `auto_stop/start` (Scale to Zero) | 节省运行时长 |
| **数据中心** | `sin` (Singapore) | 亚太区低延迟 |

## 🛠️ 技术栈与优化
- **Runtime**: Node.js 20 (Alpine/Slim 镜像)
- **Framework**: Fastify (高并发、低开销)
- **SSL**: Let's Encrypt (由 Fly.io 自动续期)
- **DNS**: Cloudflare CNAME 接入 (fly.112583.xyz)
- **Memory Limit**: 启动指令强制限制 `--max-old-space-size=200`，确保系统稳定。

## 📦 部署工作流
本项目采用 **GitOps** 模式，流程如下：
1. 本地修改代码并执行 `git push`。
2. GitHub Actions 触发自动构建（Remote Builder）。
3. 自动同步至 Fly.io 新加坡集群，完成滚动更新。

---
*Powered by Fly.io & GitHub Actions*
*Last Update: 2026-03-28*
