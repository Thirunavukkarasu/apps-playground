package todos

import (
	"context"

	"gin-app/src/models"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, todo models.Todo) (models.Todo, error)
	ListByUserID(ctx context.Context, userID int64) ([]models.Todo, error)
}

type SQLRepository struct {
	db *gorm.DB
}

func NewSQLRepository(db *gorm.DB) *SQLRepository {
	return &SQLRepository{db: db}
}

func (r *SQLRepository) Create(ctx context.Context, todo models.Todo) (models.Todo, error) {
	if err := r.db.WithContext(ctx).Create(&todo).Error; err != nil {
		return models.Todo{}, err
	}
	return todo, nil
}

func (r *SQLRepository) ListByUserID(ctx context.Context, userID int64) ([]models.Todo, error) {
	var todos []models.Todo
	if err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("id").
		Find(&todos).Error; err != nil {
		return nil, err
	}

	return todos, nil
}

