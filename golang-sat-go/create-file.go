package main

import (
	"io/ioutil"
	"log"
	"math/rand"
	"strconv"
	"time"
)

func createFile() {
	rand.Seed(time.Now().UnixNano())
	var tableau string = ""
	for i := 0; i < candidates; i++ {
		for j := 0; j < people; j++ {
			var value = rand.Intn(max-min) + min
			if value >= 0 {
				tableau += " "
			}
			tableau += strconv.Itoa(value) + " "
		}
		tableau += "\n"
	}
	// fmt.Print(tableau)
	err := ioutil.WriteFile(nameOfFile, []byte(tableau), 0644)
	if err != nil {
		log.Fatal(err)
	}
}
