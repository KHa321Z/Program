/*
Write a program that reads in a student’s grade and prints his average as follows:
If the grade is A then it prints the average is between 90 and 100.
If the grade is B then it prints the average is between 80 and 89.
If the grade is C then it prints the average is between 70 and 79.
If the grade is D then it prints the average is between 60 and 69.
In all other cases the average is less than 60.
But the grades can only be from A to H (both in caps and small). For all other alphabets
entered as input the output should be “There is no such grade in this university…the letter
entered is WRONG!”
Implement his program through
switch statement
*/

#include <iostream>

using namespace std;

char grade;

int main()
{

  cout << "Enter Grade: ";
  cin >> grade;
  cout << endl;

  switch (grade)
  {
    case 'A': 
    case 'a':
      cout << "The average is between 90 and 100";
      break;

    case 'B':
    case 'b':
      cout << "The average is between 80 and 89";
      break;

    case 'C':
    case 'c':
      cout << "The average is between 70 and 79";
      break;

    case 'D':
    case 'd':
      cout << "The average is between 60 and 69";
      break;

    case 'E':
    case 'e':
    case 'F':
    case 'f':
    case 'G':
    case 'g':
    case 'H':
    case 'h':
      cout << "The average is less than 60";
      break;

    default:
      cout << "There is no such grade in this university...the letter entered is WRONG!";
  };

  return 1;

};