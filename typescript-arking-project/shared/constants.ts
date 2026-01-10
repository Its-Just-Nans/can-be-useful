export const PLACES_STATES = {
    FREE: "free",
    BUSY: "busy",
    RESERVED: "reserved",
    UNKNOWN: "unknown",
};

export const PLACES_TYPES = {
    MOTORCYCLE: "motorcycle",
    CAR: "car",
    ELECTRIC: "electric",
    ROAD: "road",
};

export const parseJSON = (jsonString: string) => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {}
    return {};
};

export const JtoS = (obj: object) => {
    return JSON.stringify(obj);
};

//TODO: this is not a secure way to generate tokens
export const generateToken = () => {
    const r = () => Math.random().toString(36).substring(2);
    return r() + r() + r() + r() + r() + r() + r() + r();
};
