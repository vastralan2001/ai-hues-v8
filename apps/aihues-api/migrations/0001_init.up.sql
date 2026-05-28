CREATE TABLE catalog_item (
  id            TEXT         PRIMARY KEY,                            -- xid，应用层生成（github.com/rs/xid）
  kind          INTEGER      NOT NULL,                                -- 条目类型 proto enum ItemKind: 0 unspecified / 1 tool / 2 game
  slug          VARCHAR(64)  NOT NULL,                                -- 全局唯一稳定标识，用于 URL 和外链引用
  icon          VARCHAR(16)  NOT NULL,                                -- 图标标识（emoji 或短代号）
  name          VARCHAR(120) NOT NULL,                                -- 名称
  description   TEXT         DEFAULT NULL,                            -- 描述
  status        INTEGER      NOT NULL DEFAULT 2,                      -- 状态 proto enum ItemStatus: 0 unspecified / 1 draft / 2 published / 3 archived
  sort_order    INTEGER      NOT NULL DEFAULT 100,                    -- 排序权重，倒序排列，值越大越靠前
  category      INTEGER      NOT NULL DEFAULT 0,                      -- 条目分类 proto enum ItemCategory: 0 unspecified / 1 developer / 2 utility / 3 ai-writing；game 行当前固定为 0

  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 更新时间

  CONSTRAINT uq_catalog_item_slug UNIQUE (slug)
);
