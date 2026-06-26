package config

import (
	"fmt"
	"log/slog"
)

// Config holds top-level configuration for aihues-api.
type Config struct {
	Env        string     `yaml:"env"`
	ListenAddr string     `yaml:"listen_addr"`
	LogLevel   slog.Level `yaml:"log_level"`
	Storage    Storage    `yaml:"storage"`
	Embeddings Embeddings `yaml:"embeddings"`
}

// Embeddings configures the sentence-embedding sidecar used for semantic search.
type Embeddings struct {
	URL string `yaml:"url"` // base URL of the aihues-embed sidecar
}

var DefaultConfig = Config{
	Env:        "local",
	ListenAddr: ":80",
	LogLevel:   slog.LevelInfo,
	Embeddings: Embeddings{URL: "http://127.0.0.1:8000"},
}

func (c Config) ServiceName() string {
	return fmt.Sprintf("aihues-api:%s", c.Env)
}
