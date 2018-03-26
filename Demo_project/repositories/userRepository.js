// DATA LAYER
// UserRepository:
// is used to provide an abstraction on top of the database ( and possible other data sources)
// so other parts of the application are decoupled from the specific database implementation.
// Furthermore it can hide the origin of the data from it's consumers.
// It is possible to fetch the entities from different sources like inmemory cache, 
// network or the db without the need to alter the consumers code.

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

    async function validateUser(user) {
        const users = await User.findAll({
            where: {
                email: user.email
            }
        });
        if (users) {
            users.map(user1 => user1.toUserModel());
            var pass = (users[0].dataValues.password);
            await bcrypt.compare(user.password, pass, function (err, valid) {
                if (err) {
                    var result = JSON.stringify({
                        success: false,
                        message: 'Error!',
                        token: err
                    });
                    console.log("err");
                    return (result);
                    //next(err)
                }
                else if (!valid) {
                    var result = JSON.stringify({
                        success: false,
                        message: 'Unauthorized User!',
                        token: 401
                    });
                    return (result);
                    //res.send(401)
                }//unauthorized
                else {
                    var token = jwt.encode({ email: users.email }, secretKey);
                    var result = JSON.stringify({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                    return (result);
                }
                //res.json(token)

            })
        }
       
        //.then(function (user) {
        //    const a = user;
        //    return (a);
        //})
        //.catch(function (err) {
        //    console.error(err.stack)
        //    return ("error") // server problems
        //});
        //return users.map(user => user.toUserModel());

        //.then(function (user) {
        //    if (user && user.validPassword(req.body.password)) {
        //        //return res.status(200).json({ message: "loged in!" }); // username and password match


        //        var payload = { user: user.id };

        //        // create a token
        //        var token = jwt.sign(payload, jwtConfig.secret, {
        //            expiresIn: jwtConfig.expirationTime
        //        });


        //        // return the information including token as JSON
        //        res.json({
        //            success: true,
        //            message: 'Enjoy your token!',
        //            token: token
        //        });

        //    }
        //    else {
        //        return res.status(401).json({ message: "Unauthorized, invalid fields" }); // if there is no user with specific fields send
        //    }
        //}).catch(function (err) {
        //    console.error(err.stack)
        //    return res.status(500).json({ message: "server issues when trying to login!" }); // server problems
        //});
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
                return await UserProfile.build(profile).save({ transaction: t });

                await t.commit();

            
            //return result;
        }
        catch (error) {
            // Rollback transaction if any errors were encountered
            await t.rollback();
            //console.log(t);
            return (error);
        }
       
    }

    return {
        add,
        validateUser,
        getAll,
    };
}

module.exports.create = create;