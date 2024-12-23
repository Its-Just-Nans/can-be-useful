const axios = require("axios");
const moment = require("moment");

const doARequest = async (request, data = null) => {
    const result = await axios({
        method: request.method,
        url: request.url,
        data
    }).catch(function (error) {
        let errorMsg;
        if (error.code && error.code === "ENOTFOUND") {
            throw "ERROR_AXIOS"
        } else {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else if (error.response.data.description) {
                    errorMsg = error.response.data.description;
                } else if (error.response.data.error) {
                    errorMsg = error.response.data.error;
                } else if (error.response.data._error && error.response.data._error.message) {
                    errorMsg = error.response.data._error.message;
                }
            }
        }
        console.error(errorMsg)
        console.info(error.config.url)
        throw error;
    });
    return result;
}


class Donnons {
    constructor(region, cat) {
        this.region = region;
        this.category = cat;
        this.setBaseURL();
        this.options = {
            numberArticleByPage: 20,
            getTotalItems: false,
            limit: 20
        };
    }

    setBaseURL = (newBaseURL) => {
        this.baseURL = newBaseURL || "https://donnons.org";
    }

    async #request(params, POSTdata) {
        const { data } = await doARequest(params, POSTdata);
        return data;
    }

    #buildURL(params) {
        let regionInURL = "";
        if (params.region) {
            regionInURL = `/${params.region}`;
        } else if (this.region) {
            regionInURL = `/${this.region}`;
        }
        let categoryInURL = "";
        if (params.category) {
            categoryInURL = `/${params.category}`;
        } else if (this.category) {
            categoryInURL = `/${this.category}`;
        }
        let pageInURL = "";
        if (params.page) {
            const pageInNumber = Number(params.page);
            pageInURL = `?page=${pageInNumber || 1}`
        }
        if (categoryInURL) {
            return `${this.baseURL}${categoryInURL}${regionInURL}${pageInURL}`;
        }
        return `${this.baseURL}/annonces${regionInURL}${pageInURL}`;
    }

    async getByCategory(category = this.category) {
        const html = await this.#request({
            method: "GET",
            url: this.#buildURL({ category, page: 1 })
        });
        const searchZone = this.#getSearchZone(html)
        const [actualPage, pageMax] = this.#getPageNumbers(searchZone);
        let numberOfItem = this.#getTotalNumber(searchZone);
        let articles = this.#getArticleOfPage(searchZone);
        if (articles.length < this.options.limit) {
            if (pageMax > 1) {
                for (let countPage = 2; countPage < (pageMax + 1); countPage++) {
                    if (articles.length < this.options.limit) {
                        const dataPage = await this.#request({
                            method: "GET",
                            url: this.#buildURL({ category, page: countPage })
                        });
                        const newArticle = this.#getArticleOfPage(this.#getSearchZone(dataPage));
                        if (newArticle && newArticle.length > 0) {
                            articles = [...articles, ...newArticle];
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        if (articles.length > this.options.limit) {
            // we need to remove item
            while (articles.length > this.options.limit) {
                articles.pop();
            }
        }
        return {
            itemNumber: numberOfItem,
            articles: articles
        }
    }

    async calculateNumberOfItems(category, pageMax) {
        if (!pageMax) {
            // we need to get the pageMax
            const html = await this.#request({
                method: "GET",
                url: this.#buildURL({ category, page: 1 })
            });
            // const minArticle = ;
            const searchZone = this.#getSearchZone(html)
            const pages = this.#getPageNumbers(searchZone);
            pageMax = pages[1];
        }
        let itemNumbers = this.options.numberArticleByPage * (pageMax - 1);
        const data = await this.#request({
            method: "GET",
            url: this.#buildURL({ category, page: pageMax })
        });
        const itemNumberOfTheLastPage = this.#getNumberOfArticle(this.#getSearchZone(data));
        itemNumbers += itemNumberOfTheLastPage;
        return itemNumbers;
    }

    async getByCategoryAndPage(category = this.category, page = "1") {
        const html = await this.#request({
            method: "GET",
            url: this.#buildURL({ category, page })
        });
        // const minArticle = ;
        const searchZone = this.#getSearchZone(html)
        const [actualPage, pageMax] = this.#getPageNumbers(searchZone);
        const articleArray = this.#getArticleOfPage(searchZone);
        const number = this.#getTotalNumber(searchZone);
        return {
            actualPage,
            pageMax,
            itemNumber: number,
            articles: articleArray
        }
    }

    #getNumberOfArticle = (html) => {
        const articles = html.match(/<a.+class="lst-anno[^]+?<\/a>/g);
        if (articles && articles.length) {
            return articles.length;
        }
        return 0;
    }

    #getSearchZone = (html) => {
        const data = html.match(/<div id="search">(.|\n)*/gm);
        if (data && data[0]) {
            return data[0];
        }
        return "";
    }

    #getArticleOfPage = (html) => {
        const articles = html.match(/<a.+class="lst-anno[^]+?<\/a>/g);
        const arrayOfItem = [];
        if (articles) {
            for (const oneArticle of articles) {
                try {
                    arrayOfItem.push(this.#parseOneArticle(oneArticle));
                } catch (e) {
                    e;
                }
            }
        }
        return arrayOfItem;
    }

    #getPageNumbers = (html) => {
        let part;
        part = html.match(/<span class="num-page">[^]*?<\/span>/gm);
        let res = [0, 0]
        if (part && part[0]) {
            part = part[0].replace("</span>", "").replace(/<span class="num-page">[^]*>/, "");
            res = part.split("/").map(num => Number(num.trim()));
        }
        return res;
    };

    #getTotalNumber = (html) => {
        let part;
        part = html.match(/^.*?résultat/gm);
        let number = 0;
        if (part && part[0]) {
            part = part[0].trim().replace(/ résultat.*/g, "");
            number = Number(part);
        }
        return number;
    };

    #getImgOfArticle = (article) => {
        const img = article.match(/<img class="ima-center"[^]*?>/g)[0].replace(/<img[^]*src="([^]*?)"[^]*/g, "$1");
        return `${this.baseURL}${img}`;
    }

    #getUserOfArticle = (article) => {
        const user = {};
        const imgUser = article.match(/<img src="[^]*?>/g)[0].replace(/<img[^]*src="([^]*?)"[^]*/g, "$1");
        user.imgUser = `${this.baseURL}${imgUser}`;
        user.name = article.match(/<div class="text-center[^]*?<\/div>/g)[0].replace(/<[^]*?>/g, "").trim();
        return user;
    }

    #parseOneArticle = (oneArticle) => {
        const detail = this.#getArticleContext(oneArticle);
        detail.date = this.#getDateOfArticle(oneArticle);
        detail.img = this.#getImgOfArticle(oneArticle);
        detail.user = this.#getUserOfArticle(oneArticle);
        return detail;
    }

    #getDateOfArticle = (article) => {
        const date = article.match(/f-grow-1 text-grey text-right.*>([^]*?)<\/span>/g)[0].replace(/.*>([^]+)<\/span>/, "$1").trim();
        let unit;
        const numberInString = date.replace(/[^\d]*(\d+)[^\d]*/, "$1");
        if (numberInString.length > 5) {
            throw "SUSPICOUS_DATE";
        }
        let number = parseInt(numberInString);
        if (/minute/.test(date)) {
            unit = "minutes";
        } else if (/jour/.test(date)) {
            unit = "days";
        } else if (/mois/.test(date)) {
            unit = "months";
        }
        const dateArticle = moment().subtract(number, unit).set({ second: 0, millisecond: 0 }).toISOString();
        return dateArticle;
    }

    #getArticleContext = (article) => {
        const context = article.match(/<script type="application\/ld\+json">[^<]*<\/script>/gm)[0];
        const cleanedContext = context.replace(`<script type="application/ld+json">`, "").replace("</script>", "");
        const detail = JSON.parse(cleanedContext);
        return detail;
    }
}
module.exports = Donnons;