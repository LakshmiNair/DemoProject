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
const { configDB } = require('../configuration');
const { configUser } = require('../configuration');
const { configPwd } = require('../configuration');
const { config } = require('../configuration');
const { secretKey } = require('../configuration');

const sequelize = new Sequelize(configDB, configUser, configPwd, config);
// Override timezone formatting

function create({ User, UserAddress, UserProfile, Collection, UserActCode, db }) {
    async function getAll() {
        const users = await User.findAll();
        return users.map(user => user.toUserModel());
    }

    async function getUser(token) {
        try {
            var email = jwt.decode(token, secretKey);
            console.log(email);
            const user = await db.User.find({

                include: [
                    {
                        model: db.UserAddress
                    },
                    {
                        model: db.UserProfile
                    }
                ],
                
                where: email
            });
            
            return user.toUserDetailsModel();
        }
        catch (error) {
            console.log("error");
            console.log(error);
            return error;
        }
        
    }
    async function validate(password, user, name) {
        var result1;
        let comparison = await bcrypt.compare(user.password, password);
        if (!comparison)
            return ('Unauthorized User!');
        else {
            const token = await jwt.encode({ email: user.email }, secretKey);
            const result = { 'token': token, 'user': name };
            return result;
        }       
        
    }
    async function validateUser(user) {
        const users = await User.findAll({
            where: {
                email: user.email
            }
        });
        await users.map(user1 => user1.toUserModel());
        if (users[0])
            return await validate(users[0].dataValues.password, user, users[0].dataValues.name);
        else
            throw new Error('Unauthorized User!');
                         
    }

    async function add(user) {
        console.log(user);
        var password;
        bcrypt.hash(user.user.password, 10, function (err, hash) {
            password = hash;
            
        });

        const t = await sequelize.transaction();
        try {
            
                
                //save user
                var newuser = user.user;
                
                //generate unique id based on email
                var guid = aguid(newuser.email);
                newuser.membership_id = guid;
                newuser.password = password;
                await User.build(newuser).save({ transaction: t });
                
                //save user address
                var address = UserAddress.build({ "user_id": newuser.membership_id });
                address.name = newuser.name;
                await address.save({ transaction: t });

                //save user profile
                var profile = UserProfile.build({ "user_id": newuser.membership_id });
                profile.name = newuser.name;
                await profile.save({ transaction: t });

                //create new collection for user
                var collection = Collection.build({ "user_id": newuser.membership_id });
                collection.collection_name = newuser.name + newuser.email;
                collection.create_time = new Date();
                await collection.save({ transaction: t });

                await t.commit();
                return ("Inserted");
            
            //return result;
        }
        catch (error) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            
            //console.log(t);
            return (error);
        }
       
    }

    async function update(user) {
        var token =await jwt.decode(user.user.token, secretKey);
        const vUser = await User.findOne({
            where: { "email": token.email }
        });
        const validuser = vUser.toUserModel();
        if (validuser) {
            const t = await sequelize.transaction();
            try {

                const aR = await UserAddress.findOne({ where: { "user_id": validuser.membership_id } });
                const pR = await UserProfile.findOne({ where: { "user_id": validuser.membership_id } });
                //save user address
                await aR.update(user.address, { transaction: t });

                //save user profile
                await pR.update(user.profile, { transaction: t });

                await t.commit();
                return ("Updated");

                //return result;
            }
            catch (error) {
                console.log(error);
                // Rollback transaction if any errors were encountered
                await t.rollback();

                //console.log(t);
                return (error);
            }
        }
        else {
            return ("Invalid Token!");
        }
        

    }

    async function generateActivationCode(user) {
        try {
            //check if valid email

            const user1 = await User.find({
                where: {
                    email: user.email
                }
            });
            
            if (user1) {
                //generate activation code
                var aCode = keygen.password();

                var smtpTransport = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    auth: {
                        user: "singlephoton.dev@gmail.com",
                        pass: "singlephoton2018"
                    }
                });
                var mailOptions = {
                    to: user.email,
                    subject: "Test Email",
                    text: "Activation Code: " + aCode,
                }
                const message = await smtpTransport.sendMail(mailOptions);
                if (message.error)
                    return message.error;
                else {
                    var activationcode = UserActCode.build();
                    activationcode.user_id = user1.membership_id;
                    activationcode.activation_code = aCode;
                    activationcode.generated_time = new Date();
                    activationcode.active = true;
                    await activationcode.save();
                    return ("Email sent");
                }
            }   
            //console.log(message);
            //return message;
        }
        catch (error) {
            return error;
        }
        
        
    }
    async function resetPassword(user) {
        
        
        var password = await bcrypt.hash(user.password, 10);
        console.log(password);
        const validuser1 =await User.find({
            where: {
                email: user.email
            }
        });
        const a = await UserActCode.findAll({
            limit: 1,
            where: {
                user_id: validuser1.membership_id
            },
            order: [['generated_time', 'DESC']]
        });
        const validuser =await a.map(u => u.toUserActCodeModel());
        
        if (validuser) {
            
            if (validuser[0].code == user.code && validuser[0].active) {
                
                //update actcode active to 0
                await UserActCode.update(
                    { active: false },
                    { returning: true, where: { id: validuser[0].id } }
                );
                
                return await User.update(
                    { password: password },
                    { returning: true, where: { email: user.email } }
                );
            }
            else
                return "Invalid Code";
        }
        else
            return "Invalid Code";
        
        
    }

    return {
        add,
        validateUser,
        getAll,
        getUser,
        generateActivationCode,
        resetPassword,
        update,
    };
}

module.exports.create = create;