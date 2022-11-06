from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import base64
import time
import json

f = open('planets.json', "r")
data = json.load(f)["bodies"]
driver = webdriver.Chrome("C:\\2022Fall\hackrpi\chromedriver.exe")
output = dict()

for i in data:
    name = i["englishName"]

    driver.get("https://www.google.com/imghp")

    searchbox = driver.find_element(By.XPATH, "/html/body/div[1]/div[3]/form/div[1]/div[1]/div[1]/div/div[2]/input")

    searchbox.send_keys(name + " " + i["bodyType"])

    searchbox.submit()

    res = WebDriverWait(driver, 20, 0.5).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"islrg\"]/div[1]/div[1]/a[1]/div[1]/img")))

    ActionChains(driver).move_to_element(res).perform()
    ActionChains(driver).click(res).perform()
    time.sleep(3)

    img = driver.find_element(By.XPATH, "//*[@id=\"Sva75c\"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img")
    link = img.get_attribute("src")
    if link.startswith("data"):
        time.sleep(8)
        img = driver.find_element(By.XPATH, "//*[@id=\"Sva75c\"]/div/div/div[3]/div[2]/c-wiz/div/div[1]/div[1]/div[3]/div/a/img")
        link = img.get_attribute("src")

    output[name] = link
    print(name)
    print(link)

of = open("img.json", "w")
json.dump(output,of)