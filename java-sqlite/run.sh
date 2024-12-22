#!/bin/bash

rm test.db
javac Test.java
java -classpath ".:sqlite-jdbc-3.36.0.3.jar" Test
