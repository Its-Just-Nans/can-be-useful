package main

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

type Options struct {
	ClientID     string `json:"clientID"`
	ClientSecret string `json:"clientSecret"`
	ConfigURL    string `json:"configURL"`
	RootURL      string `json:"rootURL"`
	StaticFiles  string `json:"staticFiles"`
	State        string `json:"state"`
	Database     string `json:"LocationDatabase"`
	DbUsername   string `json:"DbUsername"`
	DbPassword   string `json:"DbPassword"`
	DbHost       string `json:"DbHost"`
	Backend404   bool   `json:"Backend404"`
}

func parseOptions(jsonLocation string) *Options {
	jsonFile, err := os.Open(jsonLocation)
	if err != nil {
		panic(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	defer jsonFile.Close()
	var options Options
	json.Unmarshal(byteValue, &options)
	return &options
}
