const express = require('express');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

function create({ userService }) {
    router.get('/', asyncWrapper(async (req, res) => {
        const users = await userService.getAllUsers();
        res.json(users);
    }));

    router.post('/generateActivationCode', asyncWrapper(async (req, res) => {
        const code = await userService.generateActivationCode(req.body);

        res.json(code);
    }
    ));

    router.post('/resetPassword', asyncWrapper(async (req, res) => {
        const reset = await userService.resetPassword(req.body);
        if (reset[1] == 0)
            res.json("Invalid Email!")
        else if (reset[1] == 1)
            res.json("Password Updated!")
        else
            res.json(reset);
    }
    ));
    router.post('/validateuser', asyncWrapper(async (req, res) => {

        const user = req.body;
        console.log(user);
        if (JSON.stringify(user) == "{}") {
            return res.status(400).json({ Error: "Login request body is empty" });
        }
        if (!user.email || !user.password) {
            return res.status(400).json({ Error: "Missing fields for login" });
        }
        //var message3 = ;
        //console.log("main");
        
        const result = await userService.validateUser(user);
        if (result == "Unauthorized User!")
            return res.status(400).json({ Error: "Unauthorized User!" });
        else 
            res.json(result);
    }));

    // TODO: Install middleware to validate the input
    router.post('/', asyncWrapper(async (req, res) => {
        const user = req.body;
        if (JSON.stringify(user) == "{}") {
            return res.status(400).json({ Error: "Register request body is empty" });
        }
        if (!user.user.email || !user.user.name || !user.user.password || !user.address.name || !user.profile.name) {
            return res.status(400).json({ Error: "Missing fields for registration" });
        }
        else {
            const result =await userService.createUser(user);
            console.log(result);
            //res.json(result);
            if (result.errors) {
                if (result.errors[0].message == "membership_id_UNIQUE must be unique" || result.errors[0].message =="anton_user.password cannot be null")
                    return res.status(400).json({ Error: "Email already in use!" });
                else
                    return res.status(400).json({ Error: result.errors[0].message });
            }
            else { res.json("User Registered!"); }
                
        }
        
    }));

    return router;
}

module.exports.create = create;
