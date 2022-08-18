/*
Write a C++ program that takes as input 10 numbers and prints the largest and second
largest of the numbers.
*/

#include <iostream>

using namespace std;

int currentNo;
int largestNo = 0, secondLargestNo = 0;

int main() {
    
    for (int i = 0; i < 10; i++) {
        
        cout << "Enter Integer: ";
        cin >> currentNo;
        cout << endl;
        
        if (currentNo > largestNo) {
            
            secondLargestNo = largestNo;
            largestNo = currentNo;
            
        } else if (currentNo > secondLargestNo)
            secondLargestNo = currentNo;
            
    };
    
    cout << endl << "The Largest Number is " << largestNo;
    cout << endl << "The Second Largest Number is ";
    cout << secondLargestNo;

    return 0;
    
};
