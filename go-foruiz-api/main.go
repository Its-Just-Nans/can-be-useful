package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"time"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// var db *gorm.DB
var db *mongo.Client

func main() {
	options := parseOptions("config.json")
	startDB(options)
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := db.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	// routing
	router := gin.Default()
	router.SetTrustedProxies(nil)
	router.Use(CORSMiddleware())
	if options.StaticFiles == "" {
		log.Fatal("No staticFiles path specified")
	}
	router.Use(static.Serve("/", static.LocalFile(options.StaticFiles, true)))
	oauth2Config, state, verifier := startOIDC(options)
	makeAPIrouter(router, oauth2Config, state, verifier, options)
	router.NoRoute(func(c *gin.Context) {
		if options.Backend404 {
			file := filepath.Join(options.StaticFiles, "404.html")
			router.LoadHTMLGlob(file)
			c.HTML(404, "404.html", gin.H{})
		} else {
			location := url.URL{Path: "/", RawQuery: url.Values{"page": []string{"404"}}.Encode()}
			c.Redirect(http.StatusFound, location.RequestURI())
		}
	})

	router.Run("localhost:8000")
}

func startDB(foruizOptions *Options) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	var err error
	url := fmt.Sprintf("mongodb://%s:%s@%s", foruizOptions.DbUsername, foruizOptions.DbPassword, foruizOptions.DbHost)
	db, err = mongo.Connect(ctx, options.Client().ApplyURI(url))
	if err != nil {
		panic("failed to connect database")
	}
	ctx, cancel = context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	// Check the connection
	err = db.Ping(ctx, readpref.Primary())
	if err != nil {
		panic("Failed to connect database")
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
