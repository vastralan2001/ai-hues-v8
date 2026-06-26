package search

import (
	"context"
	"math"
	"strings"
	"testing"
)

// fakeEmbedder maps text to a unit vector over a tiny keyword vocabulary, so
// texts sharing keywords get similar (high dot-product) vectors — enough to
// exercise the ranking deterministically without the model sidecar.
type fakeEmbedder struct{}

var vocab = []string{"json", "format", "game", "snake", "test", "mbti"}

func (fakeEmbedder) Embed(_ context.Context, texts []string) ([][]float32, error) {
	out := make([][]float32, len(texts))
	for i, t := range texts {
		lt := strings.ToLower(t)
		v := make([]float32, len(vocab))
		for j, w := range vocab {
			if strings.Contains(lt, w) {
				v[j] = 1
			}
		}
		var norm float64
		for _, x := range v {
			norm += float64(x) * float64(x)
		}
		if norm > 0 {
			n := float32(math.Sqrt(norm))
			for j := range v {
				v[j] /= n
			}
		}
		out[i] = v
	}
	return out, nil
}

func corpus() []Doc {
	mk := func(slug, title, typ, text string) Doc {
		return Doc{Slug: slug, Title: title, Type: typ, Text: text, SearchText: MakeSearchText(text)}
	}
	return []Doc{
		mk("json", "JSON Formatter", "tool", "JSON Formatter format validate json"),
		mk("snake", "Snake", "game", "Snake glide grow game arcade"),
		mk("mbti", "MBTI", "test", "MBTI personality test sixteen types"),
	}
}

func TestSearch_RanksRelevantFirst(t *testing.T) {
	e := New(fakeEmbedder{})
	if err := e.Build(context.Background(), corpus()); err != nil {
		t.Fatal(err)
	}
	hits, err := e.Search(context.Background(), "json formatter", 5, 0.1)
	if err != nil {
		t.Fatal(err)
	}
	if len(hits) == 0 || hits[0].Slug != "json" {
		t.Fatalf("expected json first, got %+v", hits)
	}
}

func TestRelatedBySlug_SameTypeOnly(t *testing.T) {
	e := New(fakeEmbedder{})
	if err := e.Build(context.Background(), corpus()); err != nil {
		t.Fatal(err)
	}
	rel := e.RelatedBySlug("json", "tool", 5)
	for _, r := range rel {
		if r.Type != "tool" || r.Slug == "json" {
			t.Fatalf("related must be other tools, got %+v", r)
		}
	}
}
