package catalogsvc

import (
	"testing"

	"connectrpc.com/connect"
)

func TestParsePage_DefaultsAndCapsPageSize(t *testing.T) {
	page, err := parsePage(0, "")
	if err != nil {
		t.Fatalf("parse default page: %v", err)
	}
	if page.size != int(defaultPageSize) || page.offset != 0 {
		t.Fatalf("default page = %+v", page)
	}

	page, err = parsePage(maxPageSize+1, "10")
	if err != nil {
		t.Fatalf("parse capped page: %v", err)
	}
	if page.size != int(maxPageSize) || page.offset != 10 {
		t.Fatalf("capped page = %+v", page)
	}
}

func TestParsePage_InvalidToken(t *testing.T) {
	_, err := parsePage(10, "bad")
	if err == nil {
		t.Fatal("expected invalid token error")
	}
	if connect.CodeOf(err) != connect.CodeInvalidArgument {
		t.Fatalf("code = %v", connect.CodeOf(err))
	}
}

func TestPageRequestNextToken(t *testing.T) {
	page := pageRequest{size: 10, offset: 20}

	token := page.nextToken(11)
	if token != "30" {
		t.Fatalf("has next: token=%q", token)
	}

	token = page.nextToken(10)
	if token != "" {
		t.Fatalf("last page: token=%q", token)
	}
}
