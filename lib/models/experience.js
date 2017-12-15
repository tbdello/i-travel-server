const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const expSchema = new Schema({
    title: String,
    location: RequiredString,
    comments: [{
        user: String,
        comment: String 
    }],
    description: {
        type: String
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref:'Image'
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags:[{
        type: String
    }],
    date: String
});

expSchema.methods.generateDate = function () {
    this.date = new Date();
};

expSchema.statics.feed = function() {

};

module.exports = mongoose.model('Experience', expSchema);
