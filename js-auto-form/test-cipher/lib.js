const { createWriteStream, createReadStream, writeFileSync, existsSync } = require('fs');
const { createCipheriv, createDecipheriv } = require("crypto")

const cipherFile = async (key, iv, inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        var cipher = createCipheriv('aes-256-cbc', key, iv);
        let input;
        if (typeof inputFile === "string") {
            if (!existsSync(inputFile)) {
                writeFileSync(inputFile, "");
            }
            input = createReadStream(inputFile);
        } else {
            const { PassThrough } = require('stream');

            // Initiate the source
            input = new PassThrough();

            // Write your buffer
            input.end(inputFile);
        }
        var output = createWriteStream(outputFile);

        input.pipe(cipher).pipe(output);

        cipher.on("error", function () {
            reject();
        })
        output.on('finish', function () {
            resolve()
        });
    });
}

const decipherFile = async (key, iv, inputFile, outputFile) => {
    return new Promise((resolve, reject) => {

        var encoded = createReadStream(inputFile);
        var cipher = createDecipheriv('aes-256-cbc', key, iv);
        if (typeof outputFile === "string") {
            var unencoded = createWriteStream(outputFile);
            encoded.pipe(cipher).pipe(unencoded);

            cipher.on("error", function () {
                reject();
            })
            unencoded.on('finish', function () {
                resolve();
            });
        } else {
            outputFile = [];
            encoded.pipe(cipher);
            cipher.on("data", (chunk) => outputFile.push(chunk));
            cipher.on("end", () => {
                resolve(Buffer.concat(outputFile));
            });
            cipher.on("error", (err) => reject(err));
        }
    });
}

module.exports = {
    cipherFile,
    decipherFile,
}