#include <gtest/gtest.h>
#include <string>
#include <string>
#include <fstream>
#include <streambuf>
#include <iostream>
#include "../src/parser.h"

TEST(test, BasicAssertions)
{
    bool res = true;
    Parser p("./tests/test.toml");
    if (p
            .s()
            .readWhileChar('=')
            .eval())
    {
        std::cout << "string: >" << p.val() << "< is" << std::endl;
        // do noting
    }
    else
    {
        res = false;
    }
    if (p
            .s()
            .NisChar('t')
            .NisChar('r')
            .NisChar('u')
            .NisChar('e')
            .eval())
    {
        std::cout << "string: >" << p.val() << "< is valid" << std::endl;
        // do noting
    }
    else
    {
        res = false;
    }
    ASSERT_EQ(res, true);
}
