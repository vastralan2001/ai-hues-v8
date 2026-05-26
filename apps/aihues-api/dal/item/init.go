// Package itemdal provides data access for the catalog_item table (unified tool + game).
package itemdal

import "gorm.io/gorm"

// DAL is the catalog item data access layer.
type DAL struct {
	db *gorm.DB
}

// New creates a new catalog item DAL.
func New(db *gorm.DB) *DAL {
	return &DAL{db: db}
}
