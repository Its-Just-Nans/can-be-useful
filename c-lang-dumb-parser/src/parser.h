#include <string>
#include <fstream>

class Parser
{
public:
    Parser(std::string input);
    Parser &s();
    Parser &NisNum();
    Parser &NisChar(char a);
    bool eval();
    std::string val();
    Parser &r();
    Parser &readWhileChar(char a);

private:
    void setCond(bool cond);
    std::string _filename;
    std::string _buff;
    bool _cond;
    bool _use_cond;
    std::ifstream _file;
    int _index{0};
};