const AdmZip = require("adm-zip");
const { join } = require("path");
const { cipherFile, decipherFile } = require("../lib");
const { randomBytes } = require("crypto")

const job = async () => {
    const zipFile = join(__dirname, "files.zip");
    var zip = new AdmZip();
    var content = "inner content of the file";
    zip.addFile("test_2.txt", content, "entry comment goes here");
    zip.writeZip(zipFile);


    var zip = new AdmZip(zipFile);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records

    zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
        console.log(zipEntry.getData().toString("utf8"));
    });
    var willSendthis = zip.toBuffer();

    // encryption
    const key = randomBytes(32);
    const iv = randomBytes(16);

    await cipherFile(key, iv, willSendthis, join(__dirname, "out.txt.enc"));
    await decipherFile(key, iv, join(__dirname, "out.txt.enc"), join(__dirname, "deciphered.zip"));
    const buff = await decipherFile(key, iv, join(__dirname, "out.txt.enc"), null);
    console.log(buff.length);
    var zip = new AdmZip(buff);

    zip.getEntries().forEach(function (zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
        console.log(zipEntry.getData().toString("utf8"));
    });
}

job();
