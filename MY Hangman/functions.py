import time
import random
import camelcase
import games_list

def slow_printer(text):
  for i in range (len(text)) :
    print (text[i], end = "", flush = True)
    time.sleep (.06)

def hump(word):
  up = camelcase.CamelCase()
  return (up.hump(word))

def get_random_word(option, countries, animals):
  if (option in countries) :
    return random.choice(games_list.country_list)
  
  elif (option in animals) :
    return random.choice(games_list.animal_list)

def get_lives(difficulty, easy, medium, hard, random_word):
  if (difficulty in easy) :
    lives = len(random_word)
    return (lives)

  elif (difficulty in medium) :
    lives = len(random_word) - 1
    return (lives)

  elif (difficulty in hard) :
    lives = len(random_word) - 2
    return (lives)

def replacer(guess, random_word, so_far):
  new = ""

  for i in range (len(random_word)) :
    if (guess == random_word[i]) :
      new += guess
    
    else :
      new += so_far[i]
  
  return (new)
