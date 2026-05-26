package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"path"
	"slices"
	"strings"

	flag "github.com/spf13/pflag"
)

var (
	flagProjectID  = flag.String("project", os.Getenv("MOON_PROJECT_ID"), "project id")
	flagDockerRepo = flag.String(
		"docker-repo",
		"msai-cn-beijing.cr.volces.com/msai",
		"docker repository",
	)
	flagNotPush    = flag.Bool("not-push", false, "Do not push to docker registry.")
	flagNameSuffix = flag.String("tag-suffix", "", "tag suffix")
	flagBuildArgs  = flag.StringSlice("build-args", []string{}, "extra docker build args")
	flagEnvPrefix  = flag.String(
		"env-prefix",
		"X_",
		"prefix of environments to be treated as docker build-args",
	)
)

func main() {
	flag.Parse()
	ctx := context.Background()

	projects, err := getProjects(ctx)
	if err != nil {
		slog.Error("Get projects failed.", "error", err)
		os.Exit(1)
	}
	var project *Project
	if i := slices.IndexFunc(projects, func(p *Project) bool {
		return p.ID == *flagProjectID
	}); i >= 0 {
		project = projects[i]
	}
	if project == nil {
		slog.Error("Project not found.", "project", *flagProjectID)
		os.Exit(1)
	}

	c, err := runGit(ctx, "rev-parse", "--short=7", "HEAD")
	if err != nil {
		slog.Error("Run `git rev-parse` failed.", "error", err)
		os.Exit(1)
	}
	latestCommit := strings.TrimSpace(string(c))

	tag := project.ProjectCommit[:len(latestCommit)]
	latestTag := latestCommit
	if *flagNameSuffix != "" {
		tag += "-" + *flagNameSuffix
		latestTag += "-" + *flagNameSuffix
	}
	image := fmt.Sprintf("%s/%s:%s", *flagDockerRepo, project.ID, tag)
	latestImage := fmt.Sprintf("%s/%s:%s", *flagDockerRepo, project.ID, latestTag)

	if !pullImage(ctx, image) {
		dockerCmd := []string{
			"build",
			"-f",
			path.Join(project.Source, "Dockerfile"),
			"--platform", "linux/amd64",
			"-t",
			image,
			".",
		}
		dockerCmd = append(dockerCmd, buildArgs(*flagEnvPrefix, *flagBuildArgs)...)
		slog.Info("Build image.", "cmd", "docker "+strings.Join(dockerCmd, " "))
		err = runDocker(ctx, dockerCmd...)
		if err != nil {
			slog.Error("Build image failed.", "error", err, "image", image)
			os.Exit(1)
		}
		slog.Info("Build image completed.", "image", image)
	}

	if *flagNotPush {
		return
	}

	if tag == latestTag {
		pushImages(ctx, image)
	} else {
		slog.Info("Retag image to latest commit.", "from", image, "to", latestImage)
		err = runDocker(ctx, "image", "tag", image, latestImage)
		if err != nil {
			slog.Error("Retag image failed.", "error", err, "image", image)
			os.Exit(1)
		}
		pushImages(ctx, image, latestImage)
	}
}

func pushImages(ctx context.Context, images ...string) {
	for _, image := range images {
		slog.Info("Push image to docker registry.", "image", image)
		err := runDocker(ctx, "push", image)
		if err != nil {
			slog.Error("Push image failed.", "error", err, "image", image)
			os.Exit(1)
		}
		slog.Info("Push image completed.", "image", image)
	}
}
