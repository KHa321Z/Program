class Matrix():
  def __init__(self, rows, cols, name="A"):
    self.name = name

    self.rows = rows
    self.cols = cols
    self.order = (self.rows, self.cols)
    
    self.col_header = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    self.matrix = [[f"{str.lower(self.name)}{row}{col}" for col in range(self.cols)] for row in range(self.rows)]
    self.index = -1

  def __iter__(self):
    return (self)

  def __next__(self):
    self.index += 1

    if (self.index >= len(self.matrix)):
      self.index = -1
      raise StopIteration
    
    else:
      return (self.matrix[self.index])

  def __repr__(self):
    pass

  def __pos__(self):
    pass

  def __neg__(self):
    return (-1 * self)

  def __add__(self, other_matrix):
    if (self.order != other_matrix.order) :
      return ("These Matrices cannot be Added!")

    for row in range(new_matrix.rows) :
      for col in range(new_matrix.cols) :
        self.matrix[row][col] += other_matrix.matrix[row][col]
    
    return (self)

  def __sub__(self, other_matrix):
    if (self.order != other_matrix.order) :
      return ("These Matrices cannot be Subtracted!")
    
    return (self + (-other_matrix))

  def __mul__(self, other_mat_or_int):
    if (type(other_mat_or_int) == int) :
      scalar_no = other_mat_or_int

      for row in range(self.rows) :
        for col in range(self.cols) :
          self.matrix[row][col] *= scalar_no
      
      return (self)

    elif (type(other_mat_or_int) == Matrix) :
      if (self.cols != other_mat_or_int.rows) :
        return ("These Matrices cannot be Multiplied!")
      
      new_matrix = Matrix(self.rows, other_mat_or_int.cols)

      for row in range(new_matrix.rows) :
        for col in range(new_matrix.cols) :
          new_matrix.matrix[row][col] = sum([(self.matrix[row][i] * other_mat_or_int.matrix[i][col]) for i in range(self.cols)])

      return (new_matrix)
    
    else :
      print ("You Can't Multiply These Two!")

  def __rmul__(self, scalar_no):
    if (type(scalar_no) == int) :

      for row in range(self.rows) :
        for col in range(self.cols) :
          self.matrix[row][col] *= scalar_no

      return (self)
    
    else :
      print ("You Can't Multiply These Two!")

  def __eq__(self, other_matrix):
    return (self.matrix == second_mat.matrix)
  
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
  
  def transpose(self):
    new_matrix = Matrix(self.cols, self.rows)

    for row in range(self.rows) :
      for col in range(self.cols) :
        new_matrix.matrix[row][col] = self.matrix[col][row]

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

    return (new_matrix.matrix[0][0] if (new_matrix.order == (1, 1)) else new_matrix.determinant())

  def co_factor(self, element_coords: tuple):
    return ((-1) ** (element_coords[0] + element_coords[1])) * self.minor(element_coords)
  
  def adjoint(self):
    new_matrix = Matrix(self.rows, self.cols)

    for row in range(self.rows):
      for col in range(self.cols):
        new_matrix.matrix[row][col] = self.co_factor((row + 1, col + 1))

    return (new_matrix.transpose())

  def determinant(self):
    determinant = 0

    for col in range(self.cols):
      determinant += (self.matrix[0][col] * self.co_factor(element_coords=(1, col + 1)))
    
    return (determinant)
  
  def mult_inverse(self):
    new_matrix = Matrix(self.rows, self.cols)

    for row in range(new_matrix.rows):
      for col in range(new_matrix.cols):
        if (row == col) :
          new_matrix.matrix[row][col] = 1
          continue

        new_matrix.matrix[row][col] = 0

    element_coords = [[(row, col) for col in range(self.cols)] for row in range(self.rows)]

    for row in range(self.rows):
      for col in range(self.cols):
        if (element_coords[row][col][0] == element_coords[row][col][1]) :
          diagonal_element = element_coords[row].pop(col)
          element_coords[row].insert(0, diagonal_element)

    for r in range(self.rows):
      for c in range(self.cols):
        row, col = element_coords[r][c]
        print(row, col)

        for i in range(self.cols):
          if (c == 0) :
            new_matrix.matrix[row][i] = new_matrix.matrix[row][i] / self.matrix[row][col]

          else :
            new_matrix.matrix[row][i] -= (self.matrix[row][col] * new_matrix.matrix[row][0])

    return (new_matrix)

matrix = Matrix(3, 3, "A")
matrix.enter()
print(matrix.mult_inverse().matrix)