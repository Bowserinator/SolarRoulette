import requests
import json

headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}


def download_file( url, local_filename):
    with requests.get(url, stream=True, headers=headers) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                f.write(chunk)
    return local_filename

img = ""
bodies = ""

with open("bodies.json", "r") as f:
    bodies = f.read()
with open("imgdata.json", "r") as f:
    img = f.read()

bodies = json.loads(bodies)
img = json.loads(img)[0]

def find_name(key):
    key = key.replace("HiÊ»iaka", "Hiʻiaka").replace("2867 \u00c5\u00a0teins", "2867 Šteins")
    for b in bodies:
        if b["englishName"].lower() == key.lower():
            return b["id"]
    raise Exception("??" + key)

for key, i in img.items():
    # print(key, find_name(key), i)
    try:
        download_file(i, "img/" + find_name(key) + ".png")
    except:
        print("Failed")
        print(key, find_name(key), i)