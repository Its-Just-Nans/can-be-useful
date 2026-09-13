install:
	go get .

data:
	python main.py

docker:
	docker-compose up -d

rm:
	docker rm -f `docker ps -a -q`


.PHONY: data
