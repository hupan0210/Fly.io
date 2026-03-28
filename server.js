const fastify = require('fastify')({ logger: true })

// 1. 简单的首页接口，显示运行信息
fastify.get('/', async (request, reply) => {
  return { 
    status: "ok",
    message: "Welcome to Fly.io Free Machine!",
    timestamp: new Date().toISOString(),
    env: {
      node_version: process.version,
      memory_limit_mb: process.env.FLY_VM_MEMORY_MB || 'unknown'
    }
  }
})

// 2. 健康检查接口 (Fly.io 自动检测使用)
fastify.get('/health', async (request, reply) => {
  return { status: "alive" }
})

// 启动服务
const start = async () => {
  try {
    // 关键：必须监听 8080 端口和 0.0.0.0
    await fastify.listen({ port: 8080, host: '0.0.0.0' })
    fastify.log.info(`Server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
