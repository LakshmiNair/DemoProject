var fs = require('fs');
var path = require('path');
var basename = path.basename(__filename);
var db = {};

const Sequelize = require('sequelize');
const { configDB } = require('../configuration');
const { configUser } = require('../configuration');
const { configPwd } = require('../configuration');
const { config } = require('../configuration');



Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
    return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};
const sequelize = new Sequelize(configDB, configUser, configPwd, config);
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Product = require('./entities/Product')(sequelize,);
const Dataset = require('./entities/Dataset')(sequelize);
const Collection = require('./entities/Collection')(sequelize);
const User = require('./entities/User')(sequelize);
db.Collection = require('./entities/Collection')(sequelize, Sequelize);
db.User = require('./entities/User')(sequelize, Sequelize);
db.UserAddress = require('./entities/UserAddress')(sequelize, Sequelize);
db.UserProfile = require('./entities/UserProfile')(sequelize, Sequelize);
const UserAddress = require('./entities/UserAddress')(sequelize);
const UserProfile = require('./entities/UserProfile')(sequelize);
const UserActCode = require('./entities/UserActCode')(sequelize);

db.Collection.belongsTo(db.User, { foreignKey: 'user_id', sourceKey:'membership_id' });
db.User.hasMany(db.Collection, { foreignKey: 'user_id', sourceKey: 'membership_id' }); 

db.UserAddress.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'membership_id' });
db.User.hasMany(db.UserAddress, { foreignKey: 'user_id', sourceKey: 'membership_id' }); 

db.UserProfile.belongsTo(db.User, { foreignKey: 'user_id', sourceKey: 'membership_id' });
db.User.hasMany(db.UserProfile, { foreignKey: 'user_id', sourceKey: 'membership_id' }); 
//sequelize.sync();

module.exports = {
    Product,
    User,
    UserAddress,
    UserProfile,
    UserActCode,
    Collection,
    Dataset,
    db,
   // sync: sequelize.sync.bind(this),
    close: () => sequelize.connectionManager.close(),
};