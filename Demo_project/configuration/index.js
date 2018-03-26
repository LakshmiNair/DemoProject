const configDB = 'single_photon';
const configUser = 'singlephoton'
const configPwd = 'singlephoton18'
const secretKey= 'supersecretkey'
const config = {
    host: 'Singlephoton.cuze9uvn3shp.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

};

module.exports = { configDB, configUser, configPwd, config, secretKey }