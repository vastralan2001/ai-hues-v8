// Package search provides semantic catalog search backed by sentence
// embeddings (served by the aihues-embed sidecar) and an in-process flat
// inner-product index. Vectors are L2-normalised, so a dot product equals
// cosine similarity — the pure-Go index below is equivalent to a FAISS
// IndexFlatIP at this corpus size. A cgo go-faiss implementation can be added
// behind a build tag without changing this package's API.
package search

import (
	"context"
	"sort"
	"strings"
	"sync"
)

// Doc is one searchable catalog entry.
type Doc struct {
	Slug     string
	Title    string
	Subtitle string
	Desc     string
	Href     string
	Type     string // tool | game | test
	// Text is the embedding input (name + description + keywords); SearchText
	// is its lowercased form used for the lexical-overlap boost.
	Text       string
	SearchText string
}

// Hit is a ranked search result.
type Hit struct {
	Slug     string
	Title    string
	Subtitle string
	Href     string
	Type     string
	Score    float32
}

// Related is a neighbour of a doc (same type).
type Related struct {
	Slug     string
	Title    string
	Desc     string
	Subtitle string
	Href     string
	Type     string
}

// Embedder turns texts into L2-normalised vectors (the sidecar client).
type Embedder interface {
	Embed(ctx context.Context, texts []string) ([][]float32, error)
}

// Engine holds the corpus + its embeddings and answers queries.
type Engine struct {
	embedder Embedder
	mu       sync.RWMutex
	docs     []Doc
	vecs     [][]float32
	ready    bool
}

func New(e Embedder) *Engine { return &Engine{embedder: e} }

// Build embeds every doc and stores the index. Safe to call again to refresh.
func (e *Engine) Build(ctx context.Context, docs []Doc) error {
	texts := make([]string, len(docs))
	for i, d := range docs {
		texts[i] = d.Text
	}
	vecs, err := e.embedder.Embed(ctx, texts)
	if err != nil {
		return err
	}
	e.mu.Lock()
	e.docs = docs
	e.vecs = vecs
	e.ready = true
	e.mu.Unlock()
	return nil
}

// Ready reports whether the index has been built.
func (e *Engine) Ready() bool {
	e.mu.RLock()
	defer e.mu.RUnlock()
	return e.ready
}

func dot(a, b []float32) float32 {
	n := len(a)
	if len(b) < n {
		n = len(b)
	}
	var s float32
	for i := 0; i < n; i++ {
		s += a[i] * b[i]
	}
	return s
}

func normalizeText(s string) string {
	var b strings.Builder
	prevSpace := false
	for _, r := range strings.ToLower(s) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r > 127 {
			b.WriteRune(r)
			prevSpace = false
		} else if !prevSpace {
			b.WriteByte(' ')
			prevSpace = true
		}
	}
	return strings.TrimSpace(b.String())
}

// lexicalOverlap mirrors the web client: fraction of query terms (len>=2) that
// appear in the doc's search text.
func lexicalOverlap(query, searchText string) float32 {
	terms := strings.Fields(normalizeText(query))
	var kept, hit int
	for _, t := range terms {
		if len([]rune(t)) < 2 {
			continue
		}
		kept++
		if strings.Contains(searchText, t) {
			hit++
		}
	}
	if kept == 0 {
		return 0
	}
	return float32(hit) / float32(kept)
}

// Search returns up to k hits scored by cosine + 0.3·lexical, above minScore.
func (e *Engine) Search(ctx context.Context, query string, k int, minScore float32) ([]Hit, error) {
	e.mu.RLock()
	docs, vecs, ready := e.docs, e.vecs, e.ready
	e.mu.RUnlock()
	if !ready || len(docs) == 0 {
		return nil, nil
	}
	qv, err := e.embedder.Embed(ctx, []string{query})
	if err != nil || len(qv) == 0 {
		return nil, err
	}
	q := qv[0]
	lq := strings.ToLower(query)
	type sd struct {
		i     int
		score float32
	}
	scored := make([]sd, 0, len(docs))
	for i, d := range docs {
		score := dot(q, vecs[i]) + lexicalOverlap(lq, d.SearchText)*0.3
		if score >= minScore {
			scored = append(scored, sd{i, score})
		}
	}
	sort.SliceStable(scored, func(a, b int) bool { return scored[a].score > scored[b].score })
	if k > 0 && len(scored) > k {
		scored = scored[:k]
	}
	out := make([]Hit, len(scored))
	for j, s := range scored {
		d := docs[s.i]
		sc := s.score
		if sc > 1 {
			sc = 1
		}
		out[j] = Hit{d.Slug, d.Title, d.Subtitle, d.Href, d.Type, sc}
	}
	return out, nil
}

func (e *Engine) topRelated(qv []float32, typ string, k, skip int) []Related {
	e.mu.RLock()
	docs, vecs := e.docs, e.vecs
	e.mu.RUnlock()
	type sd struct {
		i     int
		score float32
	}
	scored := make([]sd, 0, len(docs))
	for i, d := range docs {
		if i == skip || d.Type != typ {
			continue
		}
		scored = append(scored, sd{i, dot(qv, vecs[i])})
	}
	sort.SliceStable(scored, func(a, b int) bool { return scored[a].score > scored[b].score })
	if k > 0 && len(scored) > k {
		scored = scored[:k]
	}
	out := make([]Related, 0, len(scored))
	for _, s := range scored {
		if s.score <= 0 {
			continue
		}
		d := docs[s.i]
		out = append(out, Related{d.Slug, d.Title, d.Desc, d.Subtitle, d.Href, d.Type})
	}
	return out
}

// RelatedBySlug returns same-type neighbours of an indexed entry.
func (e *Engine) RelatedBySlug(slug, typ string, k int) []Related {
	e.mu.RLock()
	idx := -1
	for i, d := range e.docs {
		if d.Slug == slug && d.Type == typ {
			idx = i
			break
		}
	}
	var qv []float32
	if idx >= 0 {
		qv = e.vecs[idx]
	}
	e.mu.RUnlock()
	if idx < 0 {
		return nil
	}
	return e.topRelated(qv, typ, k, idx)
}

// RelatedByQuery returns same-type neighbours of a free-text query.
func (e *Engine) RelatedByQuery(ctx context.Context, query, typ string, k int) ([]Related, error) {
	if !e.Ready() {
		return nil, nil
	}
	qv, err := e.embedder.Embed(ctx, []string{query})
	if err != nil || len(qv) == 0 {
		return nil, err
	}
	return e.topRelated(qv[0], typ, k, -1), nil
}

// MakeSearchText builds the lowercased lexical field from a doc's text.
func MakeSearchText(text string) string { return strings.ToLower(text) }
