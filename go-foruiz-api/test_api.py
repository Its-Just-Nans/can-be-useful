from requests import post
from random import randint, sample

json = {
    "title": "Toto",
    "description": "My desc",
    "author": "n4n5",
    "questions": [
        {
            "title": "titie 1",
            "lesson": "One one one one one one one one one on eone one ",
            "description": "desc 1 ",
            "choices": ["rep", "rep2", "rep3", "rep4"],
            "result": sample(range(4), randint(1, 3)),
            "type":"checkbox"
        },
        {
            "title": "titie 2",
            "lesson": "Hello, toto, hey",
            "description": "desc 2",
            "choices": ["rep3", "rep4"],
            "result": [randint(0, 1)],
            "type":"radio"
        }
    ]
}
token = ""
jwt = f"Bearer {token}"
headers = {'Authorization': jwt}


r = post("http://localhost:8000/api/quiz", json=json, headers=headers)

print(r.text)
