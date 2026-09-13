package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net/http"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
)

// https://stackoverflow.com/questions/48855122/keycloak-adaptor-for-golang-application
// https://stackoverflow.com/questions/53550321/keycloak-gatekeeper-aud-claim-and-client-id-do-not-match/53627747#53627747

func makeAPIrouter(router *gin.Engine, oauth2Config oauth2.Config, state string, verifier *oidc.IDTokenVerifier, options *Options) {
	api := router.Group("/api")
	api.GET("/auth", auth(oauth2Config, state, verifier))
	api.POST("/refresh", refresh(oauth2Config, state, verifier))
	api.GET("/callback", callBackHandler(oauth2Config, state, verifier, options))
	api.Use(checkAuth(verifier))
	api.GET("/me", getInfos)
	addQuizRoutes(api)
}

type User struct {
	Email string `json:"email" binding:"required"`
}

func getInfos(c *gin.Context) {
	infos := c.GetString("infos")
	if infos != "" {
		c.IndentedJSON(http.StatusOK, gin.H{"data": nil})
	} else {
		h := sha256.New()
		h.Write([]byte(infos))
		hashed := hex.EncodeToString(h.Sum(nil))
		// TODO get from mongo

		coll := db.Database("DB_NAME").Collection("users")
		var user User
		err := coll.FindOne(context.TODO(), bson.D{{Key: "mail", Value: hashed}}).Decode(&user)

		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusOK, gin.H{"data": nil, "infos": errors.New("no documents")})
				return
			}
			panic(err)
		}
		c.JSON(http.StatusOK, gin.H{"data": user, "infos": nil})
	}
}
