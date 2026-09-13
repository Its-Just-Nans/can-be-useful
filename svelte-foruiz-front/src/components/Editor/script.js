import markdownit from "markdown-it";

const render = markdownit({ html: true }).use(texmath, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
});

export default render;
