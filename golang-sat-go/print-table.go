package main

import "fmt"

func printTable(table [][]int) {
	for i := 0; i < candidates; i++ {
		for j := 0; j < people; j++ {
			val := table[i][j]
			if val >= 0 {
				fmt.Print(" ")
			}
			fmt.Printf("%d ", val)
		}
		fmt.Printf("\n")
	}
}
