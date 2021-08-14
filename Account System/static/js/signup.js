var userTaken = " This Username is Already Taken!";
var userField = document.getElementById("usernm").value;
var passField = document.getElementById("pass").value;
var conPassField = document.getElementById("conpass").value;
var usernameSpan = document.getElementById("nmfield");
var passwordSpan = document.getElementById("passfield");
var confirmPassSpan = document.getElementById("conpassfield");

if (waarning) alert("Did you think I didn't have a Backup! Try Again! Your Username or Password is Invalid!!!");

document.getElementById("forms").addEventListener("submit", () => {
  if (users.includes(userField) || [...passField].some(char => char != char.toLowerCase() && char == char.toUpperCase()) || [...passField].some(char => char == char.toLowerCase() && char != char.toUpperCase()) || [...passField].some(char => isNaN(char * 1)) || (passField.length < 6) || (passField != conPassField)) { alert("Your Username or Password is Invalid!"); return false; }
})

document.getElementById("usernm").addEventListener("input", () => {
  if (users.includes(userField) && !usernameSpan.innerHTML.includes(userTaken)) usernameSpan.innerHTML = userTaken;
  
  if (!users.includes(userField) && usernameSpan.innerHTML.includes(userTaken)) usernameSpan.innerHTML = "";
})

document.getElementById("pass").addEventListener("input", () => {
  passwordSpan.innerHTML = (passField.length < 6) ? "Your Password should contain atleast 6 characters!" : "";

  if ([...passField].some(char => char == char.toLowerCase() && char != char.toUpperCase()) && [...passField].some(char => char != char.toLowerCase() && char == char.toUpperCase()) && [...passField].some(char => !isNaN(char * 1))) passwordSpan.innerHTML = "";
  else passwordSpan.innerHTML = (passwordSpan.innerHTML == "") ? "Your Password must Contain 1 Uppercase and 1 Lowercase Alphabet and 1 Digit!" : "You Password must contain atleast 6 characters, 1 Uppercase and 1 Lowercase Alphabet and 1 Digit!";
})

document.getElementById("conpass").addEventListener("input", () => {
  confirmPassSpan.innerHTML = (passField == conPassField) ? "" : "Your Passwords do not Match!"
})