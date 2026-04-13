import Fastify from 'fastify';
import cors from '@fastify/cors';
import { paperRoutes } from './routes/papers.js';
import { categoryRoutes } from './routes/categories.js';
import { setupDatabase } from './db/index.js';

const fastify = Fastify({
  logger: true,
});

// 注册插件
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
});

// 注册数据库连接
await setupDatabase(fastify);

// 注册路由
await fastify.register(paperRoutes, { prefix: '/api/papers' });
await fastify.register(categoryRoutes, { prefix: '/api/categories' });

// 健康检查
fastify.get('/health', async () => {
  return { status: 'ok', service: 'data-api' };
});

// 启动服务
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

try {
  await fastify.listen({ port: PORT, host: HOST });
  fastify.log.info(`Data API server listening on ${HOST}:${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
