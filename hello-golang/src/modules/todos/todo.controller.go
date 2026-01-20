package todos

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	service *Service
}

func NewController(service *Service) *Controller {
	return &Controller{service: service}
}

type createTodoRequest struct {
	Title     string `json:"title" binding:"required"`
	Completed bool   `json:"completed"`
}

func (c *Controller) CreateTodo(ctx *gin.Context) {
	userID, ok := parseID(ctx.Param("id"))
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var req createTodoRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "title is required"})
		return
	}

	todo, err := c.service.Create(ctx.Request.Context(), userID, req.Title, req.Completed)
	if err != nil {
		if err == ErrUserNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, todo)
}

func (c *Controller) ListByUser(ctx *gin.Context) {
	userID, ok := parseID(ctx.Param("id"))
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	todos, err := c.service.ListByUser(ctx.Request.Context(), userID)
	if err != nil {
		if err == ErrUserNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list todos"})
		return
	}

	ctx.JSON(http.StatusOK, todos)
}

func parseID(value string) (int64, bool) {
	id, err := strconv.ParseInt(value, 10, 64)
	if err != nil || id <= 0 {
		return 0, false
	}
	return id, true
}

