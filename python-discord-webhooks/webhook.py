# this program does a multipart POST request to a Discord WebHook
# we can't do multipart send without an external library ("poster" library can do multipart encoder but "poster" is now an external library)

# py -m install requests
import requests
import json

filename = 'a.txt'

url = "https://discord.com/api/webhooks/"

isFile = False

if isFile:
    # if you want to send a file here
    # when sending a file, you can't send "embeds" part
    payload = {
        "username": "Bot",
        "content": "content here"
    }
    files = {filename: open(filename, 'rb')}
    r = requests.post(url, files=files, data=payload)
else:
    payload = {
        "username": "Bot",
        "content": "content here",
        'embeds': [
            {
                'title': 'Title',
                'description': 'Description',
                'url': 'https://discord.com/',
                'timestamp': '2019-02-28T13:42:00',
                'author': {'name': 'n4n5'},
            },
        ]
    }
    r = requests.post(url, json=payload)


print(r.status_code)
