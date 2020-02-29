const mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
const chat = require('../models/chat.model.js');
const User = require('../models/user.model.js');
const Setup = require('../models/setup.model.js');
const Faq = require('../models/faq.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/mongodb.config.js');


// FETCH all Users
exports.findAllUsers = (req, res) => {
    console.log('fine All');
    let query = [{
        $lookup: {
            from: 'chats',
            localField: 'chatid',
            foreignField: '_id',
            as: 'chat'
        },
    }, {
        $lookup: {
            from: 'ideas',
            localField: '_id',
            foreignField: 'userid',
            as: 'ideas'
        },
    }, { $match: { isAdmin: false } }];

    User.aggregate(query)
        .then(users => {
            // console.log(users)
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// POST a User
exports.createUser = async(req, res) => {
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
                    username: data.username,
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

// Login user
exports.login = async(req, res) => {
    console.log('logging in');
    const email = req.body.email;
    const password = req.body.password

    const query = { email: email };
    User.findOne(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with email " + email
                });
            }
            if (user.isAdmin) {
                return res.status(404).send({
                    message: "Admin Account Can't user the app"
                });
            }
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (passwordIsValid) {
                const token = jwt.sign({
                    type: 'user',
                    data: {
                        id: user._id,
                        fullname: user.fullname,
                        username: user.username,
                        isAdmin: user.isAdmin,
                        email: user.email,
                        roles: user.roles
                    },
                }, config.secret, {
                    expiresIn: 684800
                });
                user.isLogin = true;
                user.access_token = token;
                User.findByIdAndUpdate(user._id, user, { new: true });
                res.send({ success: true, access_token: token, date: Date.now });
            } else {
                res.status(500).send({ success: false, message: 'Password is not correct' })
            }
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with Email " + email
                });
            }
            console.info(err);
            return res.status(500).send({
                message: "Error retrieving User with Email " + email
            });
        });
};

// Logout user
exports.profile = (req, res) => {
    if (req.user) {
        User.findById(req.user.id)
            .then(user => {

                user.isLogin = true;
                user.access_token = null;
                User.findByIdAndUpdate(user._id, user, { new: true });
                res.send({ output: 'Logout', mesaage: 'you have been logout successfully' });
            }).catch(err => {
                return res.status(200).send({
                    message: "you have been logout successfully"
                });
            });
        // res.send(req.user);
    } else {
        res.status(401).send({
            message: "Authentication not Valid"
        });
    }
};

// Get User Profile
exports.profile = (req, res) => {
    if (req.user) {
        let query = [{
            $lookup: {
                from: 'chats',
                localField: 'chatid',
                foreignField: '_id',
                as: 'chat'
            },
        }, { $match: { _id: ObjectId(req.user.id) } }];
        User.aggregate(query)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: "User not found with id " + req.params.userId
                    });
                }
                user[0].password = null;
                res.send(user[0]);
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
        // res.send(req.user);
    } else {
        res.status(401).send({
            message: "Authentication not Valid"
        });
    }
    // res.status(401).send({
    //     message: "Authentication not Valid"
    // });
};

// Change Password
exports.changePassword = (req, res) => {
    const id = req.user.id;
    const oldpassword = req.body.password;
    const password = req.body.newpassword;

    User.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with username " + username
                });
            }

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (passwordIsValid) {
                user.password = bcrypt.hashSync(req.body.newpassword, 10);

                User.findByIdAndUpdate(id, user, { new: true })
                    .then(use => {
                        if (!use) {
                            return res.status(404).send({
                                message: "User not found with id " + req.params.userId
                            });
                        }
                        res.send({
                            message: "Password Changed successfully"
                        });
                    }).catch(err => {
                        if (err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "Invalid User "
                            });
                        }
                        console.log(err);
                        return res.status(500).send({
                            message: "Error updating user Password "
                        });
                    });
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

// FIND a User
exports.findOneUser = (req, res) => {
    let query = [{
        $lookup: {
            from: 'ideas',
            localField: '_id',
            foreignField: 'userid',
            as: 'ideas'
        },
    }, {
        $lookup: {
            from: 'chats',
            localField: 'chatid',
            foreignField: '_id',
            as: 'chat'
        },
    }, { $match: { _id: ObjectId(req.params.userId) } }];
    // console.info(query);
    User.aggregate(query)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user[0]);
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

// POST a Idea
exports.createIdea = (req, res) => {
    // Create a Idea
    const idea = new Idea(req.body);

    // Save a Idea in the MongoDB
    idea.save()
        .then(data => {
            res.send({ output: 'successful', message: 'Idea has been submitted for review.' });
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FETCH all Ideas
exports.findAllIdeas = (req, res) => {
    let query = [{
        $lookup: {
            from: 'users',
            localField: 'approve_userid',
            foreignField: '_id',
            as: 'approve_user'
        },
    }, { $sort: { created: -1 } }, { $match: { userid: ObjectId(req.params.userId) } }];
    console.log('fine All');
    Idea.aggregate(query)
        .then(ideas => {
            // console.log(ideas)
            res.send(ideas);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// UPDATE a Idea
exports.updateIdeas = (req, res) => {
    var body = req.body;
    // console.log(body)
    body.updated = new Date();
    // Find idea and update it
    Idea.findByIdAndUpdate(req.params.ideaId, body, { new: true })
        .then(idea => {
            if (!idea) {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            res.send(idea);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Idea not found with id " + req.params.ideaId
                });
            }
            return res.status(500).send({
                message: "Error updating idea with id " + req.params.ideaId
            });
        });
};

// FETCH all Faqs
exports.findAllFaqs = (req, res) => {
    console.log('fine All');
    Faq.find()
        .then(faqs => {
            // console.log(faqs)
            res.send(faqs);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// FIND a Setup
exports.findOneSetup = (req, res) => {
    Setup.findOne({ type: req.params.type })
        .then(setup => {
            if (!setup) {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            res.send(setup);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Setup not found with id " + req.params.setupId
                });
            }
            return res.status(500).send({
                message: "Error retrieving Setup with id " + req.params.setupId
            });
        });
};