all: get copy

commands:
	# */5 * * * * /bin/nodejs /home/adm/n4n5/job-check/index.js
	# export VISUAL=nano; crontab -e
	# sudo service cron reload
	ssh belart

copy:
	scp -r ./* belart:/home/adm/n4n5/job-check/

install:
	npm run install

get:
	scp belart:/home/adm/n4n5/job-check/orange.json ./
	scp belart:/home/adm/n4n5/job-check/bouygues.json ./