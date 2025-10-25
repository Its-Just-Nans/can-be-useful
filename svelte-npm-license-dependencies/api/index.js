const axios = require("axios");


const getLicense = async (link) => {
    let log = false;
    let res;
    res = await axios.get(`https://github.com/${link}`).catch((err) => {
        if (log) {
            console.log(`-> ${link} not found`);
        }
    });
    const match = res.data.match(/License<\/h3>[^\/]*href="[^"]*"/gm);
    let url;
    if (match) {
        url = match[0].replace(/License<\/h3>[^\/]*href="([^"]*)"/gm, "$1");
        url = url.split("/");
        let correctUrl = `https://raw.githubusercontent.com/${link}/${url[url.length - 2]}/${url[url.length - 1]}`;
        // console.log(correctUrl);
        res = await axios.get(correctUrl).catch((err) => {
            if (log) {
                console.log(`-> ${link} not found`);
            }
        });
        return res;
    } else {
        res = null;
        return res;
    }
}

const collectData = async (dependencies) => {
    const returnObj = {
        errors: [],
        dependencies: []
    };
    if (typeof dependencies !== "undefined" && dependencies !== null) {
        const list = Object.keys(dependencies);
        for (const oneDependencies of list) {
            let repository;
            let license;
            let url = `https://api.npms.io/v2/package/${oneDependencies}`;
            const npmAPI = await axios.get(url).catch(async (axiosErr) => {
                let url = `https://www.npmjs.com/package/${oneDependencies}`;
                const npmRES = await axios.get(url).catch(() => {
                    repository = "";
                    return null;
                });
                if (npmRES && npmRES.data) {
                    const startParse = npmRES.data.match(/(Weekly Downloads.*<\/p>.*Last publish)/g);
                    const noTags = startParse[0].replace(/<[^<]*>/g, " ").replace(/<\/[^<]*>/g, "");
                    repository = noTags.split("Git")[1].split("Last publish")[0].trim();
                }
            });
            if (typeof repository === "undefined") {
                repository = npmAPI.data.collected.metadata.links.repository;
                license = npmAPI.data.collected.metadata.license;
            }
            if (repository.startsWith("https://github.com") || repository.startsWith("github.com")) {
                const beforeHash = repository.split("#")[0];
                const link = beforeHash.split("github.com/")[1];
                resLicense = await getLicense(link);
                if (resLicense && resLicense.data) {
                    returnObj.dependencies.push({
                        name: oneDependencies,
                        repository: repository,
                        license: resLicense.data,
                        npmLicense: license
                    });
                } else {
                    returnObj.errors.push({
                        name: oneDependencies,
                        repository: repository,
                        license: "",
                        npmLicense: license
                    });
                }
            } else {
                returnObj.errors.push({
                    name: oneDependencies,
                    repository: repository,
                    license: "",
                    npmLicense: license
                });
            }
        }
        return returnObj;
    }
}

module.exports = async (req, res) => {
    if (req.body) {
        let body;
        try {
            body = JSON.parse(req.body);
        } catch (e) {
            res.json({
                text: "noDependencies !",
                success: false
            });
        }
        let returnedObj1;
        if (typeof body.dependencies !== "undefined" && body.dependencies !== null) {
            returnedObj1 = await collectData(body.dependencies);
        }
        let returnedObj2;
        if (typeof body.devDependencies !== "undefined" && body.devDependencies !== null) {
            returnedObj2 = await collectData(body.devDependencies);
        }
        returnObj = { ...returnedObj1, ...returnedObj2 };
        returnObj.success = true;
        res.json(returnObj);
        return;
    }
    res.json({
        text: "noDependencies !",
        success: false
    });
}

