from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()

driver.get("https://www.biselahore.com/Inter_A21.html")

print()
print()
print(driver.title)
print()
print()