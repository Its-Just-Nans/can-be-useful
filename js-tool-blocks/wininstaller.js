const installer = require("electron-installer-windows");

const options = {
    src: "./package/block-win32-x64/",
    dest: "./package/a/",
};

async function main(options) {
    console.log("Creating package (this may take a while)");
    try {
        await installer(options);
        console.log(`Successfully created package at ${options.dest}`);
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1);
    }
}
main(options);
