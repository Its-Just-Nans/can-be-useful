import showdown from 'showdown';
import showdownKatex from "showdown-katex";
import showdownHighlight from "showdown-highlight";

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


export default function handler(req, res) {
    if (req && req.body) {
        const result = converter.makeHtml(req.body);
        console.log("conversion done");
        res.end(result);
    }
    res.end("");
}
