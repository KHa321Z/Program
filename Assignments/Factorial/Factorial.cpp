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
  
    if (nonNegativeInt < 0) {
        
        cout << "The Entered Integer is a Negative Integer!";
        return 0;
        
    };
    
    cout << endl << factorial(nonNegativeInt);

    return 0;
    
};

/*
int factorial = 1;
int currentInteger;
int nonNegativeInteger;

int main()
{

  cout << "Enter Non-Negative Integer: ";
  cin >> nonNegativeInteger;
  cout << endl;

  currentInteger = nonNegativeInteger;

  while (currentInteger >= 1)
    factorial *= currentInteger--;

  cout << "Factorial of " << nonNegativeInteger << " is: " << factorial;

  return 1;

};
*/
