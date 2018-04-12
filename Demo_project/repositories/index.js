// Register all the services here
const productRepositoryFactory = require('./productRepository');
const userRepositoryFactory = require('./userRepository');
const collectionRepositoryFactory = require('./collectionRepository');

module.exports = (db) => {
    const productRepository = productRepositoryFactory.create(db);
    const userRepository = userRepositoryFactory.create(db);
    const collectionRepository = collectionRepositoryFactory.create(db);
    return ({
        productRepository,
        userRepository,
        collectionRepository,
    });
};