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
function create({ User, UserAddress, UserProfile }) {
    async function getAll() {
        const users = await User.findAll();
        return users.map(user => user.toUserModel());
    }
    async function validate(password, user) {
        var result1;
        let comparison = await bcrypt.compare(user.password, password);
        if (!comparison)
            throw new Error('Unauthorized User!');
        else {
            return await jwt.encode({ email: user.email }, secretKey);
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
            return await validate(users[0].dataValues.password, user);
        else
            throw new Error('Unauthorized User!');
                         
    }

    async function add(user) {
        var password;
        bcrypt.hash(user.user.password, 10, function (err, hash) {
            password = hash;
            //console.log(password);
        });

        const t = await sequelize.transaction();
        try {
            
                
                //save user
                var newuser = user.user;
                
                //generate unique id based on email
                var guid = aguid(newuser.email);
                newuser.membership_id = guid;
                newuser.password = password;
                await User.build(newuser).save({transaction: t});

                //save user address
                var address = user.address;
                address.user_id = newuser.membership_id;
                await UserAddress.build(address).save({ transaction: t });

                //save user profile
                var profile = user.profile;
                profile.user_id = newuser.membership_id;
                await UserProfile.build(profile).save({ transaction: t });

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

    async function generateActivationCode(user) {
        //generate activation code
        var aCode = keygen.password();

        var smtpTransport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: "lekshmi@summitworks.com",
                pass: "tumacha1506"
            }
        });
        var mailOptions = {
            to: "lekshmi@summitworks.com",
            subject: "Test Email",
            text: "Activayion Code: " + aCode,
        }
        const message=await smtpTransport.sendMail(mailOptions);
        //console.log(mailOptions);
        //smtpTransport.sendMail(mailOptions, function (error, response) {
        //    if (error) {
        //        console.log(error);
        //        return ("error");
        //    } else {
        //        console.log(response);
        //        console.log("Message sent: " + response.message);
        //        return ("sent");
        //    }
        //});
        console.log(message);
        return message;
        
    }
    async function resetPassword(user) {
        
        console.log(user.password);
        var password =await bcrypt.hash(user.password, 10);
        console.log(password);
        return await User.update(
            { password: password },
            { returning: true, where: { email: user.email } }
        );
        
    }

    return {
        add,
        validateUser,
        getAll,
        generateActivationCode,
        resetPassword,
    };
}

module.exports.create = create;