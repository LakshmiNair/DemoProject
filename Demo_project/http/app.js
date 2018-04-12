const express = require('express');
const bodyParser = require('body-parser');
const productRoute = require('./routes/product');
const errorRoute = require('./routes/error');
const userRoute = require('./routes/user');
const collectionRoute = require('./routes/collection');

const app = express();

const cors = require('cors')
app.use(cors());

app.use(bodyParser.json());

module.exports = (services) => {
    const product = productRoute.create(services);
    const user = userRoute.create(services);
    const collection = collectionRoute.create(services);
    app.use('/products', product);
    app.use('/users', user);
    app.use('/collection', collection);
    app.use(errorRoute);
    return app;
};
