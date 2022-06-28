const express = require("express");
const userData = require("../data/userlist");
var uuid = require('uuid');
const Joi = require('@hapi/joi');
const router = express.Router();
const users = require('../data/userlist');


// Functions for the API requests

const addNewUser = (key, user) => {
    userData.push(user);
    return user;
}

/*
const updateUserDetails = (key, value) => {
    try {
        let userId = value.uuid;
        console.log(value);
        console.log(userId);
        const user = searchUser("uuid", userId);
        if (user) {
            user.firstName = value.firstName;
            user.email = value.email;
            return user;
        }
    }
    catch (err) {
        res.status(406).json({
            success: false,
            error: err,
            message: "User does not Exist with uuid"
        })
    }
}
*/

const searchUser = (key, value) => {
    const user_match = userData.find(userData => {
        return userData[key] === value;
    })
    if (!user_match) throw new Error("No user was found");
    return user_match;
}


// GET request to get the list of users

router.get('/users', (req, res) => {
    try {
        return res.status(200).json({
            message: "Users retrieved",
            success: true,
            users: users
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

})


// GET request for specific id

router.get('/user/:uuid',(req,res)=>{
    try{
        let userId = req.params.uuid;
        const user = searchUser("uuid",userId);
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(406).json({
            success: false,
            error:err,
            message: "User not found"
        })
    }
})

// POST request to add new user

router.post('/add', (req, res) => {
    const email = req.body.email;
    const id = uuid.v1();
    console.log(req.body);

    const newuser = {
        email: req.body.email,
        firstName: req.body.firstName,
        id: id
    };

    const validUser = validatePostRequest(req.body);
    if (validUser.error) {
        res.status(400).send(validUser.error.details[0].message);
        return;
    }

    const resUser = addNewUser("email", newuser);

    res.status(200).send({
        message: "User added successfully",
        success: true,
        email: resUser.email,
        firstName: resUser.firstName,
        id: id
    });

    function validatePostRequest(user) {
        const schema = Joi.object({
            email: Joi.string().min(1).required(),
            firstName: Joi.string().min(1).required()
        });

        const validation = schema.validate(req.body);

        return validation;
    }

})

// PUT request to update user details

router.put('/update/:id', (req, res) => {
    var id = req.params.id-1;

    const fs = require('fs');

    var jsonData = fs.readFileSync("Express.json");
    var data = JSON.parse(jsonData);

    data[id]["email"] = req.body.email;
    data[id]["firstName"] = req.body.firstName;
    
    fs.writeFileSync('Express.json', (JSON.stringify(data, null, 2)));

    res.status(200).send({
        message: "User details updated successfully",
        success: true,
        updatedList: data
    })
    
})


module.exports = router;



/*
    References:
    https://dal.brightspace.com/d2l/le/content/222418/viewContent/3051242/View
    https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js 
    https://github.com/request/request 
    https://www.codegrepper.com/code-examples/javascript/add+json+object+to+json+array+javascript
    https://github.com/syedabrar003 
    https://youtu.be/NAhQvthVjhA
    https://stackoverflow.com/questions/57956609/joi-1-default-validate-is-not-a-function 
    https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api 

*/