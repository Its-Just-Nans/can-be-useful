docker build -t a .
docker run -p 8080:80 --mount src=$(pwd),target=/var/www/html,type=bind a
