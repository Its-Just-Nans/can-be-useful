FROM golang

WORKDIR /app
RUN apt update && apt upgrade -y
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs

# update npm
RUN npm install -g npm

COPY . /app/

RUN cd /app/src/ && npm install
RUN cd /app/src/ && npm run build

RUN cd /app/back/ && go build -o /app/back/server

EXPOSE 8000

CMD [ "/app/back/server" ]