package main

import (
	"errors"
	"os"
	"path/filepath"

	"github.com/flosch/pongo2/v5"
)

func full_compile(templateList []string, contexts []pongo2.Context, htmlContext pongo2.Context) (string, error) {
	template, err := templates_compiler(templateList, contexts)
	if err != nil {
		return "", err
	}
	templateStart, err2 := template_compiler("html-start", htmlContext)
	if err2 != nil {
		return "", err2
	}
	templateEnd, err2 := template_compiler("html-end", nil)
	if err2 != nil {
		return "", err2
	}
	return templateStart + template + templateEnd, nil
}

func templates_compiler(templateList []string, context []pongo2.Context) (string, error) {
	out := ""
	for i, oneTemplate := range templateList {
		formatted, err := template_compiler(oneTemplate, context[i])
		if err != nil {
			return "", err
		}
		out += formatted
	}
	return out, nil
}

func template_compiler(oneTemplate string, context pongo2.Context) (string, error) {
	extension := ".html"
	templatePath := filepath.Join("templates", oneTemplate+extension)
	if _, err := os.Stat(templatePath); errors.Is(err, os.ErrNotExist) {
		return "", err
	}
	template := pongo2.Must(pongo2.FromFile(templatePath))
	formatted, err := template.Execute(context)
	if err != nil {
		return "", err
	}
	return formatted, nil
}
