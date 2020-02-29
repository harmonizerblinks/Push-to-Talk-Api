const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ChatSchema = mongoose.Schema({
    from: { type: String, index: true, required: true },
    message: { type: String, index: true, required: false, default: '' },
    isImage: { type: Boolean, required: true, default: false },
    imageurl: { type: String, required: false, default: '' },
    isVideo: { type: Boolean, required: true, default: false },
    video: { type: String, required: false, default: '' },
    isVideo: { type: Boolean, required: true, default: false },
    audio: { type: String, required: false, default: '' },
    isAudio: { type: Boolean, required: false, default: false },
    seen: { type: [Schema.Types.ObjectId], required: true, default: [] },
    userid: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    created: { type: Date, index: true, default: Date.now },
    muserid: { type: Schema.Types.ObjectId, ref: 'user', required: false },
    updated: { type: Date, index: true, default: Date.now }
});

ChatSchema.plugin(uniqueValidator);

module.exports = mongoose.model('chat', ChatSchema);