from PIL import Image

import pytesseract


# Simple image to string
print(pytesseract.image_to_string(Image.open('image.png'), lang='fra'))
