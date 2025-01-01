CMAKE_FOLDER=cmake-build
CMAKE_FOLDER_DIST=cmake-build-dist
PWD=$(shell pwd)/
NB_PROC=$(shell nproc)
C_MAKE_OPTIONS=-DCMAKE_MAKE_PROGRAM=$(shell which ninja)

all: cli test


cli: build
	./$(CMAKE_FOLDER)/SqlParserCli

test: build
	./$(CMAKE_FOLDER)/SqlParserTests

ctest: build
	ctest --test-dir $(CMAKE_FOLDER)

build: cmake
	cmake --build $(PWD)$(CMAKE_FOLDER)

dir:
	mkdir $(CMAKE_FOLDER)

cmake:
	cmake -G Ninja -DCMAKE_BUILD_TYPE=Debug $(C_MAKE_OPTIONS) -S . -B $(CMAKE_FOLDER) -DDEV="on"
.PHONNY: cmake

dist:
	cmake -G Ninja -DCMAKE_BUILD_TYPE=Release $(C_MAKE_OPTIONS) -S . -B $(CMAKE_FOLDER_DIST)
	cmake --build $(CMAKE_FOLDER_DIST) -j $(NB_PROC)

clean:
	rm -rf $(CMAKE_FOLDER)
	rm -f test/*.out
	rm -f test/temp
	rm -f temp
