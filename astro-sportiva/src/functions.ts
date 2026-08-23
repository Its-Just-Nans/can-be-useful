import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { parse, join } from "node:path";
import { gunzip } from "node:zlib";
import { parseGPXWithCustomParser } from "@we-gold/gpxjs";
import { JSDOM } from "jsdom";

import { csvActivities, publicFolderActivities } from "./data";
import { stockage } from "./cache";

import type { ParsedGPX } from "@we-gold/gpxjs";
import type { ActivityType, FullActivity, GpxFile } from "./types";

export const parseGpx = (gpx: GpxFile): ParsedGPX => {
    if (stockage[gpx.path]) {
        return stockage[gpx.path];
    }
    const DOMParser = new JSDOM().window.DOMParser;

    const customParseMethod = (txt: string): Document | null => {
        const a = performance.now();
        const data = new DOMParser().parseFromString(txt, "text/xml");
        console.log(performance.now() - a);
        return data;
    };

    const [parsedGpx, errors] = parseGPXWithCustomParser(gpx.content, customParseMethod);
    if (errors) {
        console.error(errors);
    }
    if (!parsedGpx) {
        throw new Error("Error parsing GPX");
    }
    stockage[gpx.path] = parsedGpx;
    return parsedGpx;
};

export function decompressGzip(compressedData: ArrayBuffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        gunzip(compressedData, (err, decompressedData) => {
            if (err) {
                reject(err);
            } else {
                resolve(decompressedData);
            }
        });
    });
}

export const extractGpxActivity = (gpx: GpxFile): FullActivity => {
    const parsedGpx = parseGpx(gpx);
    const id = parse(gpx.path).name;
    const type = parsedGpx.tracks[0].type ?? "";
    const date = parsedGpx.metadata?.time
        ? new Date(parsedGpx.metadata.time)
        : (parsedGpx.tracks[0].duration?.startTime ?? null);
    if (!date) {
        throw new Error(`No date found in GPX ${gpx.path}`);
    }
    const startTime = parsedGpx.tracks[0].duration?.startTime ?? null;
    if (!startTime) {
        throw new Error(`No start time found in GPX ${gpx.path}`);
    }
    const endTime = parsedGpx.tracks[0].duration?.endTime ?? null;
    if (!endTime) {
        throw new Error(`No end time found in GPX ${gpx.path}`);
    }
    const movingDuration = parsedGpx.tracks[0].duration?.movingDuration;
    if (movingDuration == null) {
        throw new Error(`No moving duration found in GPX ${gpx.path}`);
    }
    const totalDuration = parsedGpx.tracks[0].duration?.totalDuration;
    if (totalDuration == null) {
        throw new Error(`No total duration found in GPX ${gpx.path}`);
    }
    const elevationGain = parsedGpx.tracks[0].elevation?.positive ?? 0;
    if (!elevationGain) {
        throw new Error(`No elevation gain found in GPX ${gpx.path}`);
    }
    return {
        gpx,
        parsedGpx,
        data: {
            id,
            date,
            name: parsedGpx.metadata?.name ?? "",
            startTime,
            endTime,
            movingDuration: movingDuration === 0 ? totalDuration : movingDuration,
            totalDuration,
            elevationGain,
            distance: parsedGpx.tracks[0].distance?.total ?? 0,
            type,
            description: parsedGpx.metadata?.description ?? "",
        },
    };
};

export const extractActivity = (appActivity: ActivityType, gpx: GpxFile): FullActivity => {
    const gpxActivity = extractGpxActivity(gpx);
    return {
        gpx,
        parsedGpx: gpxActivity.parsedGpx,
        data: {
            ...gpxActivity.data,
            id: appActivity["Activity ID"],
            name: appActivity["Activity Name"],
            type: appActivity["Activity Type"],
            date: new Date(appActivity["Activity Date"]),
            description: appActivity["Activity Description"],
            appActivity,
        },
    };
};

export const getActivityById = async (id: string): Promise<FullActivity> => {
    const activity = csvActivities.find((act) => act["Activity ID"] == id);
    const pathDataFile = activity ? `export/${activity["Filename"]}` : `export/activities/${id}.gpx`;
    const buffured = await readFile(pathDataFile);
    const data = pathDataFile.endsWith(".gpx.gz") ? await decompressGzip(buffured) : buffured;
    const dataStr = data.toString();
    return activity
        ? extractActivity(activity, { content: dataStr, path: pathDataFile })
        : extractGpxActivity({ content: dataStr, path: pathDataFile });
};

export const sortByActivityDate = (activities: FullActivity[]): FullActivity[] => {
    return activities.sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
};

export const getAllActivities = async (): Promise<FullActivity[]> => {
    if (!existsSync("export/activities")) {
        return [];
    }
    const publicFolder = `public/${publicFolderActivities}`;
    if (!existsSync(publicFolder)) {
        mkdirSync(publicFolder);
    }
    const files = await Promise.all(
        readdirSync("export/activities").map((file) => {
            const asynFunc = async () => {
                const activityApp = csvActivities.find((act) => act["Filename"] == `activities/${file}`);
                const gpxPath = `export/activities/${file}`;
                let data = await readFile(gpxPath);
                if (file.endsWith(".gpx.gz")) {
                    data = await decompressGzip(data);
                }
                const dataStr = data.toString();
                const gpx = { content: dataStr, path: gpxPath };
                const activity = activityApp ? extractActivity(activityApp, gpx) : extractGpxActivity(gpx);
                const publicPath = join(publicFolder, `${activity.data.id}.gpx`);
                await writeFile(publicPath, dataStr);
                return activity;
            };
            return asynFunc();
        })
    );
    return sortByActivityDate(files);
};

export const getAllActivitiesIds = async (): Promise<string[]> => {
    if (!existsSync("export/activities")) {
        return [];
    }
    const ids = csvActivities.reduce((acc, act) => {
        return {
            ...acc,
            [act["Activity ID"]]: act["Filename"],
        };
    }, {});
    const filesFromIds = new Set(Object.values(ids));
    const files = await readdir("export/activities");
    const filesWithoutIds = files.filter((file) => !filesFromIds.has(`activities/${file}`));
    console.log(filesWithoutIds);
    const idFromFiles = filesWithoutIds.map((file) => file.slice(0, file.indexOf(".")));
    return [...Object.keys(ids), ...idFromFiles];
};
