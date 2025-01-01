# deezer-api

Zero dependencies Deezer client : use your own request client (`axios`, `fetch` ...)

To use the Client, see the documentation of [https://developers.deezer.com/api/explorer](https://developers.deezer.com/api/explorer)

## API

All routes of the API are in the client, for a route with default entry, you can access to it using the `infos` attributes

## Example

Code example :

```js
import DeezerClient from "../index.js"
import axios from "axios"; // import your own requester

const client = new DeezerClient(axios, "YOUR_ID"); // your id is optional

const asyncMain = async () => {
    let req;
    req = await client.myUser.infos();
    req = await client.myUser.albums();

    req = await client.user("OTHER_ID").playlists(); // request with a new different client id;


    req = await client.search.infos("eminem"); // example for a global search
    req = await client.search.artist("eminem"); // example for a search
}

asyncMain();
```

> Legend :
>
> - See also a nice example in `test` folder

## License

Licensed under the MIT License - [LICENSE](LICENSE)

Made in 2022-02-24
