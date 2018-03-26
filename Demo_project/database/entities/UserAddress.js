// JavaScript source code
// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');

const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const userModel = require('../../models/user');

module.exports = (sequelize) => {
    const UserAddress = sequelize.define('anton_user_address', {
        Id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        institution: {
            type: Sequelize.STRING,
            
        },
        occupation: {
            type: Sequelize.STRING,
            
        },
        phone: {
            type: Sequelize.STRING,
            
        },
        address: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING
        },
        postcode: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING,
        },
        country: {
            type: Sequelize.STRING,
        },


    }, { timestamps: false, freezeTableName: true });
    //User.hasOne(UserAddress, {
    //    foreignKey: 'user_id'
    //});
    // Map to application model so we don't have tight coupling 
    // throughout the app with the db implemenation
    UserAddress.prototype.toUserAddressModel = function toUserAddressModel() {
        return new useraddressModel(this.Id,this.user_id, this.name, this.institution, this.occupation, this.phone, this.address, this.city, this.postcode, this.state, this.country);
    };
    
    return UserAddress;
};

