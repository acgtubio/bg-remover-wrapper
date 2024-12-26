package remover

import (
	"bytes"
	"encoding/base64"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type File2Process struct {
	originalFileName string
	osFileName       string
}

func HandleRemoveBackground(c echo.Context) error {
	python_dir := os.Getenv("PYTHON_DIR")
	img_dir := os.Getenv("IMG_DIR")

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

		if !isImage(src) {
			log.Println(file.Filename + "is not an image, skipping.")
			continue
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
			python_dir+"/remove_bg.py",
			img_dir+fileName.osFileName,
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
		inputFilePath := img_dir + filepath.Base(fileName.osFileName)
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
func isImage(file multipart.File) bool {
	// Read the first 512 bytes of the file to determine its content type
	buffer := make([]byte, 512)
	_, err := file.Read(buffer)
	if err != nil {
		log.Println("Error reading file:", err)
		return false
	}

	// Reset file pointer after reading
	if _, err := file.Seek(0, 0); err != nil {
		log.Println("Error resetting file pointer:", err)
		return false
	}

	// Detect the content type of the file
	contentType := http.DetectContentType(buffer)

	// Check if the content type starts with "image/"
	return strings.HasPrefix(contentType, "image/")
}
