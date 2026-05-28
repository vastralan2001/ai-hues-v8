// Package cfg provides typed configuration loading for services.
package cfg

import (
	"errors"
	"fmt"
	"log/slog"
	"os"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/go-viper/mapstructure/v2"
	"github.com/knadh/koanf/parsers/yaml"
	"github.com/knadh/koanf/providers/env/v2"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/providers/structs"
	"github.com/knadh/koanf/v2"
)

type LoaderConfig struct {
	Paths     []string
	EnvPrefix string
	Delim     string
}

type Loader[T any] struct {
	service       string
	defaultConfig T
	c             *LoaderConfig
}

func NewLoader[T any](svcName string, defaultConfig T) *Loader[T] {
	paths := []string{
		fmt.Sprintf("/etc/%s/%s.yaml", svcName, svcName),
	}
	if home, err := os.UserHomeDir(); err == nil {
		paths = append(paths, fmt.Sprintf("%s/.config/%s.yaml", home, svcName))
	}
	if pwd, err := os.Getwd(); err == nil {
		paths = append(paths, fmt.Sprintf("%s/%s.yaml", pwd, svcName))
		paths = append(paths, fmt.Sprintf("%s/local.yaml", pwd))
	}

	return NewLoaderWithConfig(svcName, defaultConfig, &LoaderConfig{
		Paths:     paths,
		EnvPrefix: fmt.Sprintf("%s__", strings.ToUpper(svcName)),
		Delim:     ".",
	})
}

func NewLoaderWithConfig[T any](svcName string, defaultConfig T, c *LoaderConfig) *Loader[T] {
	if c == nil {
		return NewLoader(svcName, defaultConfig)
	}
	return &Loader[T]{
		service:       svcName,
		defaultConfig: defaultConfig,
		c:             c,
	}
}

func (l *Loader[T]) LoadWithError(confpath ...string) (T, error) {
	var out T
	for _, p := range confpath {
		if _, err := os.Stat(os.ExpandEnv(p)); err != nil {
			slog.Warn("configuration file not found", "path", p, "error", err)
		}
	}

	k := koanf.NewWithConf(koanf.Conf{Delim: l.c.Delim})
	if err := k.Load(structs.Provider(l.defaultConfig, "yaml"), nil); err != nil {
		return out, fmt.Errorf("load default config: %w", err)
	}

	parser := yaml.Parser()
	for _, p := range append(l.c.Paths, confpath...) {
		fullname := os.ExpandEnv(p)
		if _, err := os.Stat(fullname); errors.Is(err, os.ErrNotExist) {
			continue
		}
		if err := k.Load(file.Provider(fullname), parser); err != nil {
			return out, fmt.Errorf("load config file %s: %w", p, err)
		}
	}

	if err := k.Load(env.Provider(l.c.Delim, env.Opt{
		Prefix: l.c.EnvPrefix,
		TransformFunc: func(key string, value string) (string, any) {
			key = strings.TrimPrefix(key, l.c.EnvPrefix)
			key = strings.ToLower(key)
			key = strings.ReplaceAll(key, "__", ".")
			return key, value
		},
	}), nil); err != nil {
		slog.Warn("failed to load environment variables", "service", l.service, "error", err)
	}

	if err := k.UnmarshalWithConf("", &out, koanf.UnmarshalConf{
		Tag: "yaml",
		DecoderConfig: &mapstructure.DecoderConfig{
			DecodeHook: mapstructure.ComposeDecodeHookFunc(
				mapstructure.StringToTimeDurationHookFunc(),
				mapstructure.TextUnmarshallerHookFunc(),
			),
			Result:           &out,
			WeaklyTypedInput: true,
			SquashTagOption:  "inline",
		},
	}); err != nil {
		return out, fmt.Errorf("unmarshal config: %w", err)
	}

	validate := validator.New(validator.WithRequiredStructEnabled())
	if err := validate.Struct(&out); err != nil {
		return out, fmt.Errorf("validate config: %w", err)
	}
	return out, nil
}

func (l *Loader[T]) Load(confpath ...string) T {
	out, err := l.LoadWithError(confpath...)
	if err != nil {
		slog.Error("failed to load configuration", "service", l.service, "error", err)
		panic(err)
	}
	return out
}
