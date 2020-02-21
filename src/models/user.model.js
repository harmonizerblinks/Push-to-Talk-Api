const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    fullname: { type: String, minlength: 8, maxlength: 50, required: true },
    // firstname: { type: String, minlength: 8, maxlength: 50, required: true },
    // lastname: { type: String, minlength: 8, maxlength: 50, required: true },
    imageurl: { type: String, required: false, default: 'favicon.jpg' },
    email: { type: String, required: true, lowercase: true, unique: true },
    mobile: { type: String, required: false, default: 0 },
    message: { type: String, required: false, default: '' },
    departmentid: { type: Schema.Types.ObjectId, ref: 'department', required: false, default: null },
    password: { type: String, required: true },
    // usertype: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    points: { type: Number, index: true, required: true, default: 0 },
    roles: { type: [String], required: true, default: [] },
    position: { type: String, required: true, default: 'Staff' },
    created: { type: Date, index: true, default: Date.now },
    updated: { type: Date, index: true, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', UserSchema);