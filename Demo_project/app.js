//require('dotenv').config();
const logger = require('./libs/logger');
//const { port } = require('./configuration');

const db = require('./database');


const repositories = require('./repositories')(db);
const services = require('./services')(repositories);
const app = require('./http/app')(services);
const signals = require('./signals');
const port = 3010;
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
//     res.header("Access-Control-Max-Age", "3600");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
const server = app.listen(port, () => {
    logger.info(`Listening on *:${port}`);
});

const shutdown = signals.init(async () => {
    await db.close();
    await server.close();
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

