package main

import "fmt"

const possibleState = 2

func printInfo() {
	fmt.Printf("People : %d\n", people)
	fmt.Printf("Candidates : %d\n", candidates)
	fmt.Printf("Name of file : %s\n", nameOfFile)
	fmt.Printf("Log message : %t\n", logMsg)
}

func printInfoPeople(table [][]int) {
	for round := 0; round < possibleState; round++ {
		for j := 0; j < people; j++ {

			if round == 0 {
				fmt.Printf("People %d want :", j)
			} else {
				fmt.Printf("People %d don't want :", j)
			}
			for i := 0; i < candidates; i++ {
				value := table[i][j]
				if round == 0 && value == 1 {
					fmt.Printf(" %d", i)
				} else if round == 1 && value == -1 {
					fmt.Printf(" %d", i)
				}
			}
			fmt.Print("\n")
		}
	}
}
