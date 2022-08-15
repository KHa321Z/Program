/*
Factorial of a nonnegative integer n is written as n! (pronounced as “n factorial”) and is
defined as follows:
n! = n . (n … 1) . (n … 2) . . .1 or (product of all positive integers from n to 1)
n! = 1 (for n = 0)
for example , 5! = 5 . 4 . 3 . 2 . 1
Write a program that reads a nonnegative integer and prints its factorial.
*/

#include <iostream>

using namespace std;

long factorial (long nonNegInt) {
    
    return (nonNegInt == 1 || nonNegInt == 0) ? (nonNegInt) : (nonNegInt * factorial(nonNegInt - 1));
        
};

long nonNegativeInt;

int main() {
    
    cout << "Enter Non Negative Integer: ";
    cin >> nonNegativeInt;
    
    cout << endl << factorial(nonNegativeInt);

    return 0;
    
};
