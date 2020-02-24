const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const SetupSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imageurl: { type: String, required: false },
    details: { type: String, required: false },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created: { type: Date, index: true, default: Date.now }
});

SetupSchema.plugin(uniqueValidator);

module.exports = mongoose.model('setup', SetupSchema);