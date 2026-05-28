package itemdal

import (
	"context"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
	catalogv1 "github.com/aihues/aiushtha/gen/go/aihues/catalog/v1"
)

// ToolListFilter filters tool-kind queries.
type ToolListFilter struct {
	Category catalogv1.ItemCategory // optional
	Query    string                 // optional, case-insensitive LIKE on name/desc (either lang)
	Page     PageFilter
}

// PageFilter limits a list query to one page.
type PageFilter struct {
	Limit  int
	Offset int
}

// ListPublishedTools returns published tools matching the filter, ordered by
// sort_order desc, id asc.
func (d *DAL) ListPublishedTools(ctx context.Context, f ToolListFilter) ([]*model.Item, error) {
	q := d.publishedItems(ctx, catalogv1.ItemKind_ITEM_KIND_TOOL)

	if f.Category != catalogv1.ItemCategory_ITEM_CATEGORY_UNSPECIFIED {
		q = q.Where("category = ?", f.Category)
	}
	if kw := strings.ToLower(strings.TrimSpace(f.Query)); kw != "" {
		like := "%" + kw + "%"
		q = q.Where(
			"LOWER(name) LIKE ? OR LOWER(COALESCE(description,'')) LIKE ?",
			like, like,
		)
	}

	var rows []*model.Item
	if err := applyPage(q, f.Page).Order("sort_order DESC, id ASC").Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

// ListPublishedGames returns published games ordered by sort_order desc, id asc.
func (d *DAL) ListPublishedGames(ctx context.Context, f PageFilter) ([]*model.Item, error) {
	q := d.publishedItems(ctx, catalogv1.ItemKind_ITEM_KIND_GAME)
	q = applyPage(q, f)

	var rows []*model.Item
	if err := q.Order("sort_order DESC, id ASC").Find(&rows).Error; err != nil {
		return nil, err
	}
	return rows, nil
}

func (d *DAL) publishedItems(ctx context.Context, kind catalogv1.ItemKind) *gorm.DB {
	return d.db.WithContext(ctx).
		Model(&model.Item{}).
		Where("kind = ?", kind).
		Where("status = ?", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED)
}

func applyPage(q *gorm.DB, f PageFilter) *gorm.DB {
	if f.Limit > 0 {
		q = q.Limit(f.Limit)
	}
	if f.Offset > 0 {
		q = q.Offset(f.Offset)
	}
	return q
}

// Upsert inserts or updates an item by slug. Used by seed.
func (d *DAL) Upsert(ctx context.Context, it *model.Item) error {
	return d.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "slug"}},
			DoUpdates: clause.AssignmentColumns([]string{
				"kind", "icon",
				"name", "description",
				"status", "sort_order",
				"category",
				"updated_at",
			}),
		}).
		Create(it).Error
}
