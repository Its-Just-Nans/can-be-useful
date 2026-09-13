package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	Title       string   `json:"title" binding:"required"`
	Type        string   `json:"type" binding:"required"`
	Choices     []string `json:"choices" binding:"required"`
	Result      []int    `json:"result" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Lesson      string   `json:"lesson" binding:"required"`
}

type Quiz struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Description string     `json:"description" binding:"required"`
	Title       string     `json:"title" binding:"required"`
	Author      string     `json:"author" binding:"required"`
	Questions   []Question `json:"questions" binding:"required,dive"`
}

func addQuizRoutes(api *gin.RouterGroup) {
	api.GET("/quizzes", getQuizzes)
	api.GET("/quiz/:id", getQuiz)       // get quiz
	api.POST("/quiz", postQuiz)         // create a new quiz
	api.PATCH("/quiz/:id", patchQuiz)   // edit quiz
	api.DELETE("/quiz/:id", deleteQuiz) // delete quiz
	api.POST("/check/:id/:number", verifyQuiz)
}

// getAlbums responds with the list of all albums as JSON.
func getQuizzes(c *gin.Context) {
	quizzes := db_get() // TODO send back the length
	if len(quizzes) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []string{}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": quizzes})
}

func patchQuiz(c *gin.Context) {
	var newQuiz Quiz
	err := c.ShouldBindJSON(&newQuiz)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	id := c.Param("id")
	createdQuiz, err := db_update(newQuiz, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": createdQuiz, "infos": nil})
}

func postQuiz(c *gin.Context) {
	var newQuiz Quiz
	if err := c.ShouldBindJSON(&newQuiz); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	createdQuiz, err := db_set(newQuiz)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": createdQuiz, "infos": nil})
}

func contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func verifyQuiz(c *gin.Context) {
	// TODO change to questions
	var newResults []int
	if err := c.ShouldBindJSON(&newResults); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	if len(newResults) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": false, "infos": "No answers"})
		return
	}
	id := c.Param("id")
	quizInDB, err := db_getOne(id, false)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	questionNumber, err := strconv.Atoi(c.Param("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	if len(quizInDB.Questions) < questionNumber {
		c.JSON(http.StatusBadRequest, gin.H{"data": nil, "infos": "incorrect question number"})
		return
	}
	question := quizInDB.Questions[questionNumber]
	if question.Type == "radio" {
		if len(newResults) == 1 && newResults[0] == question.Result[0] {
			c.JSON(http.StatusOK, gin.H{"data": true})
			return
		} else {
			c.JSON(http.StatusOK, gin.H{"data": false})
			return
		}
	} else if question.Type == "checkbox" {
		var correctSolutions []int
		for _, oneValue := range newResults {
			if contains(question.Result, oneValue) {
				correctSolutions = append(correctSolutions, oneValue)
			}
		}
		if len(correctSolutions) == len(question.Result) && len(newResults) == len(question.Result) {
			c.JSON(http.StatusOK, gin.H{"data": true})
			return
		} else {
			if len(correctSolutions) == 0 {
				c.JSON(http.StatusOK, gin.H{"data": false})
				return
			} else {
				c.JSON(http.StatusOK, gin.H{"data": correctSolutions})
				return
			}
		}
	}
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getQuiz(c *gin.Context) {
	id := c.Param("id")
	quiz, err := db_getOne(id, true)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"data": nil, "infos": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": quiz})
}

func deleteQuiz(c *gin.Context) {
	id := c.Param("id")
	success, err := db_delete(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"data": success, "infos": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": success})
}
