from PIL import Image
from os import sys


def writecolor(pixel):
    raw = pixel[0] * 65536 + pixel[1] * 256 + pixel[2]
    hex_repr = hex(raw)
    int_repr = str(raw)
    
    if len(int_repr) < len(hex_repr):
        return int_repr
    else:
        return hex_repr

if not sys.argv[1]:
    print("No input image specified!")
    exit(1)

inputImage = sys.argv[1].strip()

if len(sys.argv) < 3:
    outputFile = ".".join(inputImage.split(".")[:-1:]) + ".txt"
else:
    outputFile = sys.argv[2].strip()

image = Image.open(inputImage)
pixels = image.load()

out_file = open(outputFile, "w")
out_file.write("[")

for y in range(image.height):
    for x in range(image.width):
        pixel = pixels[x, y]
        col = writecolor(pixel)
        out_file.write(col + ",")

out_file.write("][i]")
print(f'Function for {inputImage} written to {outputFile}')