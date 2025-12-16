const bin = "651934d454105e766fbc305e";
export const defaultURL = "https://www.caliel.fr/pointage/passage/";

const readURL = async () => {
    return fetch(`https://api.jsonbin.io/v3/b/${bin}/latest?meta=false`)
        .then((resp) => {
            return resp.json();
        })
        .catch(() => {
            return { url: "error", date: new Date().toISOString() };
        });
};

const writeURL = async (newUrl: string) => {
    await fetch(`https://api.jsonbin.io/v3/b/${bin}`, {
        method: "PUT",
        body: JSON.stringify({ url: newUrl, date: new Date().toISOString() }),
        headers: { "Content-Type": "application/json" },
    });
    return readURL();
};

export { readURL, writeURL };
