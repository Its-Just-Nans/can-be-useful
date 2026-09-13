import "./style.css";
import App from "./App.svelte";
import { setToken, setRefreshToken } from "./utils/fetcher";

const searchParams = new URLSearchParams(window.location.search);

if (searchParams.get("accessToken")) {
    setToken(searchParams.get("accessToken"));
    setRefreshToken(searchParams.get("refreshToken"));
    window.history.replaceState({}, document.title, "/");
}

const app = new App({
    target: document.body,
    props: {
        url: searchParams.get("page") || "",
    },
});

export default app;
