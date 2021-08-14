import os
import time
import random
import functions as func

used_letters = []
positive_words = ["Good Job!", "How can you Guess THAT!", "Awesome!"]
negative_words = ["Booo!", "You Stink!", "You Loser!"]
countries, animals = ["countries", "1"], ["animals", "2"]
easy, medium, hard = ["easy", "1"], ["medium", "2"], ["hard", "3"]
option_levels = countries + animals
difficulty_levels = easy + medium + hard
space = " "
option = None
difficulty = None
play_again = "YES"

print("WELCOME TO THE HANGMAN")
print ()
input ("Press ENTER To Start")
print ()

while (play_again == "YES") or (play_again == "Y") :
  while (option not in option_levels):
    if (option is not None) :
      print ("Choose From the Given Options. \nNot From Your Imagination.")
      print ()
    
    print (
      f"Word Type:\n"
      f"1. Countries\n"
      f"2. Animals\n"
    )

    option = input ("Choose Option: ").lower()
    print ()
    os.system("clear")

  random_word = func.get_random_word(option, countries, animals)
  so_far = "-" * len(random_word)

  if (space in random_word) :
    so_far = func.replacer(space, random_word, so_far)
  
  while (difficulty not in difficulty_levels) :
    if (difficulty is not None):
      print ("Choose From the Given Difficulties. \nNot From Your Imagination.")
      print ()
    print (
      f"Difficulty Level:\n"
      f"1. Easy\n"
      f"2. Medium\n"
      f"3. Hard\n"
    )

    difficulty = input ("Choose Difficulty: ").lower()
    print ()
    os.system("clear")

  lives = func.get_lives(difficulty, easy, medium, hard, random_word)

  while (lives != 0) and (so_far != random_word) :
    print ()
    print (
      f"{func.hump(so_far)}\n"
      f"Lives = {lives}\n"
    )
    print ("Used Letters:", ", ".join(used_letters))
    print ()
    guess = input ("Guess a Letter: ")
    time.sleep (.5)

    while (len(guess) > 1) or (len(guess) == 0) :
      print ()
      print ("Choose YOUR Guess CORRECTLY!!!")
      guess = input ("Guess a Letter: ")
      time.sleep (.5)

    if (guess in used_letters) or (guess in so_far) :
      print (
        f"You have Already Entered this Letter.\n"
        f"{func.hump(so_far)}\n"
        f"Lives = {lives}\n"
      )
      print ("Used Letters:", ", ".join(used_letters))
      print ()
      guess = input ("Guess a Letter: ")
      time.sleep (.5)
    
    os.system("clear")

    if (guess in random_word) :
      print ()
      func.slow_printer("..... Updating Word .....")
      print ()
      time.sleep (.25)
      print (random.choice(positive_words))
      
      so_far = func.replacer(guess, random_word, so_far)

    else :
      print ()
      func.slow_printer("..... Updating Word .....")
      print ()
      time.sleep (.25)
      print (random.choice(negative_words))
      used_letters.append(guess)
      lives -= 1

  os.system("clear")
  print ()
  func.slow_printer("Calculating Result.....")
  time.sleep (.25)

  if (lives == 0) :
    print (
      f"\nWhy are YOU EVEN Playing this Game!!!\n"
      f"This Game is NOT for NOOBS Like You!\n"
      f"You Should Play The Game With a Lower Difficulty.\n"
      f"The Word Was: {func.hump(random_word)}\n"
    )
    print ("Used Letters:", ", ".join(used_letters))

  else :
    print (
      f"\nYou are a PRO!\n"
      f"Play Another Game With a Higher Difficulty.\n"
      f"\n"
      f"The Word Was: {func.hump(random_word)}\n"
      f"Lives = {lives}\n"
    )
    print ("Used Letters:", ", ".join(used_letters))

  print ()
  print ("Do You want to Play Again? Y/N")
  play_again = input ().upper()

print ()
print ("Goodbye!")
print ()
input ("Press ENTER to Leave")
os.exit()