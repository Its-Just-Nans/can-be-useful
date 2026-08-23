import { readFileSync } from "fs";
import { parse } from "csv/sync";
import type { ActivityType } from "./types";

const options = {
    columns: true,
    skip_empty_lines: true,
};
export const publicFolderActivities = "activities";

export const csvActivities: ActivityType[] = parse(readFileSync("export/activities.csv", "utf-8"), options);

const getUser = () => {
    const csvUser = parse(readFileSync("export/profile.csv", "utf-8"), options)[0];
    const emailSha = csvUser["Email Address"]; // transform email to sha256 in csv
    return {
        ...csvUser,
        name: csvUser["First Name"],
        country: csvUser["Country"],
        avatar: `https://www.gravatar.com/avatar/${emailSha}`,
    };
};

export const user = getUser();

export const followers = parse(readFileSync("export/followers.csv", "utf-8"), options);

export const following = parse(readFileSync("export/following.csv", "utf-8"), options);
