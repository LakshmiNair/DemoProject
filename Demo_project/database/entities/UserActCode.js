// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');
const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const userActCodeModel = require('../../models/useractcode');

module.exports = (sequelize) => {
    const UserActCode = sequelize.define('user_activationcode', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        activation_code: {
            type: Sequelize.STRING,
        },
        generated_time: {
            type: Sequelize.DATE,
        },
        active: {
            type: Sequelize.BOOLEAN,
        }



    }, { timestamps: false, freezeTableName: true });

    //Dataset.associate = function (models) {
    //    models.Dataset.belongsTo(models.Collection);
    //};

    UserActCode.prototype.toUserActCodeModel = function toUserActCodeModel() {
        return new userActCodeModel(this.id, this.user_id, this.activation_code, this.generated_time, this.active);
    };

    return UserActCode;
};


