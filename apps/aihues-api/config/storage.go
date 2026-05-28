package config

// Storage holds storage-related configuration.
type Storage struct {
	PostgreSQL PostgreSQL `yaml:"postgresql"`
}

// PostgreSQL connection settings.
type PostgreSQL struct {
	DSN      string `yaml:"dsn"`
	TraceSQL bool   `yaml:"trace_sql"`
}
