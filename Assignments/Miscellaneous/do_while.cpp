/*
Implement Code using do_while loop
int main() {
    int SENTINEL = -999;
    int _inputValue;
    int _add;
    int _numberOfInputs = 0;
    
    cin >> _inputValue;
    
    while (_inputValue != SENTINEL) {
        
        _add += _inputValue;
        _numberOfInputs++;
        
        cin >> _inputValue;
        
    };
    
    cout << _numberOfInputs << endl;
    cout << _add;

    return 0;
}
*/

#include <iostream>

using namespace std;

int main() {
    int SENTINEL = -999;
    int _inputValue;
    int _add;
    int _numberOfInputs = 0;
    
    do {
        
        cin >> _inputValue;
        
        _add += _inputValue;
        _numberOfInputs++;
        
    } while (_inputValue != SENTINEL);
    
    cout << _numberOfInputs << endl;
    cout << _add;

    return 0;
};
