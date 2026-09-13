import { writable } from "svelte/store";

export const currentQuiz = writable({});
export const quizCreate = writable({});
export const component = writable(null);
export const isAuthStore = writable(null);
