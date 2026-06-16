package cmd

import (
	"context"
	"log/slog"
	"os/signal"
	"syscall"
	"time"

	"dev.msh.team/protos/twine/v3"
	"github.com/samber/do/v2"
	"github.com/spf13/cobra"

	"github.com/aihues/aiushtha/packages/proto-go/aihues/catalog/v1/catalogv1connect"

	"github.com/aihues/aiushtha/apps/aihues-api/config"
)

var cmdAPI = &cobra.Command{
	Use:   "api",
	Short: "Run the aihues-api HTTP service",
	Run:   runServer,
}

func init() {
	rootCmd.AddCommand(cmdAPI)
}

func runServer(*cobra.Command, []string) {
	cfg := do.MustInvoke[config.Config](nil)

	server := twine.NewServer(
		cfg.ServiceName(),
		twine.WithDefaultOptions(),
		twine.WithShutdownTimeout(30*time.Second),
	)

	catalogSvc := do.MustInvoke[catalogv1connect.CatalogServiceHandler](nil)
	twine.RegisterConnect(server, catalogv1connect.NewCatalogServiceHandler, catalogSvc)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	slog.Info("aihues-api starting", "addr", cfg.ListenAddr)
	if err := server.ServeContext(ctx, cfg.ListenAddr); err != nil {
		slog.Error("server error", "error", err)
	}

	do.MustInvoke[context.CancelFunc](nil)()
}
