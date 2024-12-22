const http = require("http");
const fs = require("fs");

const path = require("path")

const PORT = process.env.PORT || 3000;
const server = http.createServer();
const pathHere = __dirname;

const pathToUpload = path.join(pathHere, "uploads");

process.on('uncaughtException', (err, origin) => {
    console.error('/!\\ Uncaught Exception origin /!\\');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('/!\\ Unhandled rejection promise /!\\');
});

server.on("request", async (req, res) => {
    if (req.url === "/") {
        const fileStream = fs.createReadStream("./a.html");
        fileStream.pipe(res);
    } else if (req.url === "/data") {
        const pathToFile = path.join(pathToUpload, `data-${Date.now()}.txt`);
        if (!fs.existsSync(pathToUpload)) {
            fs.mkdirSync(pathToUpload)
        }
        console.log(req.headers["file-name"] || "");
        const fileName = req.headers["file-name"] ? req.headers["file-name"] : pathToFile;
        req.on("data", (data) => {
            fs.appendFile(fileName, data, () => {

            });
        });
        res.end();
    } else {
        return res.end();
    }
});

server.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Listenning");
});