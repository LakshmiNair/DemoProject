
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
/*
A helper function for removing folders, needed a recursive way to remove any and all subdirectories/files when removing a user
*/
var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
                Node.findOneAndRemove(
                    { file_name: curPath },
                    function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
            }
        });
        fs.rmdirSync(path);
        Node.findOneAndRemove(
            { file_name: path },
            function (err) {
                if (err) {
                    console.log(err);
                }
            });
    }
};

/**
 * a helper function to remove a folder from the database (and all of its children)
 */
var dbRemoveFolderRecursive = function (id) {
    Node.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            console.log(err);
        } else if (doc) {
            doc.children.forEach(function (child, index) {
                dbRemoveFolderRecursive(child._id); //recurse
            });
        } else {
            console.log("no Doc found with id: " + id);
        }
    });
};

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
            where:  email 
        });
        console.log(user.collections);
        return user.toUserCollectionModel();
        //const collection = await Collection.find({ where: { user_id: user.membership_id } });
        ////console.log(collection);
        //return collection.toCollectionModel();
    }
    /*Adding a file to collection
    {
    token:<the provided login-token>,
    file:<the file to store>,
    u_cID:<the collection ID>,
    
    
}
    */
    async function uploadFile(file,body,token) {
        console.log("FILE")
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            console.log("USER")
            const collection=await db.Collection.find({where:{user_id:body.u_cID}});
            if(collection){
                console.log("COllection.......")
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
        console.log("USER",user);
        if (user) {
            console.log("INSIDE 1 IF...")
            var parent = './uploads/' + user.membership_id;
            console.log("Patent....",parent)
            if (fs.existsSync(parent)) {
               console.log("INSIDE 2 IF...")
                var dest = parent +"/"+ folder.name + "/";
                fs.mkdirSync(dest);
                if (fs.existsSync(dest)) {

                    console.log("INSIDE 3 IF...")
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

    /*
renaming a folder.
formatting:
{
   "token":<the provided login-token>,
   "cur_name":<the name of the existing folder>,
   "new_name":<the name of the folder to be renamed>,
   "u_cID":<collection id>
}
*/
    async function renameFolder(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            var parent = './uploads/' + user.membership_id ;
            
            if (fs.existsSync(parent)) {
                var dest = parent + "/" + folder.cur_name + "/";
                if (fs.existsSync(dest)) {
                    var new_dest = parent + "/" + folder.new_name + "/";
                    fs.rename(dest, new_dest, function (err) {
                        if (err) throw err;
                        fs.stat(new_dest, function (err, stats) {
                            if (err) throw err;
                            console.log('stats: ' + JSON.stringify(stats));
                        });
                    });

                    //create new collection for user
                    var collection = Collection.find({where:{ "id": folder.u_cID }});
                    collection.collection_name = folder.new_name;
                    collection.update_time = new Date();
                    await Collection.update(collection,{ returning: true, where: { id:folder.u_cID  } });
                    return ({
                        "created": true,
                        "message": "Folder Renamed!"
                    });
                

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
    /* deleting a folder. 
        formatting:
    {
        "token":<the provided login-token>,
        "u_cID":<collection id>
        }
    */
    async function removeFolder(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            const collection = await Collection.find({ where: {id:folder.u_cID} });
            if (collection)
            {
                console.log(collection);
                var parent = './uploads/' + user.membership_id +"/" + collection.collection_name;
                console.log(parent);
                if (fs.existsSync(parent)) {
                    fs.rmdirSync(parent);
                    await Collection.destroy({ returning: true, where: {id:folder.u_cID} });
                    return ({
                        "deleted": true,
                        "message": "Folder Removed!"
                    });
                }
                else{
                    return({
                        "deleted": false,
                        "message": "Invalid Collection!"
                    });
                }
            }
            else{
                return ({
                    "deleted": false,
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
    /* deleting a file. 
        formatting:
    {
        "token":<the provided login-token>,
        "name":<folder name>,
        "u_dID":<dataset id>
        }
    */
    async function removeFile(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            const dataset = await Dataset.find({ where: {id:folder.u_dID} });
            if (dataset)
            {
                //console.log(dataset);
                var parent = './uploads/' + user.membership_id +"/" + folder.name;
                var curPath=parent+"/"+dataset.name + '.'+ dataset.extension;
                console.log(curPath);
                if (fs.existsSync(curPath)) {
                    fs.unlinkSync(curPath);
                   
                    await Dataset.destroy({ returning: true, where: {id:folder.u_dID} });
                    return ({
                        "deleted": true,
                        "message": "File Removed!"
                    });
                }
                else{
                    return({
                        "deleted": false,
                        "message": "Invalid File!"
                    });
                }
            }
            else{
                return ({
                    "deleted": false,
                    "message": "Invalid File!"
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
    //renamefile
    /*
renaming a file.
formatting:
{
   "token":<the provided login-token>,
   "cur_name":<the name of the existing file with extension>,
   "new_name":<the name of the file to be renamed with extension>,
   "folder_name":<the containing folder name>,
   "u_dID":<dataset id>
}
*/
    async function renameFile(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            var parent = './uploads/' + user.membership_id+"/"+folder.folder_name +"/" ;
            
            if (fs.existsSync(parent)) {
                var dest = parent + "/" + folder.cur_name;
                if (fs.existsSync(dest)) {
                    var new_dest = parent + "/" + folder.new_name ;
                    fs.rename(dest, new_dest, function (err) {
                        if (err) throw err;
                        fs.stat(new_dest, function (err, stats) {
                            if (err) throw err;
                            console.log('stats: ' + JSON.stringify(stats));
                        });
                    });

                    //update dataset
                    var ext = path.extname(folder.new_name);
                    var filename = path.basename(folder.new_name, ext);

                    var dataset = Dataset.find({where:{ "id": folder.u_dID }});
                    dataset.name = filename;
                    dataset.extension=ext;
                    await Dataset.update(dataset,{ returning: true, where: { id:folder.u_dID  } });
                    return ({
                        "created": true,
                        "message": "File Renamed!"
                    });
                

                } else {
                    return ({
                        "created": false,
                        "message": "File does not exist in desired directory."
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
    //removemultiplefiles
    /* deleting a file. 
        formatting:
    {
        "token":<the provided login-token>,
        "name":<folder name>,
        "u_dIDs":<dataset ids>
        }
    */
    async function removemultipleFiles(folder, token) {
        var email = jwt.decode(token, secretKey);
        const user = await db.User.find({ where: email });
        if (user) {
            const dataset = await Dataset.find({ where: {id:folder.u_dID} });
            if (dataset)
            {
                //console.log(dataset);
                var parent = './uploads/' + user.membership_id +"/" + folder.name;
                var curPath=parent+"/"+dataset.name + '.'+ dataset.extension;
                console.log(curPath);
                if (fs.existsSync(curPath)) {
                    fs.unlinkSync(curPath);
                   
                    await Dataset.destroy({ returning: true, where: {id:folder.u_dID} });
                    return ({
                        "deleted": true,
                        "message": "File Removed!"
                    });
                }
                else{
                    return({
                        "deleted": false,
                        "message": "Invalid File!"
                    });
                }
            }
            else{
                return ({
                    "deleted": false,
                    "message": "Invalid File!"
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
    //uploadmultiplefiles

    return {
        get,
        uploadFile,
        newFolder,
            renameFolder,
            removeFolder,
            removeFile,
            renameFile,
    };
}

module.exports.create = create;