package catalogsvc

import (
	"context"

	"connectrpc.com/connect"

	catalogv1 "github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1"

	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
)

// ListGames returns all published games.
func (s *Service) ListGames(
	ctx context.Context,
	req *connect.Request[catalogv1.ListGamesRequest],
) (*connect.Response[catalogv1.ListGamesResponse], error) {
	page, err := parsePage(req.Msg.GetPageSize(), req.Msg.GetPageToken())
	if err != nil {
		return nil, err
	}
	rows, err := s.itemDAL.ListPublishedGames(ctx, page.dalPage())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	nextPageToken := page.nextToken(len(rows))
	if nextPageToken != "" {
		rows = rows[:page.size]
	}
	games := make([]*catalogv1.Game, 0, len(rows))
	for _, r := range rows {
		games = append(games, gameToProto(r))
	}
	return connect.NewResponse(&catalogv1.ListGamesResponse{
		Games:         games,
		NextPageToken: nextPageToken,
	}), nil
}

// gameToProto maps a game-kind Item to the public Game proto message.
// Caller must ensure item.Kind == catalogv1.ItemKind_ITEM_KIND_GAME.
func gameToProto(it *model.Item) *catalogv1.Game {
	out := &catalogv1.Game{
		Id:          it.ID,
		Slug:        it.Slug,
		Icon:        it.Icon,
		Name:        it.Name,
		Description: derefString(it.Description),
		Status:      it.Status,
		SortOrder:   it.SortOrder,
	}
	out.CreateTime, out.UpdateTime = itemTimestamps(it)
	return out
}
