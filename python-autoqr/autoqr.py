#!/bin/env python

import requests
import time
import random
import sys
from datetime import datetime
from bs4 import BeautifulSoup

# wehook URL
WEBHOOK_URL = "https://discord.com/api/webhooks/................."

def main(user, d):
    now = datetime.now().weekday()
    if now not in d["days"]:
        print("not the correct day")
        return
    r = requests.get(link_qr, cookies={"REMEMBERME": d["cookie"]})
    soup = BeautifulSoup(r.text, 'html.parser')
    main_content = soup.find('div', class_='main')
    cleantext = main_content.get_text(strip=True, separator='\n')
    r = requests.post(WEBHOOK_URL, json={
        "content": f"{user} {r.headers['Date']} {r.status_code} {cleantext[:200]}",
        "username": "auto_qr",
        "avatar_url": "",
    })


link_qr = requests.get(
    "https://api.jsonbin.io/v3/b/651934d454105e766fbc305e/latest?meta=false"
).json().get("url")


data = {
    # id du user discord
    "<@688490399198871617>": {
        "days": [1, 2, 4], # 0 = lundi
        "cookie": "COOKIE_REMEMBER_ME",
    },
    # id user 2
    "<@123456>":{
         "days": [1], # 0 = lundi
         "cookie": "COOKIE_REMEMBER_ME",
    }
}

wait = random.randint(1, 5 * 60)  # attends entre 1s et 15 minutes

if len(sys.argv) > 1 and sys.argv[1] == "--nowait":
    wait = 0
time.sleep(wait)

for one_user, one_cook in data.items():
    time.sleep(random.randint(1, 30))
    main(one_user, one_cook)


# cron on https://admin.alwaysdata.com/job/

# 20 8 * * *
# 30 18 * * *
