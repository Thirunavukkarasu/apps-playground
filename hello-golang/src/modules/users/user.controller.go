package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	service *Service
}

func NewController(service *Service) *Controller {
	return &Controller{service: service}
}

type createUserRequest struct {
	Name string `json:"name" binding:"required"`
}

func (c *Controller) CreateUser(ctx *gin.Context) {
	var req createUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}

	user, err := c.service.Create(ctx.Request.Context(), req.Name)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, user)
}

func (c *Controller) ListUsers(ctx *gin.Context) {
	users, err := c.service.List(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list users"})
		return
	}

	ctx.JSON(http.StatusOK, users)
}

