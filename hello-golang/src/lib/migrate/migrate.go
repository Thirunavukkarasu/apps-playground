package migrate

import (
	"gin-app/src/models"

	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/gorm"
)

func Run(db *gorm.DB) error {
	migrations := []*gormigrate.Migration{
		{
			ID: "20260120_0001_init",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&models.User{}, &models.Todo{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&models.Todo{}, &models.User{})
			},
		},
	}

	return gormigrate.New(db, gormigrate.DefaultOptions, migrations).Migrate()
}

