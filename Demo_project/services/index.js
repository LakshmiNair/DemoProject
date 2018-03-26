// Register all the services here
const productServiceFactory = require('./productService');
const userServiceFactory = require('./userService');

module.exports = (repositories) => {
    const productService = productServiceFactory.create(repositories.productRepository);
    const userService = userServiceFactory.create(repositories.userRepository);
    return ({
        productService,
        userService,
    });
};
