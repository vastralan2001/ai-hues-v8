// Package catalogsvc implements the public CatalogService (read-only catalog).
package catalogsvc

import (
	"github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1/catalogv1connect"

	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
)

var _ catalogv1connect.CatalogServiceHandler = (*Service)(nil)

// Service implements catalogv1connect.CatalogServiceHandler.
type Service struct {
	catalogv1connect.UnimplementedCatalogServiceHandler
	itemDAL *itemdal.DAL
}

// New constructs a CatalogService.
func New(d *itemdal.DAL) *Service {
	return &Service{itemDAL: d}
}
