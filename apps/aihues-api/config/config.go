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
}

var DefaultConfig = Config{
	Env:        "local",
	ListenAddr: ":80",
	LogLevel:   slog.LevelInfo,
}

func (c Config) ServiceName() string {
	return fmt.Sprintf("aihues-api:%s", c.Env)
}
