import type { FastifyInstance } from 'fastify';
import type { PaperFilter } from '@aiushtha/shared-types';

export async function paperRoutes(fastify: FastifyInstance) {
  // 获取论文列表
  fastify.get<{
    Querystring: {
      page?: string;
      pageSize?: string;
      category?: string;
      date?: string;
      search?: string;
      sortBy?: 'newest' | 'hottest' | 'ai';
    };
  }>('/', async (request, reply) => {
    const page = parseInt(request.query.page || '1', 10);
    const pageSize = parseInt(request.query.pageSize || '20', 10);
    const filter: PaperFilter = {
      category: request.query.category,
      date: request.query.date,
      search: request.query.search,
      sortBy: request.query.sortBy || 'newest',
    };

    try {
      const result = await fastify.db.getPapers(page, pageSize, filter);
      return result;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch papers' };
    }
  });

  // 获取单篇论文详情
  fastify.get<{
    Params: { id: string };
  }>('/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const paper = await fastify.db.getPaperById(id);
      if (!paper) {
        reply.status(404);
        return { error: 'Paper not found' };
      }
      return paper;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch paper' };
    }
  });

  // 获取每日论文列表 (按日期分组)
  fastify.get<{
    Params: { date: string };
    Querystring: {
      category?: string;
      page?: string;
      pageSize?: string;
    };
  }>('/daily/:date', async (request, reply) => {
    const { date } = request.params;
    const page = parseInt(request.query.page || '1', 10);
    const pageSize = parseInt(request.query.pageSize || '20', 10);

    try {
      const result = await fastify.db.getDailyPapers(
        date,
        page,
        pageSize,
        request.query.category,
      );
      return result;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch daily papers' };
    }
  });
}
