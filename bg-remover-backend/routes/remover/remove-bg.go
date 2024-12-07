package remover

import (
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type File2Process struct {
	originalFileName string
	osFileName       string
}

func HandleRemoveBackground(c echo.Context) error {
	form, err := c.MultipartForm()

	if err != nil {
		return err
	}

	files := form.File["images"]
	fileNames := []File2Process{}

	for _, file := range files {
		src, err := file.Open()

		if err != nil {
			return err
		}

		defer src.Close()

		fileName := uuid.NewString() + filepath.Ext(file.Filename)
		dst, err := os.Create(fileName)
		if err != nil {
			return err
		}
		defer dst.Close()

		fileNames = append(fileNames, File2Process{
			originalFileName: file.Filename,
			osFileName:       fileName,
		})

		if _, err := io.Copy(dst, src); err != nil {
			return err
		}
	}

	return c.String(http.StatusOK, "Oweyoweyo")
}
