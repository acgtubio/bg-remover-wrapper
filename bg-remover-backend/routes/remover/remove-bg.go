package remover

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func HandleRemoveBackground(c echo.Context) error {
	return c.String(http.StatusOK, "Heyo successful")
}
