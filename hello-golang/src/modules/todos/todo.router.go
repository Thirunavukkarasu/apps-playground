package todos

import "github.com/gin-gonic/gin"

func RegisterRoutes(router *gin.Engine, controller *Controller) {
	router.POST("/users/:id/todos", controller.CreateTodo)
	router.GET("/users/:id/todos", controller.ListByUser)
}

