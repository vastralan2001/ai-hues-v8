package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/samber/lo"
)

func buildArgs(envPrefix string, extraArgs []string) []string {
	envs := lo.Filter(os.Environ(), func(env string, _ int) bool {
		return strings.HasPrefix(env, envPrefix)
	})

	args := make([]string, 0, 20)

	if v, ok := os.LookupEnv("PROTO_OFFLINE"); ok {
		args = append(args, "--build-arg", "PROTO_OFFLINE="+v)
	}
	if v, ok := os.LookupEnv("GOPROXY"); ok {
		args = append(args, "--build-arg", "GOPROXY="+v)
	}
	if v, ok := os.LookupEnv("GONOSUMDB"); ok {
		args = append(args, "--build-arg", "GONOSUMDB="+v)
	}
	if v, ok := os.LookupEnv("APT_SOURCE"); ok {
		args = append(args, "--build-arg", "APT_SOURCE="+v)
	}
	if v, ok := os.LookupEnv("http_proxy"); ok {
		args = append(args, "--build-arg", "http_proxy="+v)
	}
	if v, ok := os.LookupEnv("https_proxy"); ok {
		args = append(args, "--build-arg", "https_proxy="+v)
	}
	if v, ok := os.LookupEnv("HTTP_PROXY"); ok {
		args = append(args, "--build-arg", "HTTP_PROXY="+v)
	}
	if v, ok := os.LookupEnv("HTTPS_PROXY"); ok {
		args = append(args, "--build-arg", "HTTPS_PROXY="+v)
	}
	if v, ok := os.LookupEnv("no_proxy"); ok {
		args = append(args, "--build-arg", "no_proxy="+v)
	}
	if v, ok := os.LookupEnv("NO_PROXY"); ok {
		args = append(args, "--build-arg", "NO_PROXY="+v)
	}
	for _, arg := range extraArgs {
		args = append(args, "--build-arg", arg)
	}
	for _, env := range envs {
		args = append(args, "--build-arg", env)
	}
	return args
}

func pullImage(ctx context.Context, image string) bool {
	err := runDocker(ctx, "pull", image)
	return err == nil
}

func runDocker(ctx context.Context, args ...string) error {
	cmd := exec.CommandContext(ctx, "docker", args...)
	cmd.Stdin = os.Stdin
	cmd.Stderr = os.Stderr
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to run docker: %w", err)
	}

	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("failed to wait docker: %w", err)
	}
	return nil
}
