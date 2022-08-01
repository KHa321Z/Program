/*
A palindrome is a number or a text phrase that reads the same backwards as forwards.
For example each of the following five-digit integers are palindromes: 12321, 44444,
11611. Write a program that reads in a five-digit integer and determines whether or not it
is a palindrome. (Hint: use the modulus and division operators to separate the number
into its individual digits).
*/

#include <iostream>

using namespace std;

int originalDigit;
int digit;
int digit1;
int digit2;
int digit3;
int digit4;
int digit5;

int main()
{
  
  cout << "Enter 5-digit Integer: ";
  cin >> originalDigit;
  cout << endl;

  digit = originalDigit;

  digit1 = digit % 10;
  digit /= 10;

  digit2 = digit % 10;
  digit /= 10;

  digit3 = digit % 10;
  digit /= 10;

  digit4 = digit % 10;
  digit /= 10;

  digit5 = digit % 10;
  digit /= 10;

  if ((digit1 == digit5) && (digit2 == digit4))
    cout << originalDigit << " is a Palindrome";

  else 
    cout << originalDigit << " is not a Palindrome";

};