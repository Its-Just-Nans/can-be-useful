# obs-webview-poc

## Usage

Just go to [https://its-just-nans.github.io/obs-webview](https://its-just-nans.github.io/obs-webview)

## Improvements idea

> ~~This project is just a POC, I don't think I will updated it~~

- [x] create a system to design the page on a new URL like `/studio` (with a button "update")
- [x] try to have only one server for websocket and webserver

## Infos

The second version `v1` was using a communication with a websocket on a server

This first version was using an fetch on an interval, but it's not clean

```js
setInterval(() => {
    fetch("http://localhost:8100/needRefresh").then(async (resp) => {
        const txt = await resp.text();
        if (txt === "yes") {
            location.reload();
        }
    }).catch((e) => {
    })
}, 1000)
```

> Made in 2023-04-14
