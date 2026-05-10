#!/bin/env python

filename = "simple.pdf"

# pip install pypdf
from pypdf import PdfReader
reader = PdfReader(filename)
text = "\n".join(p.extract_text() for p in reader.pages)
print(text)

print("---------------")

# pip install pdfplumber
import pdfplumber
with pdfplumber.open(filename) as pdf:
    first_page = pdf.pages[0]
    text = first_page.extract_text()
    table = first_page.extract_table()
    print(text)
    print("-------")
    print(table)

