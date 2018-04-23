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
function create({ Collection, User,db,Dataset}) {
    //get collection details for user
    async function get(token) {
        var email = jwt.decode(token, secretKey)
        const user = await db.User.find({
            
            include: [
                {
                    model: db.Collection
                }
            ],
            where: { email }
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
    file:<the file to store>,
    u_cID:<the collection ID>,
    
    
}
    */
    async function uploadFile(file,body,token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            const collection=await db.Collection.find({where:{id:body.u_cID}});
            if(collection){
                var from = "./temp/" + file.originalname;
                var to = './uploads/' + user.membership_id+"/"+ collection.collection_name +'/'+ file.originalname;
                var ext = path.extname(file.originalname);
                var filename = path.basename(file.originalname, ext);
                var col_path= './uploads/' + user.membership_id+"/"+ collection.collection_name;
                if(fs.existsSync(col_path)){
                    fs.copyFileSync(from, to);        
                    if (fs.existsSync(to)) {
            
                        //the file exists in the new directory, clean up temp
                        fs.unlinkSync(from);
                        //add a reference to the new file in the database
                        var ds = Dataset.build();
                        ds.collection_id = body.u_cID;
                        //ds.dataset_id = datasetId;
                        ds.name = filename;
                        ds.create_time = new Date();
                        //ds.metadata = metadata;
                        ds.extension = ext;
                        //ds.state = state;
                        ds.deleted = false;
                        ds.save();
                        //Add dataset to database
                        return ("File Uploaded!");
                    } else {
                        return({
                            "created": false,
                            "message": "File does not exist in the directory!"
                        });
                    }
                }
                else {
                    return({
                        "created": false,
                        "message": "Invalid Collection!"
                    });
                }
            }else {
                return({
                    "created": false,
                    "message": "Invalid Collection!"
                });
            }                   
        }
        else {
            return({
                "created": false,
                "message": "Invalid User!"
            });
        }
    }

    /*
creating a folder. Provide the token and the name of the folder to be created.
formatting:
{
    "token":<the provided login-token>,
    "name":<the name of the folder to be created>
}
*/
    async function newFolder(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            var parent = './uploads/' + user.membership_id;
            
            if (fs.existsSync(parent)) {
                var dest = parent +"/"+ folder.name + "/";
                fs.mkdirSync(dest);
                if (fs.existsSync(dest)) {
                    //create new collection for user
                    var collection = Collection.build({ "user_id": user.membership_id });
                    collection.collection_name = folder.name;
                    collection.create_time = new Date();
                    await collection.save();
                    return ("Folder Created!");
                

                } else {
                    return ({
                        "created": false,
                        "message": "Folder does not exist in desired directory."
                    });
                }
            }
            else{
                return({
                    "created": false,
                    "message": "Invalid Collection!"
                });
            }
           
            
        }
        else {
            return ({
                "created": false,
                "message": "Invalid User!"
            });
        }
    }
    return {
        get,
        uploadFile,
        newFolder,
    };
}

module.exports.create = create;