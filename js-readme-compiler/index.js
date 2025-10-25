import polka from "polka";
import showdown from 'showdown';
import showdownKatex from "showdown-katex";
import showdownHighlight from "showdown-highlight";
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createReadStream } from "fs";
import serve from 'serve-static';
import send from '@polka/send-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = join(__dirname, 'public');
const serverStatic = serve(dir, { fallthrough: false, maxAge: 1, immutable: true });

const server = polka();
const converter = new showdown.Converter({
    openLinksInNewWindow: true,
    extensions: [
        showdownKatex({
            throwOnError: true,
            displayMode: false,
        }),
        showdownHighlight()
    ],
});
converter.setFlavor("github");

server.use(bodyParser.text())
server.use("/public", serverStatic);
server.use("/old", (req, res, next) => {
    let file = createReadStream(join(__dirname, 'old', 'index.html'));
    send(res, 200, file, { "Content-Type": "text/html" });
});
server.post("/convert", (req, res, next) => {
    if (req && req.body && req.body.length > 0) {
        const a = converter.makeHtml(req.body);
        return res.end(a);
    }
    return res.end();
})
server.use("/", (req, res, next) => {
    let file = createReadStream(join(__dirname, 'index.html'));
    send(res, 200, file, { "Content-Type": "text/html" });
});

const PORT = 3500;
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})