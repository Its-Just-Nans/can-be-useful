import re
import base64
encoded = input()
# encoded = "bWFjaGluZTE/OmJvYkBtYW1hem9uPzpzaW1wbGVwYXNzd29yZDFAMjAzMg=="

strr = str(base64.b64decode(encoded).decode("utf-8"))

r1 = re.findall(r"^(.*?)\?:(.*?)@(.*?)\?:(.*)@[0-9][0-9][0-9][0-9]$", strr)

print(r1[0][3])
