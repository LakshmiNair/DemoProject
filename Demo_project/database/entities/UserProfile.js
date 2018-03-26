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
    const UserProfile = sequelize.define('anton_user_profile_type', {
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
        company_type: {
            type: Sequelize.STRING,

        },
        company_role: {
            type: Sequelize.STRING,

        },
        desc_of_company: {
            type: Sequelize.STRING,

        },
        webpage: {
            type: Sequelize.STRING,
        },
        


    }, { timestamps: false, freezeTableName: true });
    //User.hasOne(UserProfile, {
    //    foreignKey: 'user_id'
    //});
    // Map to application model so we don't have tight coupling 
    // throughout the app with the db implemenation
    UserProfile.prototype.toUserProfileModel = function toUserProfileModel() {
        return new userprofileModel(this.Id, this.user_id, this.name, this.company_type, this.company_role, this.desc_of_company, this.webpage);
    };

    return UserProfile;
};

