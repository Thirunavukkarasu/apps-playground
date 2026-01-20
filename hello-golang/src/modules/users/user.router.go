package users

import "github.com/gin-gonic/gin"

func RegisterRoutes(router *gin.Engine, controller *Controller) {
	router.POST("/users", controller.CreateUser)
	router.GET("/users", controller.ListUsers)
}

