const next = require('next');

const getNext = async () => {
    const app = next({ dev: true })
    const handle = app.getRequestHandler()
    await app.prepare()
    return handle;
}

module.exports = {
    getNext
}