import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [svelte()],
    server: {
        port: 8080,
        proxy: {
            "/api": {
                target: "http://localhost:3000/",
                changeOrigin: true,
                ws: true,
            },
        },
    },
});
