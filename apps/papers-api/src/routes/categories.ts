import type { FastifyInstance } from 'fastify';

export async function categoryRoutes(fastify: FastifyInstance) {
  // 获取所有分类
  fastify.get('/', async (request, reply) => {
    try {
      const categories = await fastify.db.getCategories();
      return categories;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch categories' };
    }
  });

  // 获取分类详情
  fastify.get<{
    Params: { id: string };
  }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const category = await fastify.db.getCategoryById(id);
      if (!category) {
        reply.status(404);
        return { error: 'Category not found' };
      }
      return category;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch category' };
    }
  });

  // 获取分类下的论文数量统计
  fastify.get<{
    Params: { id: string };
    Querystring: { date?: string };
  }>('/:id/stats', async (request, reply) => {
    const { id } = request.params;
    const { date } = request.query;

    try {
      const stats = await fastify.db.getCategoryStats(id, date);
      return stats;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch category stats' };
    }
  });
}
