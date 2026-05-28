// Package cmd provides the CLI entry for aihues-api.
package cmd

import (
	"log/slog"
	"os"

	"github.com/samber/do/v2"
	"github.com/spf13/cobra"

	"github.com/aihues/aiushtha/apps/aihues-api/config"
	"github.com/aihues/aiushtha/packages/cfg"
)

var rootCmd = &cobra.Command{
	Use:   "aihues-api",
	Short: "AIHues API service",
}

// Execute runs the root cobra command.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func init() {
	rootCmd.PersistentFlags().StringSliceP("config", "c", nil, "specify config files")

	cobra.OnInitialize(func() {
		configFiles, _ := rootCmd.PersistentFlags().GetStringSlice("config")
		conf := cfg.NewLoader("aihues-api", config.DefaultConfig).Load(configFiles...)
		slog.SetLogLoggerLevel(conf.LogLevel)
		do.ProvideValue(nil, conf)
	})
}
