package catalogsvc

import (
	"testing"

	catalogv1 "github.com/aihues/aiushtha/gen/go/aihues/catalog/v1"

	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
)

func TestGameToProto_BasicFieldsMapped(t *testing.T) {
	in := &model.Item{
		ID:          "game-xid-001",
		Kind:        catalogv1.ItemKind_ITEM_KIND_GAME,
		Slug:        "daily-luck",
		Icon:        "📅",
		Name:        "Daily Fortune",
		Description: ptr("Draw your daily fortune"),
		Status:      catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED,
		SortOrder:   100,
	}
	out := gameToProto(in)
	if out.GetId() != "game-xid-001" {
		t.Errorf("id: got %q", out.GetId())
	}
	if out.GetSlug() != "daily-luck" {
		t.Errorf("slug: %q", out.GetSlug())
	}
	if out.GetName() != "Daily Fortune" {
		t.Errorf("name: got %q", out.GetName())
	}
	if out.GetDescription() != "Draw your daily fortune" {
		t.Errorf("description: got %q", out.GetDescription())
	}
	if out.GetStatus() != catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED {
		t.Errorf("status: got %v", out.GetStatus())
	}
	if out.GetSortOrder() != 100 {
		t.Errorf("sort_order: got %d", out.GetSortOrder())
	}
}
