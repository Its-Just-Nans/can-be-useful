package main

import (
	"fmt"
	"os"
)

func solve(table [][]int) {
	for j := 0; j < people; j++ {
		col := make([]int, candidates)
		for i := 0; i < candidates; i++ {
			col[i] = table[i][j]
		}
		//printCol(col)
		numCount := 0
		var numOfLine int
		var numOfCase int
		for count := 0; count < candidates; count++ {
			if col[count] == 1 || col[count] == -1 {
				numCount++
				numOfCase = col[count]
				numOfLine = count
			}
		}
		if numCount == 1 {
			space()
			printCol(col)
			fmt.Printf("there is a %d on line %d col %d\n", numOfCase, numOfLine, j)
			caseCheck(table, numOfLine, j)
		}
	}
	space()
	printTable(table)
}

func caseCheck(table [][]int, lineNumber int, colNumber int) {
	numOfCase := table[lineNumber][colNumber]
	destroySymbolOfLineExecptCol(table, lineNumber, colNumber, -numOfCase)
	space()
	printTable(table)
	checkSameOnLineExecpt(table, lineNumber, colNumber, numOfCase)
	space()
	printTable(table)
	for colCount := 0; colCount < people; colCount++ {
		if colCount != colNumber {
			destroySymbolOfColExecptLine(table, lineNumber, colCount, numOfCase)
		}
	}
	checkForZeroCol(table)
	space()
	printTable(table)
	check(table, lineNumber, colNumber, numOfCase)
}

func check(table [][]int, lineNumber int, colNumber int, numOfCase int) {
	for colCount := 0; colCount < people; colCount++ {
		if colCount != colNumber {
			if table[lineNumber][colCount] != numOfCase {
				antiSymbolCount := 0
				for lineCount := 0; lineCount < candidates; lineCount++ {
					if table[lineCount][colCount] == -numOfCase {
						antiSymbolCount++
					}
				}
				if antiSymbolCount == 0 {
					fmt.Printf("col %d n'a pas de %d\n", colCount, -numOfCase)
					panic("Impossible ")
				}
			}
		}
	}
	fmt.Print("Solution trouvée !!\n")
	os.Exit(0)
}

func checkForZeroCol(table [][]int) {
	for colNumber := 0; colNumber < people; colNumber++ {
		countOfZero := 0
		for lineNumber := 0; lineNumber < candidates; lineNumber++ {
			if table[lineNumber][colNumber] == 0 {
				countOfZero++
			}
		}
		if countOfZero == candidates {
			space()
			space()
			printTable(table)
			fmt.Printf("col %d vide\n", colNumber)
			panic("Impossible ")
		}
	}
}

func destroySymbolOfColExecptLine(table [][]int, lineNumber int, colNumber int, symbol int) {
	for lineCount := 0; lineCount < candidates; lineCount++ {
		if lineCount != lineNumber {
			if table[lineCount][colNumber] == symbol {
				table[lineCount][colNumber] = 0
			}
		}
	}
}

func destroySymbolOfLineExecptCol(table [][]int, lineNumber int, colNumber int, symbol int) {
	for colCount := 0; colCount < people; colCount++ {
		if colCount != colNumber {
			if table[lineNumber][colCount] == symbol {
				table[lineNumber][colCount] = 0
			}
		}
	}
}

func space() {
	fmt.Print("\n")
}

func checkSameOnLineExecpt(table [][]int, line int, col int, numOfCase int) {
	for colCount := 0; colCount < people; colCount++ {
		if col != colCount {
			value := table[line][colCount]
			if value == numOfCase {
				destroySymbolOfColExecptLine(table, line, colCount, -numOfCase)
			}
		}
	}
}

func checkSameOnLineExecptCol(table [][]int, line int, numOfCase int, col int) int {
	for colCount := 0; colCount < people; colCount++ {
		if colCount == col {
			continue
		} else {
			return colCount
		}
	}
	return 0
}

func fillLineWithZeroExecptCol(table [][]int, lineNumber int, col int) {
	if logMsg {
		fmt.Printf("Fill zeros in line %d\n", lineNumber)
	}
	for colCount := 0; colCount < people; colCount++ {
		if colCount == col {
			continue
		} else {
			table[lineNumber][colCount] = 0
		}
	}
}

func destroyColExceptLine(table [][]int, numCol int, line int) {
	for i := 0; i < candidates; i++ {
		if i != line {
			table[i][numCol] = 0
		}
	}
}

func destroyCol(table [][]int, numCol int) {
	if logMsg {
		fmt.Printf("Destroying col %d\n", numCol)
	}
	for i := 0; i < candidates; i++ {
		table[i][numCol] = 0
	}
}

func printCol(col []int) {
	for count := 0; count < candidates; count++ {
		fmt.Printf("%d ", col[count])
	}
	fmt.Print("\n")
}
