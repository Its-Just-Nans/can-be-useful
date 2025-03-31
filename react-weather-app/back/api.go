package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Entry struct {
	Id     string   `json:"id"`
	Values []string `json:"values"`
}

func addRoutes(api *gin.RouterGroup) {
	api.GET("/locations", getLocation)
	api.POST("/locations", setLocations)
}

// postAlbums adds an album from JSON received in the request body.
func setLocations(c *gin.Context) {
	var locations []string
	if err := c.ShouldBindJSON(&locations); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	params := c.Request.URL.Query()["id"]
	if len(params) == 0 {
		c.JSON(http.StatusOK, make([]string, 0))
		return
	}
	founded := false
	entries := getData()
	for i := 0; i < len(entries); i++ {
		if entries[i].Id == params[0] {
			entries[i].Values = locations
			founded = true
		}
	}
	if !founded {
		entries = append(entries, Entry{Id: params[0], Values: locations})
	}
	saveData(entries)
	c.JSON(http.StatusOK, locations)
}

func saveData(data []Entry) {
	file, _ := json.MarshalIndent(data, "", " ")
	_ = ioutil.WriteFile("data.json", file, 0644)
}

func getData() []Entry {
	jsonFile, err := os.Open("data.json")
	if err != nil {
		fmt.Println(err)
	}
	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var entries []Entry
	json.Unmarshal(byteValue, &entries)
	return entries
}

func getLocation(c *gin.Context) {
	params := c.Request.URL.Query()["id"]
	if len(params) == 0 {
		c.JSON(http.StatusOK, make([]string, 0))
		return
	}
	entries := getData()
	for i := 0; i < len(entries); i++ {
		if entries[i].Id == params[0] {
			if len(entries[i].Values) == 0 {
				c.JSON(http.StatusOK, make([]string, 0))
			} else {
				c.JSON(http.StatusOK, entries[i].Values)
			}
			return
		}
	}
	c.JSON(http.StatusOK, make([]string, 0))
}
