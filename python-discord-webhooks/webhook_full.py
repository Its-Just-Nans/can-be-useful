# this program does a multipart POST request to a Discord WebHook
# we can't do multipart send without an external library ("poster" library can do multipart encoder but "poster" is now an external library)

# py -m install requests
import requests

url = input("Enter l'URL\n")

username = input("Enter the username\n")

content = input("Enter the content\n")

avatar_url = input("Enter URL avatar (or nothing)\n")


payload = {
    "username": username,
    "content": content,
    "avatar_url": avatar_url
}
r = requests.post(url, json=payload)


print(r.status_code)
