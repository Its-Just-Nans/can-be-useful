const polka = require("polka")();
const axios = require("axios");
const { secret, appId, REDIRECT_URL, PORT } = require("./config.json");
const redirectUri = `http://localhost:${PORT}${REDIRECT_URL}`;

const fileInterceptor = async (req, res) => {
    let toReturn = {};
    try {
        if (req.query?.code) {
            const code = req.query.code;
            const token = await axios.get(
                `https://connect.deezer.com/oauth/access_token.php?app_id=${appId}&secret=${secret}&code=${code}&output=json`
            );
            if (token?.data) {
                const queryObject = new URLSearchParams(token.data);
                if (queryObject.get("access_token")) {
                    const realToken = queryObject.get("access_token");
                    const { data: userInfo } = await axios.get(
                        `https://api.deezer.com/user/me?access_token=${realToken}`
                    );
                    if (!userInfo.id) {
                        throw new Error("Error: no user id");
                    }
                    const userId = userInfo.id;
                    toReturn["access_token"] = realToken;
                    toReturn["user_id"] = userId;
                    const { data: listOfPlaylists } = await axios.get(
                        `https://api.deezer.com/user/${userId}/playlists`
                    );
                    const lovedPlaylistId = listOfPlaylists.data.find((el) => el.is_loved_track).id;
                    toReturn["loved_id_playlist"] = lovedPlaylistId;
                    toReturn["lovedPlaylist"] = [];
                    const { data: tracks } = await axios.get(
                        `https://api.deezer.com/playlist/${lovedPlaylistId}/tracks`
                    );
                    toReturn["lovedPlaylist"] = tracks.data.map((el) => `${el.id} - ${el.artist.name} - ${el.title}`);
                } else {
                    throw new Error("Error: no access token");
                }
            }
        }
    } catch (e) {
        return res.end(JSON.stringify({ success: false, error: e.toString() }, null, 4));
    }
    return res.end(JSON.stringify({ success: true, ...toReturn }, null, 4));
};

const renderIndex = (req, res) => {
    res.writeHead(302, {
        Location: `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectUri}&perms=basic_access,email,manage_library`,
        "Content-Length": 0,
    });
    res.end();
};

polka
    .get("/", renderIndex)
    .get(REDIRECT_URL, fileInterceptor)
    .listen(parseInt(PORT), () => {
        console.log(`> Running on localhost:${PORT}`);
    });
