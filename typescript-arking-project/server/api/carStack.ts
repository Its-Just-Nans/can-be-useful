let stack: { [s: string]: any[] } = {};

export const getLatestClientIn = (parkingId: string) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    const latest = stack[parkingId].shift();
    console.log("latest", latest);
    return latest;
};

export const addToStackIn = (parkingId: string, data: any) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    stack[parkingId].push(data);
};

export const getStackIn = (parkingId: string) => {
    if (!stack[parkingId]) {
        stack[parkingId] = [];
    }
    return stack[parkingId];
};

let stackOut: { [s: string]: any[] } = {};

export const getLatestClientOut = (parkingId: string, plaque: string) => {
    if (!stackOut[parkingId]) {
        stackOut[parkingId] = [];
    }
    const latest = stackOut[parkingId].find((e) => e.plaque === plaque);
    if (latest) {
        const index = stackOut[parkingId].indexOf(latest);
        stackOut[parkingId].splice(index, 1);
        return latest;
    }
    return null;
};

export const addToStackOut = (parkingId: string, data: any) => {
    if (!stackOut[parkingId]) {
        stackOut[parkingId] = [];
    }
    stackOut[parkingId].push(data);
};

export const getStackOut = (parkingId: string) => {
    if (!stackOut[parkingId]) {
        stackOut[parkingId] = [];
    }
    return stackOut[parkingId];
};
