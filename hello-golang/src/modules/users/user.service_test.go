package users

import (
	"context"
	"testing"
	"time"

	"gin-app/src/models"
)

type fakeRepo struct {
	nextID int64
	last   models.User
}

func (f *fakeRepo) Create(_ context.Context, user models.User) (models.User, error) {
	f.nextID++
	user.ID = f.nextID
	f.last = user
	return user, nil
}

func (f *fakeRepo) GetByID(_ context.Context, _ int64) (models.User, bool, error) {
	return models.User{}, false, nil
}

func (f *fakeRepo) List(_ context.Context) ([]models.User, error) {
	return nil, nil
}

func TestCreateUser(t *testing.T) {
	repo := &fakeRepo{}
	service := NewService(repo)

	user, err := service.Create(context.Background(), "alice")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if user.ID == 0 {
		t.Fatalf("expected ID to be set")
	}
	if user.Name != "alice" {
		t.Fatalf("expected name alice, got %s", user.Name)
	}
	if user.CreatedAt.IsZero() {
		t.Fatalf("expected CreatedAt to be set")
	}
	if time.Since(user.CreatedAt) > time.Minute {
		t.Fatalf("expected CreatedAt to be recent")
	}
}

func TestCreateUserRejectsBlankName(t *testing.T) {
	repo := &fakeRepo{}
	service := NewService(repo)

	if _, err := service.Create(context.Background(), "   "); err == nil {
		t.Fatalf("expected error for blank name")
	}
}

