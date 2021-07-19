// server.js
const { createServer } = require('http')
const { parse } = require('url')
const process = require('process');
const path = require('path');

const startServer = async () => {
    process.chdir(path.join(__dirname, 'with-next-translate'));
    const handle = await require('./with-next-translate/a').getNext();
    process.chdir(__dirname);
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === '/a') {
            app.render(req, res, '/a', query)
        } else if (pathname === '/b') {
            app.render(req, res, '/b', query)
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
};

startServer();