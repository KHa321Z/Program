/*
Write a program that calculates the product of all even integers form 1 to 15.
*/

#include <iostream>

using namespace std;

long result = 1;

int main() {
    
    for (int i = 1; i <= 15; i++) result *= i;
    
    cout << "Result of Multiplication is: " << result;

    return 0;
}
