// 共享类型定义 - 用于 Web 前端和 Data API 服务

// ==================== 论文相关类型 ====================

export interface Paper {
  id: string;
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  primaryCategory: string;
  publishedAt: string;
  updatedAt: string;
  pdfUrl: string;
  arxivUrl: string;
  aiSummary?: string;
  aiTranslation?: string;
  score: number;
  commentCount: number;
}

export interface PaperListResponse {
  papers: Paper[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PaperFilter {
  category?: string;
  date?: string;
  search?: string;
  sortBy?: 'newest' | 'hottest' | 'ai';
}

// ==================== 分类相关类型 ====================

export interface Category {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  paperCount: number;
}

// ==================== 用户相关类型 (预留) ====================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ==================== 数据服务配置 ====================

export interface DataServiceConfig {
  port: number;
  hologres: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
}
