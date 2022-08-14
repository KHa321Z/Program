import os
import numpy
import pandas as pd
import tabula

if (os.path.isfile("table.csv")):
  print("Csv exists!")
  print("Attempting to Delete It")
  
  try:
    os.remove("table.csv")
  except:
    print("Could not Delete the File!")
    exit()

  print("Successfully Deleted the File!")

def sorter(column):
  longest_roll_no = 9
  longest_name = 0
  longest_result = 7
  longest_grade = 0
  sep_blanks = 5

  ROLL_NO_INDEX = 0
  NAME_INDEX = 1
  RESULT_INDEX = 2
  STATUS_INDEX = 3

  for i in range(len(column)):
    student = column[i]
    ending_index = 6
    name = ""
    marks = ""
    grade = ""

    for char in student[6:]:
      if (not (char.isalpha() or char == " ")):
        break

      name += char
      ending_index += 1

    name = name.strip()

    if (name[-4:] == "PASS"):
      name = name[:-4]
    elif (name[-6:] == "ABSENT"):
      name = name[:-6]
      marks = "ABSENT"
    elif (name[-18:] == "MARKS NOT IMPROVED"):
      name = name[:-18]
      marks = "ABSENT"
    else:
      name = name
    
    if (marks != "ABSENT"):
      for char in student[ending_index:]:
        if (not (char.isdigit() or char == " ")):
          break

        marks += char
        ending_index += 1
      
      marks = marks.strip()
      marks = marks
    
      grade = student[ending_index]
      if ((len(student) - 1) != ending_index and student[ending_index + 1] == "+"): grade += "+"

    longest_name = len(name) if (len(name) > longest_name) else longest_name
    longest_grade = len(grade) if (len(grade) > longest_grade) else longest_grade

    table.append([student[:6], name, marks, grade])

table = []
#table.append(["ROLL NO.", "NAME", "RESULT", "STATUS"])

df = tabula.read_pdf("./Gazette.pdf", pages=11)
df = df[0]

for column in df:
  column = df[column].dropna()
  column.index = list(range(len(column)))
  sorter(column)

dataframe = pd.DataFrame([i[1:] for i in table], index=[i[0] for i in table], columns=["NAME", "RESULT", "STATUS"])
dataframe.to_csv("./t.csv")

"""with open("file.txt", "r") as f:
  pages = f.readlines()
  pages = [int(i[5:-1]) for i in pages]
  print(pages)
  f.close()

for i in pages:

  print(i)

  df = tabula.read_pdf("./Gazette.pdf", pages=i)
  df = df[0]

  try:

    first_column = df["ROLL NONAMERESULT\rSTATUS"].dropna()
    #first_column.to_csv("./tab.csv")

    first_column.index = list(range(len(first_column)))

    sorter()

    second_column = df["ROLL NONAMERESULT\rSTATUS.1"].dropna()
    #second_column.to_csv("./tab.csv")

    second_column.index = list(range(len(second_column)))

    sorter()

    third_column = df["ROLL NONAMERESULT\rSTATUS.2"].dropna()
    #third_column.to_csv("./tab.csv")

    third_column.index = list(range(len(third_column)))
    
    sorter()

  except KeyError:
    with open("file1.txt", "a") as f:
      f.write(f"page {i}\n")
      f.close()
  
  except:
    with open("file1.txt", "a") as f:
      f.write(f"page {i} Error other than Column\n")
      f.close()

print(len(table))
print(table[-1])"""

"""
for i in table:
  for j in range(len(i)):
    if (j == 0):
      string = i[j].ljust(longest_roll_no)
    elif (j == 1):
      string = i[j].ljust(longest_name)
    elif (j == 2):
      string = i[j].ljust(longest_result)
    else:
      string = i[j].ljust(longest_grade)

    print(string, end=(" " * sep_blanks))

  print()
"""