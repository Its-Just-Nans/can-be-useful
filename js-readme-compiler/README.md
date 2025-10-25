# read-compiler

An online Markdown compiler (online version and API)

## Why this project ?

To have a Markdown compiler **with Latex**

## API (with serverless function of Vercel)

To call the API :

```js
const SERVER_URL = "https://readme-compiler.vercel.app";

const myMarkdown = "Hello World";

const run = async () => {
    const res = await fetch(`${SERVER_URL}/api/`, {
        method: "POST",
        body : myMarkdown
    });
    console.log(res);
}
run();
```

Made between 2021-02-10 and 2022-03-16
