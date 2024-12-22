package main

import (
	"os"
)

//const people int = 10
var people int
var candidates int
var nameOfFile string
var logMsg bool = false

const min int = -1
const max int = 2 // it is 1

func main() {
	people = 10
	candidates = 10
	nameOfFile = "file.txt"
	verbose, showTable := parseArgs(os.Args[1:])
	table := readFile()
	if showTable {
		printTable(table)
	}
	if verbose {
		printInfoPeople(table)
	}
	solve(table)
}
