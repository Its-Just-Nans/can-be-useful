const { job: bouygues } = require("./bouygues.js");
const { job: orange } = require("./orange.js");

const job = async () => {
    await bouygues();
    await orange();
};

job();
