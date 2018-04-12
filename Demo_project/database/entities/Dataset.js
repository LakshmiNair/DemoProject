// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');
const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const collectionModel = require('../../models/dataset');

module.exports = (sequelize) => {
    const Dataset = sequelize.define('dataset', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        collection_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: 'collection',
            referencesKey: 'id',
        },
        dataset_id: {
            type: Sequelize.INTEGER,
        },
        create_time: {
            type: Sequelize.DATE,
        },
        metadata: {
            type: Sequelize.STRING,
        },
        extension: {
            type: Sequelize.STRING,
        },
        state: {
            type: Sequelize.STRING,
        },
        deleted: {
            type: Sequelize.BOOLEAN,
        },
        total_size: {
            type: Sequelize.INTEGER
        },



    }, { timestamps: false, freezeTableName: true });

    //Dataset.associate = function (models) {
    //    models.Dataset.belongsTo(models.Collection);
    //};

    Dataset.prototype.toDatasetModel = function toDatasetModel() {
        return new collectionModel(this.id, this.collection_id, this.dataset_id, this.create_time, this.metadata, this.state, this.total_size, this.deleted);
    };

    return Dataset;
};


