package routes

import (
	"github.com/acgtubio/bg-remover-wrapper/routes/remover"
	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/remove-bg", remover.HandleRemoveBackground)

	e.Logger.Fatal(e.Start(":8484"))
}
