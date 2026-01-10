export type Place = {
    idPlace?: number;
    idParking?: number;
    selected: boolean;
    a1: number[];
    a2: number[];
    a3: number[];
    a4: number[];
    plaque: string;
    name: string;
    state: string;
    time: number;
    ip: string;
    typePlace: string;
};

export type Parking = {
    idParking: number;
    name: string;
    schema: string;
    idAdmin: number;
};
