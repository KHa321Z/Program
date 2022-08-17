/*
Using a while loop implement a program that keeps on taking integer input from the user
and terminates as soon as a character is typed.
*/

#include <iostream>

using namespace std;

int inputVar;

int main() {
    
    cout << "Enter Integer: ";
    
    while (cin >> inputVar) 
        cout << endl << "Re-Enter Integer: ";
        
    cout << endl << "Program Terminated!";

    return 0;
    
};
