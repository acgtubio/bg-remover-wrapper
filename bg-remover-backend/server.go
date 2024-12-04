package main

import (
	"github.com/acgtubio/bg-remover-wrapper/routes"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	routes.RegisterRoutes(e)
}
