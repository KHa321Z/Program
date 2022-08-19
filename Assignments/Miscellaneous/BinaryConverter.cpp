/*
Write a program to convert binary number into decimal number. Take binary number
from user as input and out put the decimal number. You may ask user to enter the number
of bits in the binary number. Your program should be generic, and I should be able to
enter binary number of any lenght.
Example:
Enter number of bits: 4
Enter the binary number: 1001
Decimal equivalent is: 9
*/

#include <iostream>
#include <bits/stdc++.h>

using namespace std;

char inputValue;
int noOfBits, binaryDigit; 
int binaryNumber = 0;
int decimalNumber = 0;

int main() {
    
    cout << "Enter No. of Bits: ";
    cin >> noOfBits;
    cout << endl << "Enter Binary Number: ";
    cin.ignore(100, '\n');
    
    for (noOfBits; noOfBits > 0; noOfBits--) {
        
        cin.get(inputValue);
        binaryDigit = inputValue - '0';
        
        binaryNumber += binaryDigit * pow(10, noOfBits - 1);
        decimalNumber += binaryDigit * pow(2, noOfBits - 1);
        
    };
    
    cout << endl << "The Decimal equivalent of " << binaryNumber << " is " << decimalNumber;

    return 0;
    
};
