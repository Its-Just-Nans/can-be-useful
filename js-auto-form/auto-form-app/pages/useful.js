import { langs } from "./langs/index";

const actualLang = "fr_FR";

export const translate = (toTranslate = "") => {
    const code = toTranslate.slice(6);
    if (code !== "" && typeof langs[actualLang][code] !== "undefined") {
        return langs[actualLang][code];
    }
    return "NOT_TRANSLATED" + toTranslate;
};

export const secondPartTrans = (toTranslate = "") => {
    return toTranslate.slice(6);
};
