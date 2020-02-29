const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const FileSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imageurl: { type: String, required: false },
    created: { type: Date, index: true, default: Date.now }
});

FileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('file', FileSchema);