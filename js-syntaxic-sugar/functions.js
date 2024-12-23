const handleConnectivity = (connectivity) => {
    if (connectivity === 0) {
        return "<SignalWifiOff />";
    } else if (connectivity > 0 && connectivity < 20) {
        return "<SignalWifi0Bar />";
    } else if (connectivity >= 20 && connectivity < 40) {
        return "<SignalWifi1Bar />";
    } else if (connectivity >= 40 && connectivity < 60) {
        return "<SignalWifi2Bar />";
    } else if (connectivity >= 60 && connectivity < 80) {
        return "<SignalWifi3Bar />";
    } else if (connectivity >= 80) {
        return "<SignalWifi4Bar />";
    }
    return "";
};

const handleConnectivity2 = (connectivity) => {
    if (typeof connectivity === "undefined" || connectivity === null || connectivity < 0) {
        return "";
    }
    if (connectivity === 0) {
        return "<SignalWifiOff />";
    } else if (connectivity <= 19) {
        return "<SignalWifi0Bar />";
    } else if (connectivity <= 39) {
        return "<SignalWifi1Bar />";
    } else if (connectivity <= 59) {
        return "<SignalWifi2Bar />";
    } else if (connectivity <= 79) {
        return "<SignalWifi3Bar />";
    } else if (connectivity <= Infinity) {
        return "<SignalWifi4Bar />";
    }
};

const handleConnectivity3 = (connectivity) => {
    if (typeof connectivity === "undefined" || connectivity === null || connectivity < 0) {
        return "";
    }
    const con = {
        0: "<SignalWifiOff />",
        19: "<SignalWifi0Bar />",
        39: "<SignalWifi1Bar />",
        59: "<SignalWifi2Bar />",
        79: "<SignalWifi3Bar />",
        Infinity: "<SignalWifi4Bar />",
    };
    return con[Object.keys(con).find((el) => connectivity <= el)];
};

[-10, 0, 10, 30, 50, 60, 80, 100].forEach((oneCon) => {
    console.log(handleConnectivity(oneCon));
    console.log(handleConnectivity2(oneCon));
    console.log(handleConnectivity3(oneCon));
    console.log("");
});
