package main

import (
	"os"

	"github.com/flosch/pongo2/v5"
)

func main() {
	templateList := []string{"header", "alert", "footer"}
	contexts := []pongo2.Context{header("https://domain.com"), alert("title", "content"), nil}
	template, err := full_compile(templateList, contexts, html("Title here", "Example preheader"))
	if err != nil {
		panic(err)
	}
	os.WriteFile("output.html", []byte(template), 0644)
}
