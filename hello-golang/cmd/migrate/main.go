package main

import (
	"log"
	"os"

	"gin-app/src/lib/config"
	"gin-app/src/lib/db"
	"gin-app/src/lib/migrate"
)

func main() {
	config.LoadDotEnv()

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

	log.Println("migrations applied")
}

