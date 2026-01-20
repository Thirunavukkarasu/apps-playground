package users

import (
	"context"

	"gin-app/src/models"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, user models.User) (models.User, error)
	GetByID(ctx context.Context, id int64) (models.User, bool, error)
	List(ctx context.Context) ([]models.User, error)
}

type SQLRepository struct {
	db *gorm.DB
}

func NewSQLRepository(db *gorm.DB) *SQLRepository {
	return &SQLRepository{db: db}
}

func (r *SQLRepository) Create(ctx context.Context, user models.User) (models.User, error) {
	if err := r.db.WithContext(ctx).Create(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (r *SQLRepository) GetByID(ctx context.Context, id int64) (models.User, bool, error) {
	var user models.User
	err := r.db.WithContext(ctx).First(&user, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.User{}, false, nil
		}
		return models.User{}, false, err
	}
	return user, true, nil
}

func (r *SQLRepository) List(ctx context.Context) ([]models.User, error) {
	var users []models.User
	if err := r.db.WithContext(ctx).Order("id").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

