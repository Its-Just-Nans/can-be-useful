type DestByGare = {
    [key: string]: string[];
};

const get_dest_by_gare = (data): DestByGare => {
    let destByGare: DestByGare = {};
    for (const oneTarif of data.ter) {
        const orig_uic = oneTarif["origine_code_uic"];
        const dest_uic = oneTarif["destination_code_uic"];
        for (const one_uic of [orig_uic.split(";")]) {
            if (!(one_uic in destByGare)) {
                destByGare[one_uic] = [];
            }
            for (const dest of dest_uic.split(";")) {
                if (!destByGare[one_uic].includes(dest)) {
                    destByGare[one_uic].push(dest);
                }
            }
        }
    }

    for (const oneTarif of data.intercites) {
        const orig_uic = oneTarif["origine_uic8"];
        const dest_uic = oneTarif["destination_uic8"];
        for (const one_uic of [orig_uic.split(";")]) {
            if (!(one_uic in destByGare)) {
                destByGare[one_uic] = [];
            }
            for (const dest of dest_uic.split(";")) {
                if (!destByGare[one_uic].includes(dest)) {
                    destByGare[one_uic].push(dest);
                }
            }
        }
    }
    return destByGare;
};

const minDistance = (gares_key, dist, sptSet) => {
    let min = Infinity;
    let min_index = null;
    for (const gare of gares_key) {
        if (!sptSet[gare] && dist[gare] <= min) {
            min = dist[gare];
            min_index = gare;
        }
    }
    return min_index;
};

const getDistanceBetweenGares = (gares, gare1, gare2) => {
    const gare1Data = gares[gare1];
    const gare2Data = gares[gare2];
    return Math.sqrt(
        Math.pow(gare1Data["position_geographique"]["lon"] - gare2Data["position_geographique"]["lat"], 2) +
            Math.pow(gare1Data["position_geographique"]["lat"] - gare2Data["position_geographique"]["lon"], 2)
    );
};

type DistObj = {
    [key: string]: number;
};

type SijSet = {
    [key: string]: boolean;
};

type DirectionObj = {
    [key: string]: string | null;
};

export const dijkstra = (data, start: string, end: string): [DistObj, DirectionObj] => {
    start = start.split(";")[0];
    end = end.split(";")[0];
    const gares_key = Object.keys(data.garesIndex);
    const destByGare = get_dest_by_gare(data);
    let dist: DistObj = gares_key.reduce((acc, gare) => {
        return {
            ...acc,
            [gare]: Infinity,
        };
    }, {});
    dist[start] = 0;
    let sptSet: SijSet = gares_key.reduce((acc, gare) => {
        return {
            ...acc,
            [gare]: false,
        };
    }, {});
    const path: DirectionObj = { [start]: null };
    for (let i = 0; i < gares_key.length - 1; i++) {
        const u = minDistance(gares_key, dist, sptSet);
        sptSet[u] = true;
        if (destByGare[u] && data.garesIndex[u]) {
            for (const oneGare of destByGare[u]) {
                if (data.garesIndex[oneGare]) {
                    if (!sptSet[oneGare]) {
                        const newDist = dist[u] + getDistanceBetweenGares(data.garesIndex, u, oneGare);
                        if (dist[oneGare] > newDist) {
                            dist[oneGare] = newDist;
                            path[oneGare] = u;
                        }
                    }
                }
            }
        }
    }
    return [dist, path];
};

export const get_path = (path: DirectionObj, start: string, end: string): string[] => {
    const finalPath = [end];
    let rest = end;
    while (rest !== start) {
        rest = path[rest];
        finalPath.push(rest);
    }
    return finalPath.toReversed();
};
