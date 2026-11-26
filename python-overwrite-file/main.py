import sys
import shutil

if __name__ == "__main__":
    orgi = sys.argv[1]
    new = sys.argv[2]
    output = sys.argv[3]

    # Copy original file to output
    shutil.copyfile(orgi, output)

    # Read new content
    with open(new, "rb") as f:
        new_content = f.read()

    # Overwrite beginning of output with new content
    with open(output, "r+b") as f:
        f.seek(0)
        f.write(new_content)
