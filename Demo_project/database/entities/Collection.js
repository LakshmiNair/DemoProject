// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');
const { Dataset } = require('./Dataset');

const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const collectionModel = require('../../models/collection');

module.exports = (sequelize) => {
    const Collection = sequelize.define('collection', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        collection_name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        create_time: {
            type: Sequelize.DATE,
        },
        update_time: {
            type: Sequelize.DATE,
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'db.User',
                key: 'membership_id'
            }
        },
        populated_state: {
            type: Sequelize.STRING,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
        },
        total_size: {
            type: Sequelize.INTEGER
        },
        


    }, { timestamps: false, freezeTableName: true });
    //Collection.associate = function (models) {
    //    models.Collection.belongsTo(models.User);
    //};
    //Collection.associate = function (models) {
    //    models.Collection.hasMany(models.Dataset);
    //};
    //Collection.hasMany(Dataset);
    Collection.prototype.toCollectionModel = function toCollectionModel() {
        return new collectionModel(this.id, this.collection_name, this.create_time, this.update_time, this.user_id, this.populated_state, this.deleted, this.total_size);
    };

    return Collection;
};

