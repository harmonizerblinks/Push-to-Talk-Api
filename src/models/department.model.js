const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const DepartmentSchema = mongoose.Schema({
    code: { type: String, index: true, required: true, unique: true },
    name: { type: String, index: true, required: true },
    imageurl: { type: String, index: true, required: true, default: 'favicon.png' },
    points: { type: Number, index: true, required: true, default: 0 },
    description: { type: String, index: true, required: true },
    status: { type: Boolean, required: true, default: true },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

DepartmentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('department', DepartmentSchema);