import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

"""df = pd.read_csv("special_exam.csv")
roll_numbers = list(df["ROLL NO."])"""

"""chrome_options = Options()
chrome_options.add_argument("--headless")

driver = webdriver.Chrome(options=chrome_options)
driver.get("https://www.biselahore.com/Inter_A21.html")

print()
print()
print(driver.title)
print()
print()"""

BISE_WEBSITE = r"https://www.biselahore.com/Inter_A21.html"

driver = webdriver.Chrome()
driver.get(BISE_WEBSITE)

browser.find_element_by_tag_name('body').send_keys(Keys.CONTROL + "w")
print("HI")
main_window = driver.current_window_handle
print("HI")
browser.find_element_by_tag_name('body').send_keys(Keys.CONTROL + "t")
driver.get(BISE_WEBSITE)
print("HI")
browser.find_element_by_tag_name('body').send_keys(Keys.CONTROL + "t")
driver.get(BISE_WEBSITE)
browser.find_element_by_tag_name('body').send_keys(Keys.CONTROL + "t")
driver.get(BISE_WEBSITE)
browser.find_element_by_tag_name('body').send_keys(Keys.CONTROL + "t")
driver.get(BISE_WEBSITE)
print("HI")