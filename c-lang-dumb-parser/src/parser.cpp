
#include "./parser.h"
#include <iostream>

Parser::Parser(std::string input)
    : _filename{input}
{
    _file.open(_filename);
    if (!_file)
    {
        std::cout << "ERROR FILE" << std::endl;
    }
}

void Parser::setCond(bool a)
{
    if (_use_cond)
    {
        if (a)
        {
            _cond = true;
        }
        else
        {
            _cond = false;
            _use_cond = false;
        }
    }
}

Parser &Parser::NisNum()
{
    char a;
    _file.get(a);
    if (a != EOF)
    {
        _buff.push_back(a);
        if (isdigit(a))
        {
            setCond(true);
            return *this;
        }
    }
    setCond(false);
    return *this;
}

Parser &Parser::NisChar(char test)
{
    char a;
    _file.get(a);
    if (a != EOF)
    {
        _buff.push_back(a);
        if (a == test)
        {
            setCond(true);
            return *this;
        }
    }
    setCond(false);
    return *this;
}

Parser &Parser::readWhileChar(char a)
{
    char temp;
    _buff = "";
    _file.get(temp);
    while (temp != EOF && temp != a)
    {
        _buff.push_back(temp);
        _file.get(temp);
    }
    setCond(true);
    return *this;
}

Parser &Parser::s()
{
    if (!_file.is_open())
    {
        _file.open(_filename);
    }
    _use_cond = true;
    if (_file)
    {
        _index = _file.tellg();
        _buff = "";
        setCond(true);
    }
    else
    {
        setCond(false);
    }
    return *this;
}

bool Parser::eval()
{
    return _cond;
}
std::string Parser::val()
{
    return _buff;
}

Parser &Parser::r()
{
    _file.clear();
    _file.seekg(_index);
    return s();
}