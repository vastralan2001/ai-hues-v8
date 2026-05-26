package main

import (
	"bytes"
	"cmp"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"slices"
)

func runMoon(ctx context.Context, args ...string) ([]byte, error) {
	cmd := exec.CommandContext(ctx, "node_modules/.bin/moon", args...)
	out, err := cmd.StdoutPipe()
	if err != nil {
		return nil, fmt.Errorf("failed to get stdout pipe: %w", err)
	}
	cmd.Stderr = os.Stderr
	if err = cmd.Start(); err != nil {
		return nil, fmt.Errorf("failed to run moon: %w", err)
	}
	defer out.Close()

	var buf bytes.Buffer
	_, err = io.Copy(&buf, out)
	if err != nil {
		return nil, fmt.Errorf("failed to copy stdout: %w", err)
	}

	if err := cmd.Wait(); err != nil {
		return nil, fmt.Errorf("failed to wait moon: %w", err)
	}
	return buf.Bytes(), nil
}

func runGit(ctx context.Context, args ...string) ([]byte, error) {
	cmd := exec.CommandContext(ctx, "git", args...)
	out, err := cmd.StdoutPipe()
	if err != nil {
		return nil, fmt.Errorf("failed to get stdout pipe: %w", err)
	}
	cmd.Stderr = os.Stderr
	if err = cmd.Start(); err != nil {
		return nil, fmt.Errorf("failed to run git: %w", err)
	}
	defer out.Close()

	var buf bytes.Buffer
	_, err = io.Copy(&buf, out)
	if err != nil {
		return nil, fmt.Errorf("failed to copy stdout: %w", err)
	}

	if err := cmd.Wait(); err != nil {
		return nil, fmt.Errorf("failed to wait git: %w", err)
	}
	return buf.Bytes(), nil
}

type Project struct {
	ID           string `json:"id"`
	Source       string `json:"source"`
	Language     string `json:"language"`
	Dependencies []struct {
		ID string `json:"id"`
	} `json:"dependencies"`
	Config struct {
		Tags []string `json:"tags"`
	} `json:"config"`

	ProjectCommit string `json:"-"`
	LatestCommit  string `json:"-"`
	CommitTime    int64  `json:"-"`
}

func getProjects(ctx context.Context) ([]*Project, error) {
	out, err := runMoon(ctx, "query", "projects", "--json")
	if err != nil {
		return nil, err
	}
	var output struct {
		Projects []*Project `json:"projects"`
	}
	if err := json.Unmarshal(out, &output); err != nil {
		return nil, fmt.Errorf("failed to unmarshal: %w", err)
	}
	for _, p := range output.Projects {
		commit, err := runGit(
			ctx,
			"log",
			"-n",
			"1",
			`--pretty=format:%ct %H`,
			"HEAD",
			"--",
			p.Source,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to get latest commit: %w", err)
		}
		_, err = fmt.Sscanf(string(commit), "%d %s", &p.CommitTime, &p.LatestCommit)
		if err != nil && !errors.Is(err, io.EOF) {
			return nil, fmt.Errorf("failed to parse latest commit: %w", err)
		}
	}
	for _, p := range output.Projects {
		type commit struct {
			Time   int64
			Commit string
		}
		commits := make([]commit, 0, 1+len(p.Dependencies))
		commits = append(commits, commit{
			Time:   p.CommitTime,
			Commit: p.LatestCommit,
		})
		for _, dep := range p.Dependencies {
			if i := slices.IndexFunc(output.Projects, func(e *Project) bool {
				return dep.ID == e.ID
			}); i >= 0 {
				commits = append(commits, commit{
					Time:   output.Projects[i].CommitTime,
					Commit: output.Projects[i].LatestCommit,
				})
			}
		}
		for _, dependencyPath := range dependencyPaths(p.Language) {
			depTime, depCommit, err := latestCommit(ctx, dependencyPath)
			if err != nil {
				return nil, err
			}
			commits = append(commits, commit{
				Time:   depTime,
				Commit: depCommit,
			})
		}
		m := slices.MaxFunc(commits, func(a, b commit) int {
			r := cmp.Compare(a.Time, b.Time)
			if r == 0 {
				return cmp.Compare(a.Commit, b.Commit)
			}
			return r
		})
		p.ProjectCommit = m.Commit
	}

	return output.Projects, nil
}

func latestCommit(ctx context.Context, sourcePath string) (int64, string, error) {
	commit, err := runGit(
		ctx,
		"log",
		"-n",
		"1",
		`--pretty=format:%ct %H`,
		"HEAD",
		"--",
		sourcePath,
	)
	if err != nil {
		return 0, "", fmt.Errorf("failed to get latest commit: %w", err)
	}

	var commitTime int64
	var commitHash string
	_, err = fmt.Sscanf(string(commit), "%d %s", &commitTime, &commitHash)
	if err != nil && !errors.Is(err, io.EOF) {
		return 0, "", fmt.Errorf("failed to parse latest commit: %w", err)
	}
	return commitTime, commitHash, nil
}

func dependencyPaths(language string) []string {
	switch language {
	case "go":
		return []string{"go.mod", "go.sum"}
	case "javascript", "typescript":
		return []string{"package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"}
	default:
		return nil
	}
}
