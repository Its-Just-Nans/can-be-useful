package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// routing
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := filepath.Dir(ex)
	pages := filepath.Join(exPath, "..", "build")
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	fmt.Println(pages)
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(CORSMiddleware())
	router.Use(static.Serve("/", static.LocalFile(pages, true)))
	router.NoRoute(func(c *gin.Context) {
		location := url.URL{Path: "/", RawQuery: url.Values{"page": []string{"404"}}.Encode()}
		c.Redirect(http.StatusFound, location.RequestURI())
	})
	api := router.Group("/api")
	addRoutes(api)
	router.Run("localhost:8000")
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
