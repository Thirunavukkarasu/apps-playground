package todos

import (
	"context"
	"errors"
	"strings"
	"time"

	"gin-app/src/models"
)

var ErrUserNotFound = errors.New("user not found")

type UserLookup interface {
	GetByID(ctx context.Context, id int64) (models.User, bool, error)
}

type Service struct {
	repo  Repository
	users UserLookup
}

func NewService(repo Repository, users UserLookup) *Service {
	return &Service{
		repo:  repo,
		users: users,
	}
}

func (s *Service) Create(ctx context.Context, userID int64, title string, completed bool) (models.Todo, error) {
	_, ok, err := s.users.GetByID(ctx, userID)
	if err != nil {
		return models.Todo{}, err
	}
	if !ok {
		return models.Todo{}, ErrUserNotFound
	}

	title = strings.TrimSpace(title)
	if title == "" {
		return models.Todo{}, errors.New("title is required")
	}

	todo := models.Todo{
		UserID:    userID,
		Title:     title,
		Completed: completed,
		CreatedAt: time.Now().UTC(),
	}

	return s.repo.Create(ctx, todo)
}

func (s *Service) ListByUser(ctx context.Context, userID int64) ([]models.Todo, error) {
	_, ok, err := s.users.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, ErrUserNotFound
	}

	return s.repo.ListByUserID(ctx, userID)
}

