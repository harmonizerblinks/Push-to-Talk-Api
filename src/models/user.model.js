const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    fullname: { type: String, minlength: 8, maxlength: 50, required: true },
    imageurl: { type: String, required: false, default: 'favicon.jpg' },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: false, default: 0 },
    password: { type: String, required: true },
    // usertype: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    points: { type: Number, index: true, required: true, default: 0 },
    roles: { type: [String], required: true },
    position: { type: String, required: true },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', UserSchema);