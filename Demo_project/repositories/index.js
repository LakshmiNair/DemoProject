// Register all the services here
const productRepositoryFactory = require('./productRepository');
const userRepositoryFactory = require('./userRepository');

module.exports = (db) => {
    const productRepository = productRepositoryFactory.create(db);
    const userRepository = userRepositoryFactory.create(db);
    return ({
        productRepository,
        userRepository,
    });
};