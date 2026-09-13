package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

func startOIDC(options *Options) (oauth2.Config, string, *oidc.IDTokenVerifier) {
	provider, err := oidc.NewProvider(context.Background(), options.ConfigURL)
	if err != nil {
		panic(err)
	}

	clientID := options.ClientID
	clientSecret := options.ClientSecret

	redirectURL := options.RootURL + "/api/callback"
	// Configure an OpenID Connect aware OAuth2 client.
	oauth2Config := oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Endpoint:     provider.Endpoint(),                            // Discovery returns the OAuth2 endpoints.
		Scopes:       []string{oidc.ScopeOpenID, "profile", "email"}, // "openid" is a required scope for OpenID Connect flows.
	}

	oidcConfig := &oidc.Config{
		ClientID: clientID,
	}
	verifier := provider.Verifier(oidcConfig)
	return oauth2Config, options.State, verifier
}

func callBackHandler(oauth2Config oauth2.Config, state string, verifier *oidc.IDTokenVerifier, options *Options) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.URL.Query().Get("state") != state {
			c.AbortWithError(http.StatusBadRequest, errors.New("state did not match"))
			return
		}
		oauth2Token, err := oauth2Config.Exchange(context.Background(), c.Request.URL.Query().Get("code"))
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, errors.New("Failed to exchange token: "+err.Error()))
			return
		}
		rawIDToken, ok := oauth2Token.Extra("id_token").(string)
		if !ok {
			c.AbortWithError(http.StatusInternalServerError, errors.New("o id_token field in oauth2 token"))
			return
		}
		idToken, err := verifier.Verify(context.Background(), rawIDToken)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, errors.New("Failed to verify ID Token: "+err.Error()))
			return
		}

		resp := struct {
			OAuth2Token   *oauth2.Token
			IDTokenClaims *json.RawMessage // ID Token payload is just JSON.
		}{oauth2Token, new(json.RawMessage)}

		if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		location := url.URL{Path: "http://localhost:9000", RawQuery: url.Values{"accessToken": []string{oauth2Token.AccessToken}, "refreshToken": []string{oauth2Token.RefreshToken}}.Encode()}
		c.Redirect(http.StatusFound, location.RequestURI())
	}
}

func checkAuth(verifier *oidc.IDTokenVerifier) gin.HandlerFunc {
	return func(c *gin.Context) {
		rawAccessToken := strings.Join(c.Request.Header["Authorization"], "")
		if len(rawAccessToken) == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_code": "NO_AUTHORIZATION_HEADER"}})
			c.Abort()
			return
		}
		parts := strings.Split(rawAccessToken, " ")
		if len(parts) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_code": "EMPTY_JWT"}})
			c.Abort()
			return
		}
		_, err := verifier.Verify(context.Background(), parts[1])
		if err != nil {
			if strings.HasPrefix(fmt.Sprint(err), "oidc: token is expired") {
				c.IndentedJSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_code": "EXPIRED_JWT"}})
				c.Abort()
				return
			}
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_message": err.Error()}})
			c.Abort()
			return
		}
		c.Set("infos", "")
		parsed, _ := base64.RawURLEncoding.DecodeString(parts[1])
		var data struct {
			Email string `json:"email" binding:"required"`
		}
		if json.Unmarshal(parsed, &data) == nil {
			c.Set("infos", data.Email)
		}
		c.Next()
	}
}

func auth(oauth2Config oauth2.Config, state string, verifier *oidc.IDTokenVerifier) gin.HandlerFunc {
	return func(c *gin.Context) {
		rawAccessToken := strings.Join(c.Request.Header["Authorization"], "")
		if len(rawAccessToken) == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"redirect": oauth2Config.AuthCodeURL(state)}})
			c.Abort()
			return
		}
		parts := strings.Split(rawAccessToken, " ")
		if len(parts) != 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_code": "EMPTY_JWT"}})
			c.Abort()
			return
		}
		_, err := verifier.Verify(context.Background(), parts[1])
		if err != nil {
			if strings.HasPrefix(fmt.Sprint(err), "oidc: token is expired") {
				c.IndentedJSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_code": "EXPIRED_JWT"}})
				c.Abort()
				return
			}
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"data": nil, "infos": gin.H{"error_message": err.Error()}})
			c.Abort()
			return
		}
		parsed, _ := base64.RawURLEncoding.DecodeString(parts[1])
		c.IndentedJSON(http.StatusOK, gin.H{"data": parsed, "infos": nil})
	}
}

func refresh(oauth2Config oauth2.Config, state string, verifier *oidc.IDTokenVerifier) gin.HandlerFunc {
	return func(c *gin.Context) {
		var accessToken struct {
			AccessToken  string `json:"accessToken" binding:"required"`
			RefreshToken string `json:"refreshToken" binding:"required"`
		}
		if err := c.ShouldBindJSON(&accessToken); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
			return
		}
		ts := oauth2Config.TokenSource(context.Background(), &oauth2.Token{RefreshToken: accessToken.RefreshToken})
		newToken, err := ts.Token()
		if err != nil {
			c.IndentedJSON(http.StatusOK, gin.H{"data": nil, "infos": "ERROR_TOKEN"})
		}
		if accessToken.AccessToken == newToken.AccessToken {
			fmt.Print("\nsame\n")
		}
		c.IndentedJSON(http.StatusOK, gin.H{"data": gin.H{"accessToken": newToken.AccessToken, "refreshToken": newToken.RefreshToken}, "infos": nil})
	}
}
