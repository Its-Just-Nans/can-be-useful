import { Hono } from "hono";
import { cors } from "hono/cors";
import {
    getPlaces,
    getPlaceById,
    setPlaces,
    getParkingsOfUser,
    getParking,
    getPlacesOfParking,
    deleteParking,
    getAllParkings,
    getMACs,
    getCarsIn,
    getCarsOut,
    setTypePlace,
    setState,
    linkPlace,
    factoryReset,
} from "./functions";
import { carDetected } from "./car";
import { login, logout, register, parseUser, addBalance, reservePlace } from "./account";

export default (app: Hono) => {
    const api = new Hono();
    api.use(
        "*",
        cors({
            origin: "*", // Allow from everywhere for now
        }),
        parseUser
    );
    api.get("/", (c) => c.json({ msg: "Hello API" }));
    api.get("/parkingsOfUser", getParkingsOfUser);
    api.get("/parkings", getAllParkings);
    api.get("/parking/:id", getParking);
    api.delete("/parking/:id", deleteParking);
    api.get("/places", getPlaces);
    api.get("/places/:id", getPlacesOfParking);
    api.post("/places", setPlaces);
    api.get("/place/:id", getPlaceById);
    api.post("/place/:id/factoryReset", factoryReset);
    api.post("/place/link", linkPlace);
    api.patch("/place/:id/typePlace", setTypePlace);
    api.patch("/place/:id/state", setState);
    api.post("/carDetected", carDetected);
    api.get("/carsIn/:id", getCarsIn);
    api.get("/carsOut/:id", getCarsOut);
    api.get("/macs", getMACs);
    api.post("/reservePlace", reservePlace);
    api.post("/login", login);
    api.post("/addBalance", addBalance);
    api.post("/register", register);
    api.post("/logout", logout);
    api.notFound((c) => {
        return c.json({ error: "Custom 404 Message" }, 404);
    });
    app.route("/api", api);
    app.notFound((c) => {
        return c.redirect("/");
    });
};
