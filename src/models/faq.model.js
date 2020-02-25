const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const FaqSchema = mongoose.Schema({
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: false },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created: { type: Date, index: true, default: Date.now }
});

FaqSchema.plugin(uniqueValidator);

module.exports = mongoose.model('faq', FaqSchema);