import App from "./App.svelte";
import "./style.css";

const appElement = document.getElementById("app");

if (!appElement) {
    document.body.innerHTML = "Could not find app element";
    throw new Error("Could not find app element");
}

const app = new App({
    target: appElement,
});

export default app;
