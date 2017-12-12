const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const imageSchema = new Schema ({
    imageURI: RequiredString,
    caption: String,
    isFront: Boolean,
});

module.exports = mongoose.model('Image', imageSchema);