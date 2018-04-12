// DATA LAYER
// UserRepository:
// is used to provide an abstraction on top of the database ( and possible other data sources)
// so other parts of the application are decoupled from the specific database implementation.
// Furthermore it can hide the origin of the data from it's consumers.
// It is possible to fetch the entities from different sources like inmemory cache, 
// network or the db without the need to alter the consumers code.
const nodemailer = require("nodemailer");
const keygen = require('keygenerator');
const Sequelize = require('sequelize');
const aguid = require('aguid');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const fs = require("fs");
var multer = require("multer");
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
function create({ Collection, User,db}) {
    //get collection details for user
    async function get(token) {
        var email = jwt.decode(token, secretKey)
        const user = await db.User.find({
            
            include: [
                {
                    model: db.Collection
                }
            ],
            where: { "email": "vishnuv111@gmail.com" }
        });
        console.log(user.collections);
        return user.toUserCollectionModel();
        //const collection = await Collection.find({ where: { user_id: user.membership_id } });
        ////console.log(collection);
        //return collection.toCollectionModel();
    }

    async function uploadFile(file,body) {
        //var email = jwt.decode(file.token, secretKey);
        //const user = await db.User.find({ where: { "email": email } });
        //if (user) {
        console.log('entered');
        var from = "./temp/" + file.originalname;
        console.log("from:" + from);
        var parent = body.u_path;
        console.log("parent:" + parent);
        var rel_path = parent + file.originalname;
        console.log("rel_path" + rel_path);
        var to = "./uploads/" + file.originalname;
            
            
            
        console.log("to: " + to);
        //console.log(fs);
            fs.copyFileSync(from, to);
            if (fs.existsSync(to)) {
                console.log("the file exists in the new directory");
                //the file exists in the new directory, clean up temp
                fs.unlinkSync(from);
                //add a reference to the new file in the database
                
               //Add dataset to database
                
            } else {
                console.log({
                    "created": false,
                    "message": "File does not exist in desired directory."
                });
            }
        //}
    }
    
    return {
        get,
        uploadFile,
    };
}

module.exports.create = create;