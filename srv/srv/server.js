const ORIGINS = [
    'http://localhost:3000',
    'https://dantonio-sap.github.io'];

cds.on('bootstrap', app => app.use((req, res, next) => {
    if (req.headers.origin in ORIGINS) {
        res.set('access-control-allow-origin', req.headers.origin)
        if (req.method === 'OPTIONS') // preflight request
            return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end()
    }
    next()
}));