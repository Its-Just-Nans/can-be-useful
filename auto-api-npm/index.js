const packageName = "csv-to-custom-json";

const fetchJson = async (url) => fetch(url).then((res) => res.json());

const job = async () => {
    const rep = await fetchJson(`https://api.npms.io/v2/package/${packageName}`);
    rep.collected.npm.downloads.map((entry) => {
        console.log(JSON.stringify(entry));
    });
    const repLastWeek = await fetchJson(`https://api.npmjs.org/downloads/point/last-week/${packageName}`);
    console.log(`Last week downloads : ${repLastWeek.downloads}`);
};

job();
