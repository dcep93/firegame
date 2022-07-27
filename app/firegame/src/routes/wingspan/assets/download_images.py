import os

import PIL
from PIL import Image

import requests
from io import BytesIO

bank_dest = os.path.join('../', 'app', 'utils', 'bank.tsx')
img_folder = os.path.join('img')
width_px = 360

def main():
    with open(bank_dest) as fh:
        lines = fh.read().split('\n')
    birds = getBirds(lines)
    for bird in birds:
         download(bird, birds[bird])

def getBirds(lines):
    birds = {}
    find = False
    for line in lines:
        if line.strip().startswith('scientific_name'):
            name = line.split('"')[1].lower().replace(' ', '_')
        elif line.strip().startswith('img'):
            find = True
        if find and '"' in line:
            find = False
            url = line.split('"')[1]
            birds[name] = url
    return birds

def download(name, url):
    dest = os.path.join(img_folder, f'{name}.jpg')
    if os.path.exists(dest): return
    print(name)
    response = requests.get(url)
    data = BytesIO(response.content)
    try:
        image = Image.open(data)
    except Exception as e:
        print(e)
        return
    image = image.convert('RGB')
    width_percent = (width_px / float(image.size[0]))
    print(image.size)
    hsize = int((float(image.size[1]) * float(width_percent)))
    image = image.resize((width_px, hsize), PIL.Image.ANTIALIAS)
    image.save(dest)
    print()

if __name__ == "__main__":
    main()
