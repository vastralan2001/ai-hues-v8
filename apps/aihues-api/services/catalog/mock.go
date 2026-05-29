// Package catalogsvc implements the public CatalogService.
package catalogsvc

import (
	"context"
	"strings"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/timestamppb"

	catalogv1 "github.com/aihues/aiushtha/gen/go/aihues/catalog/v1"
	"github.com/aihues/aiushtha/gen/go/aihues/catalog/v1/catalogv1connect"
)

// MemoryService is an in-memory catalog service for local dev.
type MemoryService struct {
	catalogv1connect.UnimplementedCatalogServiceHandler
}

// NewMemory constructs a MemoryService with seed data.
func NewMemory() *MemoryService {
	return &MemoryService{}
}

var seedItems = []struct {
	ID          string
	Kind        catalogv1.ItemKind
	Slug        string
	Icon        string
	Name        string
	Description string
	Status      catalogv1.ItemStatus
	SortOrder   int32
	Category    catalogv1.ItemCategory
}{
	// Developer tools (category=1)
	{"b5c8d2e1f3a4b6c9d0e1", catalogv1.ItemKind_ITEM_KIND_TOOL, "jwt", "🔐", "JWT Parser", "Parse JWT tokens", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 1000, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"a7b6c5d4e3f2a1b0c9d8", catalogv1.ItemKind_ITEM_KIND_TOOL, "json", "📋", "JSON Formatter", "Format & validate JSON", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 999, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"e1f2a3b4c5d6e7f8a9b0", catalogv1.ItemKind_ITEM_KIND_TOOL, "regex", "🔍", "Regex Tester", "Test regular expressions", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 998, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"c3d4e5f6a7b8c9d0e1f2", catalogv1.ItemKind_ITEM_KIND_TOOL, "uuid", "🆔", "UUID Generator", "Generate UUID v4", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 997, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"f7a8b9c0d1e2f3a4b5c6", catalogv1.ItemKind_ITEM_KIND_TOOL, "timestamp", "⏱️", "Timestamp", "Unix timestamp converter", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 996, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"d0e1f2a3b4c5d6e7f8a9", catalogv1.ItemKind_ITEM_KIND_TOOL, "base64", "🔢", "Base64", "Base64 encode/decode", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 995, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"a2b3c4d5e6f7a8b9c0d1", catalogv1.ItemKind_ITEM_KIND_TOOL, "sha256", "🔒", "SHA256 Hash", "SHA-256/SHA-1/MD5", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 994, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"b4c5d6e7f8a9b0c1d2e3", catalogv1.ItemKind_ITEM_KIND_TOOL, "sql", "🗄️", "SQL Formatter", "Format SQL queries", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 993, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"c6d7e8f9a0b1c2d3e4f5", catalogv1.ItemKind_ITEM_KIND_TOOL, "url-encode", "🔗", "URL Encode", "URL encode/decode", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 992, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"d8e9f0a1b2c3d4e5f6a7", catalogv1.ItemKind_ITEM_KIND_TOOL, "base-convert", "🔢", "Base Converter", "Binary/octal/dec/hex", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 991, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"e0f1a2b3c4d5e6f7a8b9", catalogv1.ItemKind_ITEM_KIND_TOOL, "password-gen", "🔑", "Password Gen", "Secure password gen", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 990, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"f2a3b4c5d6e7f8a9b0c1", catalogv1.ItemKind_ITEM_KIND_TOOL, "http-status", "🌐", "HTTP Status", "Status code reference", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 989, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"a4b5c6d7e8f9a0b1c2d3", catalogv1.ItemKind_ITEM_KIND_TOOL, "html-entity", "◈", "HTML Entity", "Entity & Unicode", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 988, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"b6c7d8e9f0a1b2c3d4e5", catalogv1.ItemKind_ITEM_KIND_TOOL, "cron-parser", "⏰", "Cron Parser", "Parse cron expressions", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 987, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"c8d9e0f1a2b3c4d5e6f7", catalogv1.ItemKind_ITEM_KIND_TOOL, "code-explain", "💻", "Code Explain", "Explain code", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 986, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"d0e1f2a3b4c5d6e7f8a9", catalogv1.ItemKind_ITEM_KIND_TOOL, "code-review", "👁️", "Code Review", "Review code", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 985, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"e2f3a4b5c6d7e8f9a0b1", catalogv1.ItemKind_ITEM_KIND_TOOL, "shell", "🐚", "Shell Gen", "Generate shell commands", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 984, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"f4a5b6c7d8e9f0a1b2c3", catalogv1.ItemKind_ITEM_KIND_TOOL, "git-commit", "📌", "Git Commit", "Git commit messages", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 983, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"a6b7c8d9e0f1a2b3c4d5", catalogv1.ItemKind_ITEM_KIND_TOOL, "ip-lookup", "🔍", "IP Lookup", "IP geolocation lookup", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 982, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"b8c9d0e1f2a3b4c5d6e7", catalogv1.ItemKind_ITEM_KIND_TOOL, "curl-gen", "🌐", "Curl Gen", "Generate curl commands", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 981, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"c0d1e2f3a4b5c6d7e8f9", catalogv1.ItemKind_ITEM_KIND_TOOL, "image-to-base64", "🖼️", "Image → Base64", "Image to Base64", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 980, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"d2e3f4a5b6c7d8e9f0a1", catalogv1.ItemKind_ITEM_KIND_TOOL, "css-gradient", "🌈", "CSS Gradient", "CSS gradient gen", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 979, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"e4f5a6b7c8d9e0f1a2b3", catalogv1.ItemKind_ITEM_KIND_TOOL, "color-convert", "🎨", "Color Converter", "HEX/RGB/HSL/CMYK", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 978, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"f6a7b8c9d0e1f2a3b4c5", catalogv1.ItemKind_ITEM_KIND_TOOL, "csv-json", "📊", "CSV ↔ JSON", "CSV/JSON convert", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 977, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"a8b9c0d1e2f3a4b5c6d7", catalogv1.ItemKind_ITEM_KIND_TOOL, "diff-pro", "📑", "Diff Pro", "Advanced text diff", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 976, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"b0c1d2e3f4a5b6c7d8e9", catalogv1.ItemKind_ITEM_KIND_TOOL, "unit-convert", "📐", "Unit Convert", "Unit converter", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 975, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"c2d3e4f5a6b7c8d9e0f1", catalogv1.ItemKind_ITEM_KIND_TOOL, "qrcode", "📱", "QR Code", "Generate QR codes", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 974, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"d4e5f6a7b8c9d0e1f2a3", catalogv1.ItemKind_ITEM_KIND_TOOL, "markdown", "📝", "Markdown", "Live MD preview", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 973, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"e6f7a8b9c0d1e2f3a4b5", catalogv1.ItemKind_ITEM_KIND_TOOL, "pomodoro", "🍅", "Pomodoro", "Focus timer", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 972, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},
	{"f8a9b0c1d2e3f4a5b6c7", catalogv1.ItemKind_ITEM_KIND_TOOL, "chi-squared", "📊", "Chi-Squared", "A/B test calculator", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 971, catalogv1.ItemCategory_ITEM_CATEGORY_DEVELOPER},

	// Utility tools (category=2)
	{"a0b1c2d3e4f5a6b7c8d9", catalogv1.ItemKind_ITEM_KIND_TOOL, "word-count", "📊", "Word Counter", "Word & char count", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 800, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"b2c3d4e5f6a7b8c9d0e1", catalogv1.ItemKind_ITEM_KIND_TOOL, "diff", "📑", "Diff Checker", "Compare text diffs", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 799, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"c4d5e6f7a8b9c0d1e2f3", catalogv1.ItemKind_ITEM_KIND_TOOL, "fullwidth", "↔️", "Fullwidth", "Width converter", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 798, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"d6e7f8a9b0c1d2e3f4a5", catalogv1.ItemKind_ITEM_KIND_TOOL, "title-case", "📰", "Title Case", "12 format types", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 797, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"e8f9a0b1c2d3e4f5a6b7", catalogv1.ItemKind_ITEM_KIND_TOOL, "readability", "📖", "Readability", "Text readability", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 796, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"f0a1b2c3d4e5f6a7b8c9", catalogv1.ItemKind_ITEM_KIND_TOOL, "humanize", "✨", "Humanize", "De-AI text", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 795, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"a2b3c4d5e6f7a8b9c0d1", catalogv1.ItemKind_ITEM_KIND_TOOL, "lorem-ipsum", "📝", "Lorem Ipsum", "Random text generator", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 794, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},
	{"b4c5d6e7f8a9b0c1d2e3", catalogv1.ItemKind_ITEM_KIND_TOOL, "seo-title", "🔍", "SEO Title", "SEO title generator", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 793, catalogv1.ItemCategory_ITEM_CATEGORY_UTILITY},

	// AI Writing tools (category=3)
	{"c6d7e8f9a0b1c2d3e4f5", catalogv1.ItemKind_ITEM_KIND_TOOL, "ad-copy", "📢", "Ad Copy", "3 ad sets with title+body+CTA", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 600, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"d8e9f0a1b2c3d4e5f6a7", catalogv1.ItemKind_ITEM_KIND_TOOL, "alt-text", "🖼️", "Alt Text", "SEO alt text generator", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 599, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"e0f1a2b3c4d5e6f7a8b9", catalogv1.ItemKind_ITEM_KIND_TOOL, "blog-outline", "📝", "Blog Outline", "6-section blog outline", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 598, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"f2a3b4c5d6e7f8a9b0c1", catalogv1.ItemKind_ITEM_KIND_TOOL, "changelog", "📋", "Changelog", "Categorized changelog", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 597, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"a4b5c6d7e8f9a0b1c2d3", catalogv1.ItemKind_ITEM_KIND_TOOL, "cold-email", "📧", "Cold Email", "3 outreach templates", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 596, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"b6c7d8e9f0a1b2c3d4e5", catalogv1.ItemKind_ITEM_KIND_TOOL, "docs", "📚", "Docs", "API docs + params + examples", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 595, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"c8d9e0f1a2a3b4c5d6e7", catalogv1.ItemKind_ITEM_KIND_TOOL, "faq", "❓", "FAQ", "8 FAQ Q&A", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 594, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"d0e1f2a3b4c5d6e7f8a9", catalogv1.ItemKind_ITEM_KIND_TOOL, "linkedin", "💼", "LinkedIn", "3 post formats", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 593, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"e2f3a4b5c6d7e8f9a0b1", catalogv1.ItemKind_ITEM_KIND_TOOL, "lp-hero", "🎯", "LP Hero", "Landing page hero copy", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 592, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"f4a5b6c7d8e9f0a1b2c3", catalogv1.ItemKind_ITEM_KIND_TOOL, "meta", "🏷️", "Meta", "SEO meta HTML", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 591, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"a6b7c8d9e0f1a2b3c4d5", catalogv1.ItemKind_ITEM_KIND_TOOL, "newsletter", "📰", "Newsletter", "Full newsletter structure", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 590, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"b8c9d0e1f2a3b4c5d6e7", catalogv1.ItemKind_ITEM_KIND_TOOL, "pr-desc", "🔀", "PR Desc", "PR template + checklist", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 589, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"c0d1e2f3a4b5c6d7e8f9", catalogv1.ItemKind_ITEM_KIND_TOOL, "pseudo", "🎭", "Pseudo", "Pseudocode generator", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 588, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"d2e3f4a5b6c7d8e9f0a1", catalogv1.ItemKind_ITEM_KIND_TOOL, "push", "🔔", "Push", "4 push notification copies", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 587, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"e4f5a6b7c8d9e0f1a2b3", catalogv1.ItemKind_ITEM_KIND_TOOL, "tagline", "✒️", "Tagline", "8 brand taglines", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 586, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"f6a7b8c9d0e1f2a3b4c5", catalogv1.ItemKind_ITEM_KIND_TOOL, "tldr", "📄", "TL;DR", "Summary + key extract", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 585, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"a8b9c0d1e2f3a4b5c6d7", catalogv1.ItemKind_ITEM_KIND_TOOL, "video-title", "🎬", "Video Title", "8 YouTube titles", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 584, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"b0c1d2e3f4a5b6c7d8e9", catalogv1.ItemKind_ITEM_KIND_TOOL, "x-post", "𝕏", "X Post", "3 X post formats", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 583, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},
	{"c2d3e4f5a6b7c8d9e0f1", catalogv1.ItemKind_ITEM_KIND_TOOL, "yt-script", "🎥", "YT Script", "YouTube script", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 582, catalogv1.ItemCategory_ITEM_CATEGORY_AI_WRITING},

	// Games (category=0)
	{"d4e5f6a7b8c9d0e1f2a3", catalogv1.ItemKind_ITEM_KIND_GAME, "daily-luck", "📅", "Daily Fortune", "Draw your daily fortune — get wisdom, lucky color & Credit rewards. Streak bonuses unlocked!", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 300, catalogv1.ItemCategory_ITEM_CATEGORY_UNSPECIFIED},
	{"e6f7a8b9c0d1e2f3a4b5", catalogv1.ItemKind_ITEM_KIND_GAME, "slot-machine", "🎰", "Lucky Slots", "Classic 3×3 slot machine. 3 free spins daily. Hit triple 7s for the jackpot!", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 299, catalogv1.ItemCategory_ITEM_CATEGORY_UNSPECIFIED},
	{"f8a9b0c1d2e3f4a5b6c7", catalogv1.ItemKind_ITEM_KIND_GAME, "basketball", "🏀", "Hoops Challenge", "60-second basketball challenge. Swipe to control power & angle. Compete for the high score!", catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED, 298, catalogv1.ItemCategory_ITEM_CATEGORY_UNSPECIFIED},
}

func filterTools(items []struct {
	ID          string
	Kind        catalogv1.ItemKind
	Slug        string
	Icon        string
	Name        string
	Description string
	Status      catalogv1.ItemStatus
	SortOrder   int32
	Category    catalogv1.ItemCategory
}, category catalogv1.ItemCategory, query string) []*catalogv1.Tool {
	var out []*catalogv1.Tool
	q := strings.ToLower(strings.TrimSpace(query))
	for _, it := range items {
		if it.Kind != catalogv1.ItemKind_ITEM_KIND_TOOL {
			continue
		}
		if it.Status != catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED {
			continue
		}
		if category != catalogv1.ItemCategory_ITEM_CATEGORY_UNSPECIFIED && it.Category != category {
			continue
		}
		if q != "" && !strings.Contains(strings.ToLower(it.Name), q) && !strings.Contains(strings.ToLower(it.Description), q) {
			continue
		}
		out = append(out, &catalogv1.Tool{
			Id:          it.ID,
			Slug:        it.Slug,
			Icon:        it.Icon,
			Name:        it.Name,
			Description: it.Description,
			Category:    it.Category,
			Status:      it.Status,
			SortOrder:   it.SortOrder,
			CreateTime:  timestamppb.Now(),
			UpdateTime:  timestamppb.Now(),
		})
	}
	return out
}

func filterGames(items []struct {
	ID          string
	Kind        catalogv1.ItemKind
	Slug        string
	Icon        string
	Name        string
	Description string
	Status      catalogv1.ItemStatus
	SortOrder   int32
	Category    catalogv1.ItemCategory
}) []*catalogv1.Game {
	var out []*catalogv1.Game
	for _, it := range items {
		if it.Kind != catalogv1.ItemKind_ITEM_KIND_GAME {
			continue
		}
		if it.Status != catalogv1.ItemStatus_ITEM_STATUS_PUBLISHED {
			continue
		}
		out = append(out, &catalogv1.Game{
			Id:          it.ID,
			Slug:        it.Slug,
			Icon:        it.Icon,
			Name:        it.Name,
			Description: it.Description,
			Status:      it.Status,
			SortOrder:   it.SortOrder,
			CreateTime:  timestamppb.Now(),
			UpdateTime:  timestamppb.Now(),
		})
	}
	return out
}

// ListTools returns tools from memory.
func (s *MemoryService) ListTools(
	ctx context.Context,
	req *connect.Request[catalogv1.ListToolsRequest],
) (*connect.Response[catalogv1.ListToolsResponse], error) {
	tools := filterTools(seedItems, req.Msg.GetCategory(), req.Msg.GetQ())
	pageSize := int(req.Msg.GetPageSize())
	if pageSize <= 0 {
		pageSize = 20
	}
	pageToken := req.Msg.GetPageToken()
	offset := 0
	if pageToken != "" {
		// Simple base64 decode not needed for mock; tokens are plain offset strings.
		// For simplicity, treat pageToken as empty in mock.
	}
	if offset > len(tools) {
		offset = len(tools)
	}
	end := offset + pageSize
	nextToken := ""
	if end < len(tools) {
		nextToken = "next"
	} else {
		end = len(tools)
	}
	return connect.NewResponse(&catalogv1.ListToolsResponse{
		Tools:         tools[offset:end],
		NextPageToken: nextToken,
	}), nil
}

// ListGames returns games from memory.
func (s *MemoryService) ListGames(
	ctx context.Context,
	req *connect.Request[catalogv1.ListGamesRequest],
) (*connect.Response[catalogv1.ListGamesResponse], error) {
	games := filterGames(seedItems)
	pageSize := int(req.Msg.GetPageSize())
	if pageSize <= 0 {
		pageSize = 20
	}
	end := pageSize
	if end > len(games) {
		end = len(games)
	}
	nextToken := ""
	if pageSize < len(games) {
		nextToken = "next"
	}
	return connect.NewResponse(&catalogv1.ListGamesResponse{
		Games:         games[:end],
		NextPageToken: nextToken,
	}), nil
}
