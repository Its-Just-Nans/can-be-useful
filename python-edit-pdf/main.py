#!/usr/bin/env python3

import sys
import os
from PyPDF2 import PdfReader, PdfWriter
from PyPDF2.generic import DecodedStreamObject, EncodedStreamObject, NameObject


def process_data(object, replacements):
    data = object.get_data()
    decoded_data = data.decode('latin-1')
    lines = decoded_data.splitlines()
    replaced_data = ""

    for line in lines:
        if line.startswith("BT"):
            replaced_line = line
            for k, v in replacements.items():
                replaced_line = replaced_line.replace(k, v)
            if replaced_line != line:
                print(f"LINE CHANGE {replaced_line}")
            replaced_data += replaced_line + "\n"
        else:
            replaced_data += line + "\n"

    encoded_data = replaced_data.encode('latin-1')
    if object.decoded_self is not None:
        object.decoded_self.set_data(encoded_data)
    else:
        object.set_data(encoded_data)

def main():
    if len(sys.argv) < 2:
        print("Pdf path should be in arg")
        return
    in_file = sys.argv[1]
    filename_base = in_file.replace(os.path.splitext(in_file)[1], "")

    # Provide replacements list that you need here
    replacements = {
        "WORD": "NOWORD",
    }

    pdf = PdfReader(in_file)
    writer = PdfWriter()

    for page_number in range(0, len(pdf.pages)):

        page = pdf.pages[page_number]
        contents = page.get_contents()

        if isinstance(contents, DecodedStreamObject) or isinstance(contents, EncodedStreamObject):
            process_data(contents, replacements)
        elif len(contents) > 0:
            for obj in contents:
                if isinstance(obj, DecodedStreamObject) or isinstance(obj, EncodedStreamObject):
                    streamObj = obj.get_object()
                    process_data(streamObj, replacements)

        page[NameObject("/Contents")] = contents.decoded_self
        writer.add_page(page)

    with open(filename_base + ".result.pdf", 'wb') as out_file:
        writer.write(out_file)


if __name__ == "__main__":
    main()

