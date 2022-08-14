import pandas as pd
import tabula

def sorter(column):
  PASS = "PASS"
  FAIL = "FAIL"
  SPECIAL_EXAM = "SPECIAL EXAM"
  ABSENT = "ABSENT"
  FEE_DEFAULTER = "FEE DEFAULTER"
  UMC_CASE = "UMC CASE"
  ELIGIBILITY = "ELIGIBILITY"
  NOT_ELIGIBLE = "NOT ELIGIBLE"
  ROLL_NO_CANCELLED = "ROLL NO. CANCELLED"

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
    
    elif (name[-4:] == FAIL):
      name = name[:-4]
      marks = FAIL

    elif (name[-6:] == ABSENT):
      name = name[:-6]
      marks = ABSENT

    elif (name[-18:] == "MARKS NOT IMPROVED"):
      name = name[:-18]
      marks = ABSENT

    elif (name[-13:] == FEE_DEFAULTER):
      name = name[:-13]
      marks = FEE_DEFAULTER

    elif (name[-8:] == UMC_CASE):
      name = name[:-8]
      marks = UMC_CASE

    elif (name[-11:] == ELIGIBILITY):
      name = name[:-11]
      marks = ELIGIBILITY

    elif (name[-12:] == NOT_ELIGIBLE):
      name = name[:-12]
      marks = NOT_ELIGIBLE

    elif (name == "ROLL NO CANCELLEDROLL NO CANCELLED"):
      name = ROLL_NO_CANCELLED

    else:
      name = name
    
    if not(marks == FAIL or marks == ABSENT or marks == FEE_DEFAULTER or marks == UMC_CASE or marks == ELIGIBILITY or name == ROLL_NO_CANCELLED or marks == NOT_ELIGIBLE):
      for char in student[ending_index:]:
        if (not (char.isdigit() or char == " ")):
          break

        marks += char
        ending_index += 1
      
      marks = marks.strip()
      marks = marks

      print(student)
      print(ending_index)
      grade = student[ending_index]
      if ((len(student) - 1) != ending_index and student[ending_index + 1] == "+"): grade += "+"

    table.append([student[:6], name, marks, grade])

table = []
"""pages_to_read = []

with open("pages.txt", "r") as f:
  pages = f.readlines()
  pages = list(map(int, [page[5:-1] for page in pages]))
  f.close()

pages_to_read = [page for page in list(range(11, 992)) if (page not in pages)]

for page in pages_to_read:
  print(page)"""

df = tabula.read_pdf("./Gazette.pdf", pages=992)
df = df[0]

for column in df:
  column = df[column].dropna()
  column.index = list(range(len(column)))
  sorter(column)

dataframe = pd.DataFrame([i[1:] for i in table], index=[i[0] for i in table], columns=["NAME", "RESULT", "STATUS"])
dataframe.to_csv("./t1.csv")