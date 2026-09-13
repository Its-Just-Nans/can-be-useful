package main

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// getAlbums responds with the list of all albums as JSON.
func db_get() []Quiz {
	var quizzes []Quiz
	coll := db.Database("DB_NAME").Collection("quizzes")
	mongoOptions := options.Find().SetProjection(bson.D{
		{Key: "questions", Value: 0},
	})
	cursor, err := coll.Find(context.TODO(), bson.D{}, mongoOptions)
	cursor.All(context.TODO(), &quizzes)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			return quizzes
		}
		panic(err)
	}
	return quizzes
}

func db_getOne(id_str string, hideAnswers bool) (Quiz, error) {
	var quiz Quiz
	objectId, err := primitive.ObjectIDFromHex(id_str)
	if err != nil {
		return quiz, errors.New("invalid id")
	}
	coll := db.Database("DB_NAME").Collection("quizzes")
	if hideAnswers {
		mongoOptions := options.FindOne().SetProjection(bson.D{
			{Key: "questions.result", Value: 0},
		})
		err = coll.FindOne(context.TODO(), bson.D{{Key: "_id", Value: objectId}}, mongoOptions).Decode(&quiz)
	} else {
		err = coll.FindOne(context.TODO(), bson.D{{Key: "_id", Value: objectId}}).Decode(&quiz)
	}
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			return quiz, errors.New("no documents")
		}
		panic(err)
	}
	return quiz, nil
}

// postAlbums adds an album from JSON received in the request body.
func db_set(newQuiz Quiz) (Quiz, error) {
	newQuiz.CreatedAt = time.Now()
	newQuiz.UpdatedAt = time.Now()
	coll := db.Database("DB_NAME").Collection("quizzes")
	result, err := coll.InsertOne(context.TODO(), newQuiz)
	if err != nil {
		panic(err)
	}
	id := result.InsertedID.(primitive.ObjectID).Hex()
	return db_getOne(id, false)
}

// postAlbums adds an album from JSON received in the request body.
func db_update(newQuiz Quiz, id string) (Quiz, error) {
	newQuiz.UpdatedAt = time.Now()
	mongoId, err := primitive.ObjectIDFromHex("5eb3d668b31de5d588f42a7a")
	if err != nil {
		return newQuiz, errors.New("BAD_ID")
	}
	filter := bson.D{{Key: "_id", Value: mongoId}}
	update := bson.D{{Key: "$set", Value: newQuiz}}
	coll := db.Database("DB_NAME").Collection("quizzes")
	result, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return newQuiz, errors.New("INSERTION_ERROR")
	}
	if result.ModifiedCount == 1 {
		return db_getOne(id, false)
	}
	return newQuiz, errors.New("NOT_MODIFIED")
}

func db_delete(id_str string) (bool, error) {
	id, err := primitive.ObjectIDFromHex(id_str)
	if err != nil {
		return false, err
	}
	coll := db.Database("DB_NAME").Collection("quizzes")
	filter := bson.D{{Key: "_id", Value: id}}
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		return false, err
	}
	return true, nil
}
