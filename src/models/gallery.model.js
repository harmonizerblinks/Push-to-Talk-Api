const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const GallerySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imageurl: { type: String, required: false },
    created: { type: Date, index: true, default: Date.now }
});

GallerySchema.plugin(uniqueValidator);

module.exports = mongoose.model('gallery', GallerySchema);