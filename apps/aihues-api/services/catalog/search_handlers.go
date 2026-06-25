package catalogsvc

import (
	"context"
	"strings"

	"connectrpc.com/connect"

	catalogv1 "github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1"

	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
	"github.com/aihues/aiushtha/apps/aihues-api/dal/model"
	"github.com/aihues/aiushtha/apps/aihues-api/search"
)

func categoryString(cat catalogv1.ItemCategory) string {
	switch cat {
	case catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER:
		return "developer engineering code"
	case catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY:
		return "utility helper everyday"
	case catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING:
		return "ai writing content generate"
	case catalogv1.ItemCategory_ITEM_CATEGORY_IMAGE:
		return "image picture photo edit"
	default:
		return ""
	}
}

func docFromItem(it *model.Item, typ, href, extra string) search.Doc {
	text := strings.TrimSpace(it.Name + ". " + derefString(it.Description) + ". " + extra)
	return search.Doc{
		Slug:       it.Slug,
		Title:      it.Name,
		Subtitle:   typ,
		Desc:       derefString(it.Description),
		Href:       href + it.Slug,
		Type:       typ,
		Text:       text,
		SearchText: search.MakeSearchText(text),
	}
}

// staticTests mirrors the small, code-defined test corpus (no DB rows yet).
var staticTests = []search.Doc{
	{Slug: "mbti", Title: "MBTI", Subtitle: "test", Desc: "The 16-personalities test — find your four-letter type.", Href: "/tests/mbti", Type: "test", Text: "MBTI personality test 16 personalities myers briggs four letter type introvert extrovert quiz", SearchText: "mbti personality test 16 personalities myers briggs four letter type introvert extrovert quiz"},
	{Slug: "sbti", Title: "SBTI", Subtitle: "test", Desc: "A satirical soul-scan that types you as an internet archetype.", Href: "/tests/sbti", Type: "test", Text: "SBTI satirical personality test soul scan internet archetype quiz parody", SearchText: "sbti satirical personality test soul scan internet archetype quiz parody"},
}

// buildCorpus assembles the searchable corpus from the DB (tools + games) plus
// the static test entries.
func (s *Service) buildCorpus(ctx context.Context) ([]search.Doc, error) {
	tools, err := s.itemDAL.ListPublishedTools(ctx, itemdal.ToolListFilter{})
	if err != nil {
		return nil, err
	}
	games, err := s.itemDAL.ListPublishedGames(ctx, itemdal.PageFilter{})
	if err != nil {
		return nil, err
	}
	docs := make([]search.Doc, 0, len(tools)+len(games)+len(staticTests)+len(staticStories))
	for _, it := range tools {
		if it.ExternalURL != "" {
			continue
		}
		docs = append(docs, docFromItem(it, "tool", "/tools/", categoryString(it.Category)))
	}
	for _, it := range games {
		docs = append(docs, docFromItem(it, "game", "/games/", "mini game play arcade fun"))
	}
	docs = append(docs, staticTests...)
	for _, st := range staticStories {
		docs = append(docs, docFromStory(st))
	}
	return docs, nil
}

// SearchCatalog runs semantic search across the catalog.
func (s *Service) SearchCatalog(
	ctx context.Context,
	req *connect.Request[catalogv1.SearchCatalogRequest],
) (*connect.Response[catalogv1.SearchCatalogResponse], error) {
	out := &catalogv1.SearchCatalogResponse{}
	if s.engine == nil || !s.engine.Ready() {
		return connect.NewResponse(out), nil
	}
	k := int(req.Msg.GetK())
	if k <= 0 {
		k = 8
	}
	hits, err := s.engine.Search(ctx, req.Msg.GetQ(), k, 0.25)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	for _, h := range hits {
		out.Hits = append(out.Hits, &catalogv1.SearchHit{
			Slug: h.Slug, Title: h.Title, Subtitle: h.Subtitle,
			Href: h.Href, Type: h.Type, Score: h.Score,
		})
	}
	return connect.NewResponse(out), nil
}

// RelatedItems returns same-type neighbours by slug or free-text query.
func (s *Service) RelatedItems(
	ctx context.Context,
	req *connect.Request[catalogv1.RelatedItemsRequest],
) (*connect.Response[catalogv1.RelatedItemsResponse], error) {
	out := &catalogv1.RelatedItemsResponse{}
	if s.engine == nil || !s.engine.Ready() {
		return connect.NewResponse(out), nil
	}
	typ := req.Msg.GetType()
	if typ == "" {
		typ = "tool"
	}
	k := int(req.Msg.GetK())
	if k <= 0 {
		k = 6
	}
	var rel []search.Related
	if slug := req.Msg.GetSlug(); slug != "" {
		rel = s.engine.RelatedBySlug(slug, typ, k)
	} else if q := req.Msg.GetQ(); q != "" {
		var err error
		rel, err = s.engine.RelatedByQuery(ctx, q, typ, k)
		if err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
	}
	for _, r := range rel {
		out.Items = append(out.Items, &catalogv1.RelatedItem{
			Slug: r.Slug, Title: r.Title, Desc: r.Desc,
			Subtitle: r.Subtitle, Href: r.Href, Type: r.Type,
		})
	}
	return connect.NewResponse(out), nil
}
