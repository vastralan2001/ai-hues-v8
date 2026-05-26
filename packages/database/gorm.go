package database

import (
	"fmt"
	"log/slog"
	"net/url"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

// Config holds the database connection configuration.
type Config struct {
	DSN   string `yaml:"dsn"`
	Debug bool   `yaml:"debug"`
}

// ConnectPG establishes a connection to PostgreSQL using the provided configuration.
func ConnectPG(config *Config) (*gorm.DB, error) {
	gormCfg := &gorm.Config{}
	if config.Debug {
		gormCfg.Logger = gormlogger.Default.LogMode(gormlogger.Info)
	}
	db, err := gorm.Open(postgres.Open(config.DSN), gormCfg)
	if err != nil {
		return nil, fmt.Errorf("connect postgres: %w", err)
	}
	slog.Info("postgres connected", "dsn", maskDSN(config.DSN))
	return db, nil
}

// maskDSN obscures the password portion of a postgres DSN for safe logging.
func maskDSN(dsn string) string {
	u, err := url.Parse(dsn)
	if err != nil {
		return dsn
	}
	if u.User != nil {
		if _, hasPassword := u.User.Password(); hasPassword {
			u.User = url.UserPassword(u.User.Username(), "***")
		}
	}
	return u.String()
}
