import { myFetch, setToken } from "../utils";
import { user } from "../stores";
import { parseJSON } from "../../../shared/constants";

const LOGIN_KEY = "login";

export const login = async (username: string, password: string) => {
    return myFetch("/login", "POST", { username, password }).then((data) => {
        setToken(data.token);
        user.set(data.user);
        localStorage.setItem(LOGIN_KEY, JSON.stringify({ username, password }));
        return data;
    });
};

export const checkLogin = () => {
    const item = localStorage.getItem(LOGIN_KEY);
    if (item) {
        const { username, password } = parseJSON(item);
        login(username, password);
    } else {
        user.set(null);
    }
};

export const register = async (username: string, password: string, plaque: string) => {
    return myFetch("/register", "POST", { username, password, plaque });
};

export const logout = () => {
    return myFetch("/logout", "POST").then(() => {
        localStorage.removeItem(LOGIN_KEY);
        user.set(null);
    });
};
