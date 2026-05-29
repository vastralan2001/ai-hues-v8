package catalogsvc

import (
	"context"
	"strings"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/timestamppb"

	catalogv1 "github.com/aihues/aiushtha/gen/go/aihues/catalog/v1"

	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
)

// ListTools returns all published tools, optionally filtered by category and keyword.
func (s *Service) ListTools(
	ctx context.Context,
	req *connect.Request[catalogv1.ListToolsRequest],
) (*connect.Response[catalogv1.ListToolsResponse], error) {
	page, err := parsePage(req.Msg.GetPageSize(), req.Msg.GetPageToken())
	if err != nil {
		return nil, err
	}
	rows, err := s.itemDAL.ListPublishedTools(ctx, itemdal.ToolListFilter{
		Category: req.Msg.GetCategory(),
		Query:    req.Msg.GetQ(),
		Page:     page.dalPage(),
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	nextPageToken := page.nextToken(len(rows))
	if nextPageToken != "" {
		rows = rows[:page.size]
	}
	tools := make([]*catalogv1.Tool, 0, len(rows))
	for _, r := range rows {
		tools = append(tools, toolToProto(r))
	}
	return connect.NewResponse(&catalogv1.ListToolsResponse{
		Tools:         tools,
		NextPageToken: nextPageToken,
	}), nil
}

// toolToProto maps a tool-kind Item to the public Tool proto message.
// Caller must ensure item.Kind == catalogv1.ItemKind_ITEM_KIND_TOOL.
func toolToProto(it *model.Item) *catalogv1.Tool {
	out := &catalogv1.Tool{
		Id:          it.ID,
		Slug:        it.Slug,
		Icon:        it.Icon,
		Name:        it.Name,
		Description: derefString(it.Description),
		Category:    it.Category,
		Status:      it.Status,
		SortOrder:   it.SortOrder,
		PriceTag:    it.PriceTag,
		ExternalUrl: it.ExternalURL,
		Tags:        splitTags(it.Tags),
		CreditCost:  it.CreditCost,
	}
	out.CreateTime, out.UpdateTime = itemTimestamps(it)
	return out
}

func itemTimestamps(it *model.Item) (*timestamppb.Timestamp, *timestamppb.Timestamp) {
	var createdAt, updatedAt *timestamppb.Timestamp
	if !it.CreatedAt.IsZero() {
		createdAt = timestamppb.New(it.CreatedAt)
	}
	if !it.UpdatedAt.IsZero() {
		updatedAt = timestamppb.New(it.UpdatedAt)
	}
	return createdAt, updatedAt
}

func derefString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

// splitTags converts a comma-separated tag string into a slice.
func splitTags(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}
