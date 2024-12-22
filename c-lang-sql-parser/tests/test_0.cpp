#include <gtest/gtest.h>
#include <string>
#include <string>
#include <fstream>
#include <streambuf>

extern "C"
{
#include "../src/unserialize.h"
}

void test_files_equal(std::string file_name_1, std::string file_name_2)
{
    std::ifstream outputFileName(file_name_1);
    std::string outputFile((std::istreambuf_iterator<char>(outputFileName)),
                           std::istreambuf_iterator<char>());

    std::ifstream checkFileName(file_name_2);
    std::string checkFile((std::istreambuf_iterator<char>(checkFileName)),
                          std::istreambuf_iterator<char>());

    ASSERT_EQ(outputFile, checkFile);
}

TEST(simple_SQL, BasicAssertions)
{
    std::string input = "../tests/test_0.sql";
    std::string output = "../tests/test_0_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_0.json");
}

TEST(SQL_with_inner_query, BasicAssertions)
{
    std::string input = "../tests/test_1.sql";
    std::string output = "../tests/test_1_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_1.json");
}

TEST(SQL_with_inner_query_and_other_params, BasicAssertions)
{
    std::string input = "../tests/test_2.sql";
    std::string output = "../tests/test_2_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_2.json");
}

TEST(SQL_with_double_inner_query, BasicAssertions)
{
    std::string input = "../tests/test_3.sql";
    std::string output = "../tests/test_3_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_3.json");
}

TEST(SQL_with_double_select, BasicAssertions)
{
    std::string input = "../tests/test_4.sql";
    std::string output = "../tests/test_4_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_4.json");
}

TEST(SQL_with_double_select_inner_query, BasicAssertions)
{
    std::string input = "../tests/test_5.sql";
    std::string output = "../tests/test_5_test.json";
    int qodjfhsgdjfk = unserializeFileToFile((char *)input.c_str(), (char *)output.c_str());
    test_files_equal(output, "../tests/test_5.json");
}