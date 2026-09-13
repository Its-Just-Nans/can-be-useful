import { fetcherP, setToken, getToken, getRefreshToken, setRefreshToken } from "./fetcher";
import { isAuthStore } from "./store";

const startUrl = window.location.host.startsWith("localhost") ? "http://localhost:8000/api" : "/api";

export const getQuizzes = async () => {
    return await apiCall("GET", `${startUrl}/quizzes`);
};

export const getQuiz = async (id = "") => {
    return await apiCall("GET", `${startUrl}/quiz/${id}`);
};

export const getAnswers = async (id = "", content = {}, actualQuestionIndex = "0") => {
    return await apiCall("POST", `${startUrl}/check/${id}/${actualQuestionIndex}`, content);
};

export const createQuiz = async (content = {}) => {
    return await apiCall("POST", `${startUrl}/quiz`, content);
};

export const getAuth = async (withToken = false) => {
    return await apiCall("GET", `${startUrl}/auth`, null, withToken);
};
export const getRefresh = async () => {
    const data = await fetcherP(
        "POST",
        `${startUrl}/refresh`,
        { accessToken: getToken(), refreshToken: getRefreshToken() },
        false
    );
    if (data && data.data && data.data.accessToken) {
        setToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
    }
};

const apiCall = async (method, url, data = null, withToken = true) => {
    const res = await fetcherP(method, url, data, withToken);
    if (res && res.infos) {
        if (res.infos.error_code && res.infos.error_code === "EXPIRED_JWT") {
            await getRefresh();
            return await apiCall(method, url, data);
        } else if (res.infos.needAuth) {
            isAuthStore.set(false);
        }
    }
    return res;
};
