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
Implement this program through if-else statements
*/

#include <iostream>

using namespace std;

char grade;

int main()
{

  cout << "Enter Grade: ";
  cin >> grade;
  cout << endl;

  if ((grade == 'A') || (grade == 'a'))
    cout << "The average is between 90 and 100";

  else if ((grade == 'B') || (grade == 'b'))
    cout << "The average is between 80 and 89";

  else if ((grade == 'C') || (grade == 'c'))
    cout << "The average is between 70 and 79";

  else if ((grade == 'D') || (grade == 'd'))
    cout << "The average is between 60 and 69";

  else if ((grade == 'E') || (grade == 'e') || (grade == 'F') || (grade == 'f') || (grade == 'G') || (grade == 'g') || (grade == 'H') || (grade == 'h'))
    cout << "The average is less than 60";

  else
    cout << "There is no such grade in this university...the letter entered is WRONG!";

  return 1;

};