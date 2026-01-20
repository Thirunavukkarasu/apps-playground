APP_NAME=gin-app
PORT?=8080
DB_PATH?=app.db

.PHONY: run dev test tidy fmt lint migrate clean-db

run:
	go run ./cmd/api

dev:
	@command -v gin >/dev/null 2>&1 || { echo "gin not installed. Run: go install github.com/codegangsta/gin@latest"; exit 1; }
	gin --appPort $(PORT) --port 3000 run ./cmd/api

test:
	go test ./...

tidy:
	go mod tidy

fmt:
	go fmt ./...

lint:
	@command -v golangci-lint >/dev/null 2>&1 || { echo "golangci-lint not installed. Run: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"; exit 1; }
	golangci-lint run

migrate:
	DB_PATH=$(DB_PATH) go run ./cmd/migrate

clean-db:
	rm -f $(DB_PATH)

