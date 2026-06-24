// Package catalogsvc implements the public CatalogService (read-only catalog).
package catalogsvc

import (
	"context"
	"log/slog"

	"github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1/catalogv1connect"

	"github.com/aihues/aiushtha/apps/aihues-api/search"

	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
)

var _ catalogv1connect.CatalogServiceHandler = (*Service)(nil)

// Service implements catalogv1connect.CatalogServiceHandler.
type Service struct {
	catalogv1connect.UnimplementedCatalogServiceHandler
	itemDAL *itemdal.DAL
	engine  *search.Engine
}

// New constructs a CatalogService. When engine is non-nil, the semantic index
// is built in the background from the catalog so search is ready shortly after
// startup (and rebuilt is a no-op if the embed sidecar is unavailable).
func New(d *itemdal.DAL, engine *search.Engine) *Service {
	s := &Service{itemDAL: d, engine: engine}
	if engine != nil {
		go s.warmIndex(context.Background())
	}
	return s
}

func (s *Service) warmIndex(ctx context.Context) {
	docs, err := s.buildCorpus(ctx)
	if err != nil {
		slog.Warn("search corpus build failed", "error", err)
		return
	}
	if err := s.engine.Build(ctx, docs); err != nil {
		slog.Warn("search index build failed (embed sidecar?)", "error", err)
		return
	}
	slog.Info("search index built", "docs", len(docs))
}
