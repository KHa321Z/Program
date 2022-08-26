/*
Write a program that prompts the user to enter a year and then determines whether it is a leap year or not. Your program should continue till the user enters the character ‘Y’.
Write three functions according to the following description:
1. getYear has no formal parameters, asks the user to enter a year and returns an integer value that is assigned to the integer variable year.
2. isLeap has an integer formal parameter year, determines whether the year is a leap year and returns the Boolean value true if the year is a leap year and false if it is not. A year is a leap year if it is divisible by 4 but is not divisible by 100 except when divisible by 400. (the year 2000 was leap year)
3. moreData has no formal parameters and returns a char value taken from…
*/

#include <iostream>

using namespace std;

int getYear () {
    
    int year;
    
    cout << "Enter a Year: ";
    cin >> year;
    cout << endl;
    
    return (year);
    
};

bool isLeap (int year) {
    
    return ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) ?  (true) : (false);
    
};

// char moreData () {};

char promptChar;
int year;

int main() {
    
    do {
        
        cout << "Please Enter 'Y' to Find Leap Year: ";
        cin >> promptChar;
        cout << endl;
        
    } while (promptChar != 'Y');
    
    year = getYear();
    
    if (isLeap(year)) 
        cout << "Year " << year << " is a Leap Year!";
    else
        cout << "Year " << year << " is not a Leap Year!";

    return 0;
}
