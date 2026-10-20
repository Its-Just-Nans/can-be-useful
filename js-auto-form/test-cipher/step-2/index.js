const AdmZip = require("adm-zip");
const { readFileSync } = require("fs");
const { join } = require("path");

const job = () => {
    const zipFile = join(__dirname, "files.zip");
    var zip = new AdmZip();
    var content = "inner content of the file";
    zip.addFile("test_2.txt", content, "entry comment goes here");

    const file = readFileSync(join(__dirname, "test.txt"));
    zip.addFile("test.txt", file, "entry comment goes here");
    zip.addLocalFile(join(__dirname, "localFile.txt"));
    zip.writeZip(zipFile);


    var zip = new AdmZip(zipFile);
    var zipEntries = zip.getEntries(); // an array of ZipEntry records

    zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
        console.log(zipEntry.getData().toString("utf8"));
    });
}

job();