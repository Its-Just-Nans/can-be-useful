package main

import (
	"strconv"
)

func parseArgs(args []string) (bool, bool) {
	generate, verbose, showTable, verbose2 := false, false, false, false
	for index, oneArg := range args {
		if oneArg == "-p" {
			people, _ = strconv.Atoi(args[index+1])
		}
		if oneArg == "-c" {
			candidates, _ = strconv.Atoi(args[index+1])
		}
		if oneArg == "-g" {
			generate = true
		}
		if oneArg == "-v" {
			verbose = true
		}
		if oneArg == "-t" {
			showTable = true
		}
		if oneArg == "-e" {
			verbose2 = true
		}
		if oneArg == "-f" {
			nameOfFile = args[index+1]
		}
		if oneArg == "-l" {
			logMsg = true
		}
	}
	if generate {
		createFile()
	}
	if verbose {
		printInfo()
	}
	return verbose2, showTable
}
