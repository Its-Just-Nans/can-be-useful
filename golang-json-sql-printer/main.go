package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

// User struct which contains a name
// a type and a list of social links
type Object struct {
	Type   string   `json:"type"`
	Value  string   `json:"value"`
	Params []Object `json:"params"`
}

func main() {
	// Open our jsonFile
	jsonFile, err := os.Open("request.json")
	// if we os.Open returns an error then handle it
	if err != nil {
		fmt.Println(err)
	}
	// defer the closing of our jsonFile so that we can parse it later on
	defer jsonFile.Close()

	// read our opened xmlFile as a byte array.
	byteValue, _ := ioutil.ReadAll(jsonFile)

	// we initialize our Users array
	var obj Object

	// we unmarshal our byteArray which contains our
	// jsonFile's content into 'users' which we defined above
	if err := json.Unmarshal(byteValue, &obj); err != nil {
		panic(err)
	}
	// we iterate through every user within our users array and
	// print out the user Type, their name, and their facebook url
	// as just an example
	print(unserialize(&obj, 0))
	print("\n")

}

func printSpace(stringToAdd *string, number int) {
	*stringToAdd += strings.Repeat(" ", 4*number)
}

func unserialize(obj *Object, subRequest int) string {
	a := ""
	if obj.Type == "REQUEST" {
		a += "("
		if len(obj.Params) > 0 {
			for _, v := range obj.Params {
				a += unserialize(&v, subRequest+1)
			}
		}
		printSpace(&a, subRequest)
		a += ")"
	}
	if obj.Type == "SELECT" {
		a += "\n"
		printSpace(&a, subRequest)
		a += "SELECT "
		if len(obj.Params) > 0 {
			len := len(obj.Params) - 1
			for index, v := range obj.Params {
				a += unserialize(&v, subRequest)
				if index != len {
					a += ", "
				}
			}
		}
		a += "\n"
	}
	if obj.Type == "FROM" {
		printSpace(&a, subRequest)
		a += "FROM "
		if len(obj.Params) > 0 {
			for _, v := range obj.Params {
				a += unserialize(&v, subRequest)
			}
		}
		a += "\n"
	}
	if obj.Type == "WHERE" {
		printSpace(&a, subRequest)
		a += "WHERE "
		if len(obj.Params) > 0 {
			for _, v := range obj.Params {
				a += unserialize(&v, subRequest)
			}
		}
		a += "\n"
	}
	if map[string]bool{"AND": true, "OR": true, "EQUAL": true}[obj.Type] {
		if len(obj.Params) == 2 {
			operator := map[string]string{"AND": "AND", "OR": "OR", "EQUAL": "="}[obj.Type]
			a += unserialize(&obj.Params[0], subRequest) + " " + operator + " " + unserialize(&obj.Params[1], subRequest)
		}
	}
	if obj.Type == "VALUE" {
		return obj.Value
	}
	return a
}
