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
    /*
    {
    token:<the provided login-token>,
    file:<the file to store>
    u_path:<path (from user's root) that ends with the target folder>,
    owner:<the _username of the uploader>,
    
}
    */
    async function uploadFile(file,body,token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
        var from = "./temp/" + file.originalname;
        var u_collection = body.u_path;
        var rel_path = './uploads/' + u_collection + file.originalname;
        var to = rel_path ;
        var ext = path.extname(file.originalname);
        var filename = path.basename(file.originalname, ext);
        fs.copyFileSync(from, to);        
        if (fs.existsSync(to)) {
            
                //the file exists in the new directory, clean up temp
                fs.unlinkSync(from);
                //add a reference to the new file in the database
                var ds = Dataset.build();
                ds.collection_id = 1212;
                //ds.dataset_id = datasetId;
                ds.name = filename;
                ds.create_time = new Date();
                //ds.metadata = metadata;
                ds.extension = ext;
                //ds.state = state;
                ds.deleted = false;
               //Add dataset to database
                return ("File Uploaded!");
            } else {
            return({
                    "created": false,
                    "message": "File does not exist in desired directory."
                });
            }
        }
    }
    async function newFolder(folder, body, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            var parent = folder.cur_path;
            var rel_dest = parent + folder.name + "/";
            //var dest = user.path_root + rel_dest;
            var dest = './uploads' + rel_dest;
            fs.mkdirSync(dest);
            if (fs.existsSync(dest)) {
            
                return ("Folder Created!");
                
                //add a reference to the new folder in the database

                //Add dataset to database

            } else {
                return ({
                    "created": false,
                    "message": "Folder does not exist in desired directory."
                });
            }
        }
    }
    return {
        get,
        uploadFile,
    };
}

module.exports.create = create;