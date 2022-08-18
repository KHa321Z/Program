/*
Write a program such that it takes length and breadth of a rectangle and
prints the specified rectangle using “*”.
e.g. For Example if length = 5 and width = 4 then output would be
****
****
****
****
****
*/

#include <iostream>

using namespace std;

int length, breadth;

int main() {
    
    cout << "Enter Length : ";
    cin >> length;
    cout << endl << "Enter Breadth: ";
    cin >> breadth;
    cout << endl;
    
    for (int i = 0; i < length; i++) {
        for (int j = 0; j < breadth; j++)
            cout << "*";
        
        cout << endl;
    };

    return 0;
    
};
