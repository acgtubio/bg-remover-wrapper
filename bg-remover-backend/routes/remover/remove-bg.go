package remover

import (
	"bytes"
	"encoding/base64"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
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

		fileName := uuid.NewString() + ".png"
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

	for _, fileName := range fileNames {
		cmd := exec.Command(
			"python",
			"/Users/u025/Documents/Coding/bg-remover/remover/remove_bg.py",
			"/Users/u025/Documents/Coding/bg-remover/bg-remover-backend/"+fileName.osFileName,
		)
		var out bytes.Buffer
		var stderr bytes.Buffer

		cmd.Stderr = &stderr
		cmd.Stdout = &out
		if err := cmd.Run(); err != nil {
			log.Fatal(err.Error() + ": " + stderr.String())
			return err
		}
	}

	images := []string{}
	for _, fileName := range fileNames {
		inputFilePath := "/Users/u025/Documents/Coding/bg-remover/bg-remover-backend/" + filepath.Base(fileName.osFileName)
		filePath := inputFilePath + "-out" + filepath.Ext(fileName.osFileName)

		fileBytes, err := os.ReadFile(filePath)

		if err != nil {
			return err
		}

		encodedImage := base64.StdEncoding.EncodeToString(fileBytes)
		images = append(images, encodedImage)

		err = os.Remove(filePath)
		err = os.Remove(inputFilePath)

		if err != nil {
			log.Fatal(err.Error() + ": Error deleting file.")
		}
	}

	// Has a problem when not set.
	c.Response().Header().Set("Access-Control-Allow-Origin", "*")

	return c.JSON(http.StatusOK, map[string]interface{}{
		"images": images,
	})
}
