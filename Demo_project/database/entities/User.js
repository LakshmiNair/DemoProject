// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');

const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const userModel = require('../../models/user');
const usercollectionModel = require('../../models/usercollections');

module.exports = (sequelize) => {
    const User = sequelize.define('anton_user', {
        Id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement:true,
        },
        create_time: {
            type: Sequelize.DATE,
            
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        membership_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
        },
        disk_usage: {
            type: Sequelize.INTEGER
        },
        last_login: {
            type: Sequelize.DATE
        },
        user_type: {
            type: Sequelize.STRING,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
        },
        

    }, { timestamps: false, freezeTableName: true });
    //User.associate = function (models) {
    //    models.User.hasMany(models.Collection);
    //};
   // User.hasMany(Collection);
    //Contact.hasOne(User, {
    //    foreignKey: 'ContactId'
    //});
    // Map to application model so we don't have tight coupling 
    // throughout the app with the db implemenation
    User.prototype.toUserModel = function toUserModel() {
        return new userModel(this.Id, this.create_time, this.email, this.password, this.membership_id, this.name, this.active, this.disk_usage, this.last_login, this.user_type, this.deleted);
    };
    User.prototype.toUserCollectionModel = function toUserCollectionModel() {
        return new usercollectionModel(this.Id, this.create_time, this.email, this.password, this.membership_id, this.name, this.active, this.disk_usage, this.last_login, this.user_type, this.deleted,this.collections);
    };
   
    return User;
};

