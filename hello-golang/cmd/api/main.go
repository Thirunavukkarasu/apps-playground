package main

import (
	"log"
	"os"

	"gin-app/src/lib/config"
	"gin-app/src/lib/db"
	"gin-app/src/lib/migrate"
	"gin-app/src/modules/todos"
	"gin-app/src/modules/users"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadDotEnv()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "app.db"
	}

	conn, err := db.Open(dbPath)
	if err != nil {
		log.Fatalf("db connection failed: %v", err)
	}
	sqlDB, err := conn.DB()
	if err != nil {
		log.Fatalf("db handle failed: %v", err)
	}
	defer sqlDB.Close()

	if err := migrate.Run(conn); err != nil {
		log.Fatalf("db migration failed: %v", err)
	}

	userRepo := users.NewSQLRepository(conn)
	userService := users.NewService(userRepo)
	userController := users.NewController(userService)

	todoRepo := todos.NewSQLRepository(conn)
	todoService := todos.NewService(todoRepo, userRepo)
	todoController := todos.NewController(todoService)

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	users.RegisterRoutes(router, userController)
	todos.RegisterRoutes(router, todoController)

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

