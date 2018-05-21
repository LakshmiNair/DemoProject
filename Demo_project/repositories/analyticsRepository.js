
const nodemailer = require("nodemailer");
const keygen = require('keygenerator');
const Sequelize = require('sequelize');
const aguid = require('aguid');
//const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const fs = require("fs");
var multer = require("multer");
const path = require('path');
const { configDB } = require('../configuration');
const { configUser } = require('../configuration');
const { configPwd } = require('../configuration');
const { config } = require('../configuration');
const { secretKey } = require('../configuration');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./temp/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

var upload = multer({ storage: storage });

const sequelize = new Sequelize(configDB, configUser, configPwd, config);
function create({ Analytics,Jobs}) {
	
	/* get all analytics
	{
	token:<the provided login-token>,
      }
	*/
	async function get(token) {
		var email = jwt.decode(token, secretKey)
		const user = await User.find({where:  email});
		if (user){
			const analytics=await Analytics.findAll();
			return analytics.map(a => a.toAnalyticsModel());
		}
		else{
			return ({
				"selected": false,
				"message": "Invalid User!"
			});
		}
		console.log(user.collections);
		return user.collections;
		
	}
 

	return {
		get,
        
		};
}

module.exports.create = create;