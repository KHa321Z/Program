import os 
import sys
import time

cls = lambda : os.system("clear")

def sprint(text):
  for letter in text :
    sys.stdout.write(letter)
    sys.stdout.flush()
    time.sleep(0.04)

class Matrix():
  def __init__(self, rows, cols, name="A"):
    self.name = name
    self.rows = rows
    self.cols = cols
    self.order = (self.rows, self.cols)
    self.col_header = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    self.matrix = [[f"{str.lower(self.name)}{row}{col}" for col in range(self.cols)] for row in range(self.rows)]
  
  def print_matrix(self):
    print ()
    print (f"+{self.space}+")

    for line in self.matrix :
      print ("|", end="")
      print (*line, sep=" ", end="")
      print ("|")

    print (f"+{self.space}+")
    print ()

  def __repr__(self):
    print_matrix = f"+{self.space}+\n"

    for line in self.matrix :
      print_matrix += "|" + " ".join(line) + "|\n"

    print_matrix += f"+{self.space}+"

  def enter(self):
    self.space = ""

    for i in range((self.rows * 2) - 1) :
      self.space += " "

    for row in range(self.rows) :
      for col in range(self.cols) :
        self.print_matrix()

        self.matrix[row][col] = int (input (f"Enter Element in Cell {self.col_header[col]}{row}: "))

    self.print_matrix()

  def enter_data(self, elements):
    self.space = ""

    for i in range((self.rows * 2) - 1) :
      self.space += " "
    
    ind = 0

    for row in range(self.rows):
      for col in range(self.cols):
        self.matrix[row][col] = elements[ind]

        ind += 1
  
  def negative(self):
    new_matrix = Matrix(self.rows, self.cols)

    for row in range(self.rows) :
      for col in range(self.cols) :
        new_matrix[row][col] = self.matrix[row][col] * (-1)
    
    return (new_matrix)
  
  def transpose(self):
    new_matrix = Matrix(self.rows, self.cols)

    for col in range(self.cols) :
      new_matrix[0][col] = self.matrix[col][0]
    
    for row in range(self.rows) :
      new_matrix[row][0] = self.matrix[0][row]

    return (new_matrix)

  def minor(self, element_coords: tuple = (1, 1)):
    new_matrix = Matrix(self.rows - 1, self.cols - 1)
    elements = []

    for row in range(self.rows):
      for col in range(self.cols):
        if (((element_coords[0] - 1) == row) or ((element_coords[1] - 1) == col)):
          continue
        
        elements.append(self.matrix[row][col])

    new_matrix.enter_data(elements)
    
    
    return (new_matrix)

  def co_factor(self, element_coords: tuple):
    return (self.minor(element_coords) * ((-1) ^ (element_coords[0] + element_coords[1])))
  
  def adjoint(self):
    def two_by_two():
      new_matrix = Matrix(self.rows, self.cols)

      new_matrix[0][0] = self.matrix[1][1]
      new_matrix[0][1] = self.matrix[0][1] * (-1)
      new_matrix[1][0] = self.matrix[1][0] * (-1)
      new_matrix[1][1] = self.matrix[0][0]

      return (new_matrix)
    
    def three_by_three():
      pass
    
    def four_by_four():
      pass
    
    if (self.order == (2, 2)) :
      two_by_two()
    
    elif (self.order == (3, 3)) :
      three_by_three()

    elif (self.order == (4, 4)) :
      four_by_four()

  def determinant(self):
    determinant = 0

    for col in range(self.cols):
      print((self.co_factor(element_coords=(0, col)) * self.matrix[0][col]).matrix)
      determinant = sum(self.co_factor(element_coords=(0, col)) * self.matrix[0][col]) + determinant
    
    return (determinant)

    """for col in range(self.cols):
      determinant += (self.matrix[0][col] * self.co_factor(self.matrix[0][col]))
    
    return (determinant)

    return (sum(self.matrix[0][col] * ([self.co_factor(self.matrix[0][col])] for col in self.cols)))"""
  
  """def determinant(self):
    def two_by_two():
      deter_ = (self.matrix[0][0] * self.matrix[1][1]) - (self.matrix[0][1] * self.matrix[1][0])

      return (deter_)
    
    def three_by_three():
      #     [a  b  c]
      # A = [d  e  f]
      #     [g  h  i]
      # |A| = a(ei − fh) − b(di − fg) + c(dh − eg)

      deter_ = self.matrix[0][0] * ((self.matrix[1][1] * self.matrix[2][2]) - (self.matrix[1][2] * self.matrix[2][1])) - self.matrix[0][1] * ((self.matrix[1][0] * self.matrix[2][2]) - (self.matrix[1][2] * self.matrix[2][0])) + self.matrix[0][2] * ((self.matrix[1][0] * self.matrix[2][1]) - (self.matrix[1][1] * self.matrix[2][0]))

      return (deter_)
    
    def four_by_four():
      pass
    
    if (self.order == (2, 2)) :
      two_by_two()
    
    elif (self.order == (3, 3)) :
      three_by_three()
    
    elif (self.order == (4, 4)) :
      four_by_four()"""
  
  def mult_inverse(self):
    pass
  
  def __add__(self, second_mat):
    if (self.order != second_mat.order) :
      return ("These Matrices cannot be Added!")

    new_matrix = Matrix(self.rows, self.cols)

    for row in range(new_matrix.rows) :
      for col in range(new_matrix.cols) :
        new_matrix[row][col] = self.matrix[row][col] + second_mat[row][col]
    
    return (new_matrix)

  def __sub__(self, second_mat):
    if (self.order != second_mat.order) :
      return ("These Matrices cannot be Subtracted!")

    new_matrix = Matrix(self.rows, self.cols)

    for row in range(new_matrix.rows) :
      for col in range(new_matrix.cols) :
        new_matrix[row][col] = self.matrix[row][col] - second_mat[row][col]
    
    return (new_matrix)
  
  def __mul__(self, second_mat):
    if (type(second_mat) == int) :
      scalar_no = second_mat
      new_matrix = Matrix(self.rows, self.cols)

      for row in range(self.rows) :
        for col in range(self.cols) :
          new_matrix.matrix[row][col] = self.matrix[row][col]
          new_matrix.matrix[row][col] *= scalar_no
      
      return (new_matrix)

    elif (type(second_mat) == Matrix) :
      if (self.cols != second_mat.rows) :
        return ("These Matrices cannot be Multiplied!")
      
      new_matrix = Matrix(self.rows, second_mat.cols)

      ans = []
      result = 0
      second_row = 0
      second_col = 0
      product = 0

      for row in range(self.rows) :
        for col in range(self.cols * self.cols) :
          if (col == self.cols) :
            second_col = 0
            second_row += 1
            ans.append(result)
            result = 0

          product = self.matrix[row][second_col] * second_mat.matrix[second_col][second_row]
          result += product
          second_col += 1

        ans.append(result)
        result = 0
        second_col = 0
        second_row = 0

      ind = 0

      for row in range(new_matrix.rows) :
        for col in range(new_matrix.cols) :
          new_matrix[row][col] = ans[ind]
          ind += 1
      
      return (new_matrix)
    
    else :
      print ("You Can't Multiply These Two!")
  
  def __eq__(self, second_mat):
    return (self.matrix == second_mat.matrix)

data = [
  2, 4, 6, 
  1, 2, 7, 
  8, 3, 5
]

matrix = Matrix(2, 2, "A")
matrix.enter()
matrix.print_matrix()
print(matrix.determinant())
#print(matrix)