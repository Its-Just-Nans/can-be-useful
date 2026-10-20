
const { randomBytes } = require('crypto');
const { cipherFile, decipherFile } = require("../lib");
const { join } = require("path")

const job = async () => {
    const key = randomBytes(32);
    const iv = randomBytes(16);

    await cipherFile(key, iv, join(__dirname, "test.txt"), join(__dirname, "test.txt.enc"));
    await decipherFile(key, iv, join(__dirname, "test.txt.enc"), join(__dirname, "final.txt"));
}

job();