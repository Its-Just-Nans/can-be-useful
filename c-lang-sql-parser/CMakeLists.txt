cmake_minimum_required(VERSION 3.12)

project(c-sql-parser LANGUAGES CXX C)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(DEV)
        add_compile_options("-g")
        add_compile_options("-DDEBUG")
endif(DEV)

file( GLOB_RECURSE all_c ./src/*.c ./src/**/*.c)
file( GLOB_RECURSE all_h ./src/*.h ./src/**/*.h )

add_library(SqlParserLib ${all_c} ${all_h})
add_executable(SqlParserCli main.c)
target_link_libraries(SqlParserCli SqlParserLib)

# tests parts
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)


file( GLOB_RECURSE all_tests_cpp ./tests/*.cpp )
add_executable(SqlParserTests ${all_tests_cpp})
target_link_libraries(SqlParserTests PRIVATE SqlParserLib GTest::gtest_main)

include(CTest)
add_test (NAME MyTest COMMAND SqlParserTests)