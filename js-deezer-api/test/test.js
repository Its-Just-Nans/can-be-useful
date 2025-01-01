import process from "process";
import DeezerClient from "../index.js"
import axios from "axios";
/*

This example prints all track of a user.

*/

const id = "YOUR_ID"

const client = new DeezerClient(axios, id);

const send = async () => {
    let allTracks = [];
    let req;
    let albumsList = [];
    req = await client.myUser.infos();
    req = await client.myUser.albums()
    albumsList = [...(req.data || [])];
    req = await client.user(id).playlists();
    albumsList = [...albumsList, ...(req.data || [])];
    for (const onePlaylist of albumsList) {
        //console.log(onePlaylist.title);
        const newTracks = await getAllTrackOfPlaylist(onePlaylist.id);
        insertUnique(allTracks, newTracks);
    }
    console.log("================")
    printAllTracks(allTracks, true);
    await exportToJSON(allTracks);
}

const insertUnique = (array, add) => {
    for (const oneEntry of add) {
        const index = array.findIndex(oneTrack => oneTrack.id === oneEntry.id);
        if (index === -1) {
            array.push(oneEntry);
        }
    }
}

const getAllTrackOfPlaylist = async (idPlaylist) => {
    const playlist = await client.albums(idPlaylist).tracks();
    return playlist.data || [];
}


const printAllTracks = (array) => {
    array.forEach(element => {
        console.log(`${element.artist.name} - ${element.title}`)
    });
}

const exportToJSON = async (array) => {
    // import fs from 'fs';
    // await fs.promises.writeFile("data.json", JSON.stringify(array, null, 4))
}

send()