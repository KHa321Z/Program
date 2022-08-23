/*
An integer number is said to be perfect number if its factors including 1 (but not the number itself) sum to the number. For example, 6 is a perfect number because 1+2+3=6. Write a function perfect that determines if parameter number is a perfect number, and returns a boolean value true if number is perfect other wise returns false. Use this function in a program that prints perfect numbers between 1 and 1000.
Note: Don’t take any input from user
bool perfect(int number);
void main()
{
//print perfect numbers between 1 and 1000 by calling
//perfect(number) as many times as required
}
*/

#include <iostream>
#include <cmath>

using namespace std;

bool perfect(int number) {
    
    int result = 0;
    
    for (int j = 1; j < number; j++) 
        if ((number / j) == ((float)number / (float)j))
            result += j;
            
    return (result == number);
    
};

int main() {
    
    for (int i = 2; i < 1000; i++)
        if (perfect(i))
            cout << i << ", ";

    return 0;
    
};
