// JavaScript source code
const Sequelize = require('sequelize');
const { configDB } = require('../../configuration');
const { configUser } = require('../../configuration');
const { configPwd } = require('../../configuration');
const { config } = require('../../configuration');


const sequelize = new Sequelize(configDB, configUser, configPwd, config);
const collectionModel = require('../../models/jobs');

module.exports = (sequelize) => {
    const Jobs = sequelize.define('jobs', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
        collection_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'db.Collection',
                key: 'id'
            }
        },
        workflow_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'db.Analysis',
                key: 'workflow_id'
            }
        },
        command_line: {
            type: Sequelize.STRING,
        },
        info: {
            type: Sequelize.STRING,
        },
        dependencies: {
            type: Sequelize.STRING,
        },
        job_state: {
            type: Sequelize.STRING,
        },
        stderr: {
            type: Sequelize.STRING,
        },
        exit_code: {
            type: Sequelize.BOOLEAN,
        },
        

    }, { timestamps: false, freezeTableName: true });
    
    Jobs.prototype.toJobsModel = function toJobsModel() {
        return new jobsModel(this.id, this.create_time, this.update_time, this.user_id, this.collection_id, this.workflow_id, this.command_line,this.info,this.dependencies,this.job_state,this.stderr,this.exit_code);
    };

    return Jobs;
};

