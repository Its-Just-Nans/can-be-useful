export default class DeezerClient {

    constructor(requester, idUser) {
        this.requester = requester;
        this.API_ENDPOINT = "https://api.deezer.com";
        this.id = idUser || null;
        if (this.id) {
            this.myUser = this.user(this.id);
        } else {
            this.myUser = {}
        }
    }



    albums = (id) => {
        return {
            infos: async () => await this.request(`/album/${id}`),
            tracks: async () => await this.request(`/album/${id}/tracks`),
            fans: async () => await this.request(`/album/${id}/fans`)
        }
    }

    artist = (id) => {
        return {
            infos: async () => await this.request(`/artist/${id}`),
            top: async () => await this.request(`/album/${id}/top`),
            albums: async () => await this.request(`/album/${id}/albums`),
            fans: async () => await this.request(`/album/${id}/fans`),
            related: async () => await this.request(`/album/${id}/related`),
            radio: async () => await this.request(`/album/${id}/radio`),
            playlists: async () => await this.request(`/album/${id}/playlists`)
        }
    }

    chart = (id) => {
        return {
            infos: async () => await this.request(`/chart/${id}`),
            tracks: async () => await this.request(`/chart/${id}/tracks`),
            albums: async () => await this.request(`/chart/${id}/albums`),
            artists: async () => await this.request(`/chart/${id}/artists`),
            playlists: async () => await this.request(`/chart/${id}/playlists`),
            podcasts: async () => await this.request(`/chart/${id}/podcasts`)
        }
    }

    episode = {
        infos: async () => await this.request(`/episode/${id}`),
        bookmark: async () => await this.request(`/chart/${id}/bookmark`)
    }

    editorial = async () => {
        return await this.request(`/editorial`)
    }

    genre = async () => {
        return await this.request(`/genre`)
    }

    infos = async () => {
        return await this.request(`/infos`)
    }

    options = async () => {
        return await this.request(`/options`)
    }

    playlist = (id) => {
        return {
            infos: async () => await this.request(`/playlist/${id}`),
            tracks: async () => await this.request(`/playlist/${id}/tracks`),
            seen: async () => await this.request(`/playlist/${id}/seen`),
            radio: async () => await this.request(`/playlist/${id}/radio`)
        }
    }

    podcast = (id) => {
        return {
            infos: async () => await this.request(`/podcast/${id}`),
            episodes: async () => await this.request(`/podcast/${id}/episodes`)
        }
    }

    radio = {
        infos: async () => await this.request(`/radio`),
        genres: async () => await this.request(`/radio/genres`),
        top: async () => await this.request(`/radio/top`),
        lists: async () => await this.request(`/radio/lists`)
    }

    track = (id) => {
        return {
            infos: async () => await this.request(`/track/${id}`)
        }
    }

    search = {
        infos: async (str) => await this.request(`/search?q=${str.toString()}`),
        album: async (str) => await this.request(`/search/album?q=${str.toString()}`),
        artist: async (str) => await this.request(`/search/artist?q=${str.toString()}`),
        history: async (str) => await this.request(`/search/history?q=${str.toString()}`),
        playlist: async (str) => await this.request(`/search/playlist?q=${str.toString()}`),
        podcast: async (str) => await this.request(`/search/podcast?q=${str.toString()}`),
        radio: async (str) => await this.request(`/search/radio?q=${str.toString()}`),
        track: async (str) => await this.request(`/search/track?q=${str.toString()}`),
        user: async (str) => await this.request(`/search/user?q=${str.toString()}`)
    }

    user = (id) => {
        return {
            infos: async () => await this.request(`/user/${id}`),
            albums: async () => await this.request(`/user/${id}/albums`),
            artists: async () => await this.request(`/user/${id}/artists`),
            charts: async () => await this.request(`/user/${id}/charts`),
            flow: async () => await this.request(`/user/${id}/flow`),
            followings: async () => await this.request(`/user/${id}/followings`),
            followers: async () => await this.request(`/user/${id}/followers`),
            history: async () => await this.request(`/user/${id}/history`), // need Oauth
            notifications: async () => await this.request(`/user/${id}/notifications`),  // need Oauth
            permissions: async () => await this.request(`/user/${id}/permissions`), // need Oauth
            options: async () => await this.request(`/user/${id}/options`), // need Oauth
            personal_songs: async () => await this.request(`/user/${id}/personal_songs`), // need Oauth
            playlists: async () => await this.request(`/user/${id}/playlists`),
            podcasts: async () => await this.request(`/user/${id}/podcasts`),
            radios: async () => await this.request(`/user/${id}/radios`),
            tracks: async () => await this.request(`/user/${id}/tracks`),
            recommendations: {
                albums: async () => await this.request(`/user/${id}/recommendations/albums`), // need Oauth
                releases: async () => await this.request(`/user/${id}/recommendations/releases`), // need Oauth
                artists: async () => await this.request(`/user/${id}/recommendations/artists`), // need Oauth
                playlists: async () => await this.request(`/user/${id}/recommendations/playlists`), // need Oauth
                tracks: async () => await this.request(`/user/${id}/recommendations/tracks`), // need Oauth
                radios: async () => await this.request(`/user/${id}/recommendations/radios`) // need Oauth
            }
        }
    }


    async request(url) {
        const { data } = await this.requester(`${this.API_ENDPOINT}${url}`).catch(function (error) {
            throw error;
        });
        return data;
    }
}