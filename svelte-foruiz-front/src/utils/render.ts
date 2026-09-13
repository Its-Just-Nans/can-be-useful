import md from "markdown-it";
import mk from "markdown-it-katex";

import DOMPurify from "dompurify";

const instance = md({ html: true });

instance.use(mk);

const render = (toRender) => {
    return DOMPurify.sanitize(instance.render(toRender));
};

export default render;
