package main

import (
	"time"

	"github.com/flosch/pongo2/v5"
)

func header(url string) pongo2.Context {
	return pongo2.Context{
		"URL":           url,
		"LOGO_OPEN_TAB": "http://localhost:8080/open_in_new.svg"}      // TODO upload of internet /assets/ folder and change url
}

func alert(name string, content string) pongo2.Context {
	return pongo2.Context{"ALERT_NAME": name, "ALERT_CONTENT": content}
}

func invite(name string, url string) pongo2.Context {
	return pongo2.Context{"NAME": name, "URL": url}
}

func recovery(url string) pongo2.Context {
	return pongo2.Context{"URL": url}
}

func subscription(title string, info string, url string) pongo2.Context {
	return pongo2.Context{"Title": title, "Info": info, "URL": url}
}

func welcome(name string, url string) pongo2.Context {
	return pongo2.Context{"NAME": name, "URL": url}
}

func html(title string, preheader string) pongo2.Context {
	return pongo2.Context{"TITLE": title, "PREHEADER": preheader}
}

func pdm(siteName string) pongo2.Context {
	currentTime := time.Now()
	date := currentTime.Format("2006-01-02")
	return pongo2.Context{"SITE_NAME": siteName, "DATE": date,
		"graphs": []pongo2.Context{
			{"src": "https://picsum.photos/200/200?random=1"},
			{"src": "https://picsum.photos/200/200?random=2"},
			{"src": "https://picsum.photos/200/200?random=3"},
			// {"src": "https://picsum.photos/200/200?random=4"},
		},
		"BAD_ASSETS":     []pongo2.Context{{"name": "asset 1", "href": "link", "date": "22/04/2022"}, {"name": "asset 2", "href": "link", "date": "10/04/2022"}},
		"HIGHEST_ASSETS": []pongo2.Context{{"name": "asset 1", "href": "link", "status": "90%", "color": "red"}, {"name": "asset 2", "href": "link", "status": "60%"}},
		"LATEST_EVENTS":  []pongo2.Context{{"name": "asset 1", "href": "link", "date": "22/04/2022", "desc": "New reference"}, {"name": "asset 2", "href": "link", "date": "10/04/2022"}},
	}
}
