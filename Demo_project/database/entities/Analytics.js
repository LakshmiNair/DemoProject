// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');


const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const collectionModel = require('../../models/analytics');

module.exports = (sequelize) => {
    const Analytics = sequelize.define('analytics', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        workflow_id: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        version: {
            type: Sequelize.STRING,
            allowNull: false,
        },        
        status: {
            type: Sequelize.STRING,
        },
        dependencies : {
            type: Sequelize.STRING,
        },        


    }, { timestamps: false, freezeTableName: true });
    
    Analytics.prototype.toAnalyticsModel = function toAnalyticsModel() {
        return new analyticsModel(this.id, this.name, this.workflow_id, this.version, this.status, this.dependencies);
    };

    return Analytics;
};

