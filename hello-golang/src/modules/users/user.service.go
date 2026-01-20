package users

import (
	"context"
	"errors"
	"strings"
	"time"

	"gin-app/src/models"
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, name string) (models.User, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return models.User{}, errors.New("name is required")
	}

	user := models.User{
		Name:      name,
		CreatedAt: time.Now().UTC(),
	}

	return s.repo.Create(ctx, user)
}

func (s *Service) List(ctx context.Context) ([]models.User, error) {
	return s.repo.List(ctx)
}

func (s *Service) GetByID(ctx context.Context, id int64) (models.User, bool, error) {
	return s.repo.GetByID(ctx, id)
}

