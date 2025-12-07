#include <vector>
#include <iostream>

using namespace std;

// do not modify this​​​​​​‌​​‌​​​‌​‌‌​‌​​‌​​​​‌‌​‌‌ structure
typedef struct
{
    double x;
    double y;
} Point;

class Pi
{
public:
    // approximate pi using the given points
    static double approx(vector<Point> &pts)
    {
        int count = 0;
        for (int i = 0; i < pts.size(); i++)
        {
            double x = pts[i].x;
            double y = pts[i].y;
            double sum = x * x + y * y;
            if (sum <= 1)
            {
                count++;
            }
        }
        double temp = (1.0 * count) / (1.0 * pts.size());
        return temp * 4;
    }
};

int main()
{
    vector<Point> rands;
    for (int i = 0; i < 100000; i++)
    {
        Point p;
        p.x = rand() / (double)RAND_MAX; // 0 <= x <= 1
        p.y = rand() / (double)RAND_MAX; // 0 <= y <= 1
        rands.push_back(p);
    }
    cout << Pi::approx(rands); // ~3.14
}