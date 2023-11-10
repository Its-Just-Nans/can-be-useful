import { join } from "path";
import fs from "node:fs";

const PATH_TO_JSON = join(".", "projects.json");
const USERNAME = "its-just-nans";

const proxy = "";

let data = [];

console.log("Getting data...");

const rq = async (url) => {
    let dataAxios = { data: [] };
    try {
        const data = await fetch(url);
        dataAxios = { data: (await data.json()) || [] };
    } catch (e) {
        console.log(e.response.data.message, url);
    }
    return dataAxios;
};

const disabledREPO = {
    "Its-Just-Nans": true,
};

const getGitHubData = async () => {
    const colors = (await rq("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json")).data;
    const githubData = await rq(`${proxy}https://api.github.com/users/${USERNAME}/repos?per_page=40000`);
    if (Array.isArray(githubData.data)) {
        addToData(githubData.data);
    } else if (githubData.data.message.startsWith("API rate limit exceeded")) {
        console.log("API rate limit exceeded");
        return;
    } else {
        console.log("No repos data");
    }
    const dataGist = await rq(`${proxy}https://api.github.com/users/${USERNAME}/gists?per_page=40000`);
    if (Array.isArray(githubData.data)) {
        addToData(dataGist.data);
    } else {
        console.log("No gists data");
    }
    data = data.filter((obj) => {
        if (obj.fork) {
            return false;
        }
        return !disabledREPO[obj.name];
    });
    data = data.map(({ url, name, html_url, description, stargazers_count, homepage, lang, lang_color }) => {
        return {
            url,
            type: url.startsWith("https://api.github.com/repos") ? "repo" : "gist",
            name,
            html_url,
            description,
            stargazers_count,
            homepage,
            lang,
            lang_color,
        };
    });
    for (const [i, repo] of data.entries()) {
        if (repo.url.startsWith("https://api.github.com/gists/")) {
            continue;
        }
        const request = await rq(`${proxy}https://api.github.com/repos/${USERNAME}/${repo.name}/languages`);
        if (request.data) {
            const max = {
                name: null,
                value: 0,
            };
            const t = request.data;
            console.log(repo.name, t);
            for (const oneLang in t) {
                if (max.value < t[oneLang]) {
                    max.name = oneLang;
                    max.value = t[oneLang];
                }
            }
            if (max.name) {
                data[i].lang = max.name;
                data[i].lang_color = (colors[max.name] || { color: null }).color;
            }
        }
    }
    data = data.sort((a, b) => {
        const val1 = a.url?.startsWith("https://api.github.com/gists/");
        const val2 = b.url?.startsWith("https://api.github.com/gists/");
        if (val1 && val2) {
            return 0;
        } else if (val1) {
            return 1;
        } else if (val2) {
            return -1;
        } else {
            return a.name.localeCompare(b.name);
        }
    });
    fs.writeFileSync(PATH_TO_JSON, JSON.stringify(data, null, 4));
};

const addToData = (array) => {
    for (const oneElement of array) {
        const isInArray = data.findIndex((element) => {
            return element.url === oneElement.url;
        });
        if (isInArray == -1) {
            data.push(oneElement);
        }
    }
};

getGitHubData();
