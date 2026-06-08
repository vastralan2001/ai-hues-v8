// Package model defines GORM models for aihues-api.
package model

import (
	"time"

	catalogv1 "github.com/aihues/aiushtha/gen/go/aihues/catalog/v1"
	"github.com/rs/xid"
	"gorm.io/gorm"
)

// Item represents a row in catalog_item.
// kind discriminates rows between tool and game (proto enum ItemKind).
type Item struct {
	ID          string                 `gorm:"column:id;type:text;primaryKey"`
	Kind        catalogv1.ItemKind     `gorm:"column:kind;not null"`
	Slug        string                 `gorm:"column:slug;type:varchar(64);uniqueIndex:uq_catalog_item_slug;not null;comment:slug 全局唯一稳定标识"`
	Icon        string                 `gorm:"column:icon;type:varchar(16);not null"`
	Name        string                 `gorm:"column:name;type:varchar(120);not null"`
	Description *string                `gorm:"column:description;type:text"`
	Status      catalogv1.ItemStatus   `gorm:"column:status;default:2;not null"`
	SortOrder   int32                  `gorm:"column:sort_order;default:100;not null"`
	Category    catalogv1.ItemCategory `gorm:"column:category;default:0;not null"`

	// ── 新增字段 ──
	PriceTag    catalogv1.PriceTag `gorm:"column:price_tag;default:0;not null;comment:价格标签 0=未指定 1=免费 2=增值 3=付费"`
	ExternalURL string             `gorm:"column:external_url;type:text;comment:外链地址"`
	Tags        string             `gorm:"column:tags;type:text;comment:逗号分隔的关键词标签"`
	CreditCost  int32              `gorm:"column:credit_cost;default:0;not null;comment:积分消耗"`

	CreatedAt time.Time `gorm:"column:created_at;not null"`
	UpdatedAt time.Time `gorm:"column:updated_at;not null"`
}

// TableName explicitly names the table.
func (*Item) TableName() string { return "catalog_item" }

// BeforeCreate generates an xid for ID if empty.
func (i *Item) BeforeCreate(*gorm.DB) error {
	if i.ID == "" {
		i.ID = xid.New().String()
	}
	return nil
}
