const Department = require('../models/department.model.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/mongodb.config.js');


// FETCH all Regions
exports.findAll = (req, res) => {
    console.log('fine All');
    Department.find()
        .then(regions => {
            // console.log(regions)
            res.send(regions);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Department
exports.findOne = (req, res) => {
    Department.findById(req.params.regionId)
        .then(department => {
            if (!department) {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.regionId
                });
            }
            res.send(slider);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Department not found with id " + req.params.regionId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Department with id " + req.params.regionId
            });
        });
};

// POST a User
exports.createuser = async(req, res) => {
    // console.log(req.body);
    // Create a User
    const user = new User(req.body);
    user.password = bcrypt.hashSync(req.body.password, 10),

        user.save()
        .then(async(data) => {
            console.info('saved successfully');
            const token = jwt.sign({
                type: 'user',
                data: {
                    id: data._id,
                    fullname: data.fullname,
                    isAdmin: data.isAdmin,
                    email: user.email,
                    roles: data.roles
                },
            }, config.secret, {
                expiresIn: 684800
            });
            console.log(token);
            res.send({ success: true, access_token: token, date: Date.now });
            // res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.login = async(req, res) => {
    console.log('logging in');
    const email = req.body.email;
    const password = req.body.password

    const query = { email };
    User.findOne(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (passwordIsValid) {
                const token = jwt.sign({
                    type: 'user',
                    data: {
                        id: user._id,
                        fullname: user.fullname,
                        isAdmin: user.isAdmin,
                        email: user.email,
                        roles: user.roles
                    },
                }, config.secret, {
                    expiresIn: 684800
                });
                res.send({ success: true, access_token: token, date: Date.now });
            } else {
                res.status(500).send({ success: false, message: 'Password is not correct' })
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with username " + username
            });
        });
};

// Get User Profile
exports.profile = (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(401).send({
            message: "Authentication not Valid"
        });
    }
};

// FIND a User
exports.findOneUser = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.userId
            });
        });
};

// UPDATE a User
exports.updateUser = (req, res) => {
    var user = req.body;
    user.updated = Date.now;
    // Find user and update it
    console.log(req.body)
    User.findByIdAndUpdate(req.params.userId, user, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            console.log(err);
            return res.status(500).send({
                message: "Error updating user with id " + req.params.userId
            });
        });
};