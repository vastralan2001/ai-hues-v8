import type { FastifyInstance } from 'fastify';
import pg from 'pg';
import type {
  Paper,
  PaperListResponse,
  PaperFilter,
  Category,
} from '@aiushtha/shared-types';

const { Pool } = pg;

// 扩展 FastifyInstance 类型
declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseService;
  }
}

export class DatabaseService {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.HOLOGRES_HOST,
      port: parseInt(process.env.HOLOGRES_PORT || '80', 10),
      database: process.env.HOLOGRES_DATABASE,
      user: process.env.HOLOGRES_USER,
      password: process.env.HOLOGRES_PASSWORD,
      ssl: process.env.HOLOGRES_SSL === 'true',
    });
  }

  // 获取论文列表
  async getPapers(
    page: number,
    pageSize: number,
    filter: PaperFilter,
  ): Promise<PaperListResponse> {
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filter.category) {
      params.push(filter.category);
      conditions.push(`$${params.length} = ANY(categories)`);
    }

    if (filter.date) {
      params.push(filter.date);
      conditions.push(`DATE(published_at) = $${params.length}`);
    }

    if (filter.search) {
      params.push(`%${filter.search}%`);
      conditions.push(
        `(title ILIKE $${params.length} OR abstract ILIKE $${params.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 排序
    let orderBy = 'published_at DESC';
    if (filter.sortBy === 'hottest') {
      orderBy = 'score DESC, published_at DESC';
    } else if (filter.sortBy === 'ai') {
      orderBy = 'ai_summary IS NOT NULL DESC, score DESC';
    }

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM papers ${whereClause}`;
    const countResult = await this.pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // 查询数据
    const query = `
      SELECT
        id,
        arxiv_id as "arxivId",
        title,
        authors,
        abstract,
        categories,
        primary_category as "primaryCategory",
        published_at as "publishedAt",
        updated_at as "updatedAt",
        pdf_url as "pdfUrl",
        arxiv_url as "arxivUrl",
        ai_summary as "aiSummary",
        ai_translation as "aiTranslation",
        score,
        comment_count as "commentCount"
      FROM papers
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const result = await this.pool.query(query, [...params, pageSize, offset]);

    return {
      papers: result.rows,
      total,
      page,
      pageSize,
      hasMore: offset + result.rows.length < total,
    };
  }

  // 获取单篇论文
  async getPaperById(id: string): Promise<Paper | null> {
    const query = `
      SELECT
        id,
        arxiv_id as "arxivId",
        title,
        authors,
        abstract,
        categories,
        primary_category as "primaryCategory",
        published_at as "publishedAt",
        updated_at as "updatedAt",
        pdf_url as "pdfUrl",
        arxiv_url as "arxivUrl",
        ai_summary as "aiSummary",
        ai_translation as "aiTranslation",
        score,
        comment_count as "commentCount"
      FROM papers
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // 获取每日论文
  async getDailyPapers(
    date: string,
    page: number,
    pageSize: number,
    category?: string,
  ): Promise<PaperListResponse> {
    return this.getPapers(page, pageSize, {
      date,
      category,
      sortBy: 'newest',
    });
  }

  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    const query = `
      SELECT
        id,
        code,
        name,
        description,
        parent_id as "parentId",
        paper_count as "paperCount"
      FROM categories
      ORDER BY paper_count DESC
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  // 获取分类详情
  async getCategoryById(id: string): Promise<Category | null> {
    const query = `
      SELECT
        id,
        code,
        name,
        description,
        parent_id as "parentId",
        paper_count as "paperCount"
      FROM categories
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // 获取分类统计
  async getCategoryStats(id: string, date?: string) {
    const params: (string | number)[] = [id];
    let dateFilter = '';

    if (date) {
      params.push(date);
      dateFilter = `AND DATE(published_at) = $${params.length}`;
    }

    const query = `
      SELECT
        c.id,
        c.name,
        COUNT(p.id) as count,
        MAX(p.published_at) as last_published
      FROM categories c
      LEFT JOIN papers p ON $1 = ANY(p.categories) ${dateFilter}
      WHERE c.id = $1
      GROUP BY c.id, c.name
    `;

    const result = await this.pool.query(query, params);
    return result.rows[0] || null;
  }
}

// 注册数据库服务到 Fastify
export async function setupDatabase(fastify: FastifyInstance) {
  const db = new DatabaseService();
  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await db['pool'].end();
  });
}
