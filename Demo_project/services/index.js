// Register all the services here
const productServiceFactory = require('./productService');
const userServiceFactory = require('./userService');
const collectionServiceFactory = require('./collectionService');

module.exports = (repositories) => {
    const productService = productServiceFactory.create(repositories.productRepository);
    const userService = userServiceFactory.create(repositories.userRepository);
    const collectionService = collectionServiceFactory.create(repositories.collectionRepository);
    return ({
        productService,
        userService,
        collectionService,
    });
};
