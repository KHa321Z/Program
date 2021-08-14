import os
import string
from replit import db
from flask import Flask, url_for, redirect, request, render_template

"""
class User():
  def __init__(self, username, password, id_num):
    self.username = username
    self.password = password
    self.id_num = id_num
  
  @classmethod
  def validator(cls, username, password, confirm_password):
    if ((username not in db.keys()) and (len(password) >= 6) and any(i.isupper() for i in password) and any(i.islower() for i in password) and any(i.isdigit() for i in password) and (password == confirm_password)): 
      return True
    
    return False

  @classmethod
  def encryptor(cls, password):
    encrypted_characters = os.environ.get("ENCRYPTED")
    characters = string.ascii_lowercase + string.ascii_uppercase + string.digits

    return ("".join([encrypted_characters[characters.index(char)] if (char in characters) else (char) for char in password]))

  def database_storer(self):
    User.validator(self.username, self.password)
"""

app = Flask(__name__)

def validator(username, password, confirm_password):
  if ((username not in db.keys()) and (len(password) >= 6) and any(i.isupper() for i in password) and any(i.islower() for i in password) and any(i.isdigit() for i in password) and (password == confirm_password)): 
    return True
  
  return False

def encryptor(password):
  encrypted_characters = os.environ.get("ENCRYPTED")
  characters = string.ascii_lowercase + string.ascii_uppercase + string.digits

  return ("".join([encrypted_characters[characters.index(char)] if (char in characters) else (char) for char in password]))

@app.route("/")
def home():
  return render_template("home.html")

@app.route("/<name>/")
def success(name):
  return f"<h1>Hi {name}!</h1>"

@app.route("/signup", methods=["POST", "GET"])
def signup():
  if request.method == "POST":
    username = request.form["username"]
    password = request.form["password"]
    confirm_password = request.form["confirm"]

    if (validator(username, password, confirm_password)):
      db[username] = encryptor(password)
      return render_template("created.html")
    
    else:
      return render_template("signup.html", users=[i for i in db.keys()], warning=True)
  
  else:
    return render_template("signup.html", users=[i for i in db.keys()], warning=False)

@app.route("/login", methods=["POST", "GET"])
def login():
  if request.method == "POST":
    username = request.form["username"]
    password = request.form["password"]

    if ((username in db.keys()) and (db[username] == encryptor(password))):
      return redirect(url_for("success", name=username))
    
    else:
      return render_template("login.html", warning=True)
  
  else:
    return render_template("login.html", warning=False)

app.run(host="0.0.0.0", port=5050, debug=True)