package cmd

import (
	"context"

	"github.com/samber/do/v2"
	"gorm.io/gorm"

	"github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1/catalogv1connect"

	"github.com/aihues/aiushtha/apps/aihues-api/config"
	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
	catalogsvc "github.com/aihues/aiushtha/apps/aihues-api/services/catalog"
	"github.com/aihues/aiushtha/packages/database"
)

func init() {
	registerGlobalVars()
	registerStorageServices()
	registerCatalogServices()
}

func registerGlobalVars() {
	globalCtx, cancel := context.WithCancel(context.Background())
	do.Provide(nil, func(_ do.Injector) (context.Context, error) {
		return globalCtx, nil
	})
	do.Provide(nil, func(_ do.Injector) (context.CancelFunc, error) {
		return cancel, nil
	})
}

func registerStorageServices() {
	do.Provide(nil, func(i do.Injector) (*gorm.DB, error) {
		cfg := do.MustInvoke[config.Config](i)
		pgConfig := cfg.Storage.PostgreSQL
		return database.ConnectPG(&database.Config{
			DSN:   pgConfig.DSN,
			Debug: pgConfig.TraceSQL,
		})
	})
	do.Provide(nil, func(i do.Injector) (*itemdal.DAL, error) {
		return itemdal.New(do.MustInvoke[*gorm.DB](i)), nil
	})
}

func registerCatalogServices() {
	do.Provide(nil, func(i do.Injector) (catalogv1connect.CatalogServiceHandler, error) {
		return catalogsvc.New(do.MustInvoke[*itemdal.DAL](i)), nil
	})
}
