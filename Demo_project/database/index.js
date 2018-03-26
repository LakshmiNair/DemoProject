const Sequelize = require('sequelize');
const { configDB } = require('../configuration');
const { configUser } = require('../configuration');
const { configPwd } = require('../configuration');
const { config } = require('../configuration');


const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const Product = require('./entities/Product')(sequelize);
const User = require('./entities/User')(sequelize);
const UserAddress = require('./entities/UserAddress')(sequelize);
const UserProfile = require('./entities/UserProfile')(sequelize);

//sequelize.sync();

module.exports = {
    Product,
    User,
    UserAddress,
    UserProfile,
   // sync: sequelize.sync.bind(this),
    close: () => sequelize.connectionManager.close(),
};