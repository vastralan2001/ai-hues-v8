package catalogsvc

import (
	"errors"
	"strconv"

	"connectrpc.com/connect"

	itemdal "github.com/aihues/aiushtha/apps/aihues-api/dal/item"
)

const (
	defaultPageSize = int32(10)
	maxPageSize     = int32(20)
)

var errInvalidPageToken = errors.New("invalid page_token")

type pageRequest struct {
	size   int
	offset int
}

func parsePage(pageSize int32, pageToken string) (pageRequest, error) {
	if pageSize <= 0 {
		pageSize = defaultPageSize
	}
	if pageSize > maxPageSize {
		pageSize = maxPageSize
	}

	offset := 0
	if pageToken != "" {
		n, err := strconv.Atoi(pageToken)
		if err != nil || n < 0 {
			return pageRequest{}, connect.NewError(connect.CodeInvalidArgument, errInvalidPageToken)
		}
		offset = n
	}

	return pageRequest{
		size:   int(pageSize),
		offset: offset,
	}, nil
}

func (p pageRequest) dalPage() itemdal.PageFilter {
	return itemdal.PageFilter{
		Limit:  p.size + 1,
		Offset: p.offset,
	}
}

func (p pageRequest) nextToken(rowCount int) string {
	if rowCount <= p.size {
		return ""
	}
	return strconv.Itoa(p.offset + p.size)
}
