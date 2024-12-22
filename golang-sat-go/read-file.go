package main

import (
	"fmt"
	"log"
	"os"
)

func readFile() [][]int {
	reader, err := os.Open(nameOfFile)
	if err != nil {
		log.Fatal(err)
	}
	defer reader.Close()
	tableau := make([][]int, candidates)
	for i := 0; i < candidates; i++ {
		tableau[i] = make([]int, people)
		for j := 0; j < people; j++ {
			value := 0
			fmt.Fscan(reader, &value)
			tableau[i][j] = value
		}
		fmt.Fscanln(reader)
	}
	return tableau
}
