import type { Server } from "http";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import Api from "./api/api";
import WebSocket from "./websocket/websocket";
import { port } from "./env";

const app = new Hono();
app.use("/*", serveStatic({ root: "./dist" }));

Api(app);

const server = serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Server is running on port ${info.port}`);
    }
);

WebSocket(server as Server);
