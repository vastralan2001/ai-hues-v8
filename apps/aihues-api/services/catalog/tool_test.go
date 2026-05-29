package catalogsvc

import (
	"testing"

	catalogv1 "github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1"

	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
)

func ptr(s string) *string { return &s }

func TestToolToProto_AllFieldsMapped(t *testing.T) {
	in := &model.Item{
		ID:          "tool-xid-001",
		Kind:        catalogv1.ItemKind_ITEM_KIND_TOOL,
		Slug:        "json",
		Icon:        "📋",
		Name:        "JSON Formatter",
		Description: ptr("Format & validate JSON"),
		Category:    catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER,
		Status:      catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED,
		SortOrder:   100,
	}
	out := toolToProto(in)
	if out.GetId() != "tool-xid-001" {
		t.Errorf("id: got %q, want %q", out.GetId(), "tool-xid-001")
	}
	if out.GetSlug() != "json" {
		t.Errorf("slug: got %q, want %q", out.GetSlug(), "json")
	}
	if out.GetIcon() != "📋" {
		t.Errorf("icon: got %q", out.GetIcon())
	}
	if out.GetName() != "JSON Formatter" {
		t.Errorf("name: got %q", out.GetName())
	}
	if out.GetDescription() != "Format & validate JSON" {
		t.Errorf("description: got %q", out.GetDescription())
	}
	if out.GetCategory() != catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER {
		t.Errorf("category: got %v", out.GetCategory())
	}
	if out.GetStatus() != catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED {
		t.Errorf("status: got %v", out.GetStatus())
	}
	if out.GetSortOrder() != 100 {
		t.Errorf("sort_order: got %d", out.GetSortOrder())
	}
}

func TestToolToProto_NilDescriptionBecomesEmptyString(t *testing.T) {
	in := &model.Item{
		ID:       "tool-xid-002",
		Kind:     catalogv1.ItemKind_ITEM_KIND_TOOL,
		Slug:     "minimal",
		Icon:     "x",
		Name:     "N",
		Category: catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER,
		Status:   catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED,
	}
	out := toolToProto(in)
	if out.GetDescription() != "" {
		t.Errorf("nil description should map to empty: got %q", out.GetDescription())
	}
	if out.GetId() != "tool-xid-002" {
		t.Errorf("id: got %q", out.GetId())
	}
}
