#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <unistd.h>

using namespace std;

int compute_multiples_sum(int n)
{
    int sum = 0;
    for (int i = 0; i < n; i++)
    {
        if (i % 3 == 0 || i % 5 == 0 || i % 7 == 0)
        {
            sum += i;
        }
    }
    return sum;
}

int main(int argc, char const *argv[])
{
    cout << compute_multiples_sum(11); // 40
    cout << endl;
    cout << compute_multiples_sum(15); // 66
    return 0;
}
