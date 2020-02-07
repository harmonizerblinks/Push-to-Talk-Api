const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const IdeaSchema = mongoose.Schema({
    code: { type: String, required: true },
    description: { type: String, index: true, required: true, unique: true },
    points: { type: Number, index: true, required: true, default: 0 },
    status: { type: String, required: true, default: 'Pending' },
    views: { type: [Schema.Types.ObjectId], ref: 'user', required: false, default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: 'user', required: false, default: [] },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created: { type: Date, index: true, default: Date.now },
    created: { type: Date, index: true, default: Date.now },
    approve_userid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    approve_date: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

IdeaSchema.plugin(uniqueValidator);

module.exports = mongoose.model('idea', IdeaSchema);