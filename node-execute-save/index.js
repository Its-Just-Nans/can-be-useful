import { exec } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { cwd } from "process";

export const execute = async (command, path, alwaysExecute = false) => {
    const isDev = typeof import.meta.env != "undefined" ? import.meta.env.DEV : true;
    if (alwaysExecute || isDev) {
        console.log(`running ${command}`);
        return new Promise((resolve, _reject) => {
            exec(command, function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                console.log(stderr);
                writeFileSync(path, stdout);
                resolve(stdout);
            });
        });
    } else {
        if (!existsSync(path)) {
            path = path.replace("Its-Just-Nans.github.io", "Its-Just-Nans.github.io/Its-Just-Nans.github.io");
            if (!existsSync(path)) {
                throw new Error(`File not found at ${path}, current working directory is ${cwd()}`);
            }
        }
        return readFileSync(path, "utf-8").toString();
    }
};
