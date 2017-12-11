const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};


const expSchema = new Schema({
    location: RequiredString,
    description: {
        type: String
    },
    images: [{
        url: String,
        caption: String
    }],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags:[{
        type: String
    }]
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} }
);

module.exports = mongoose.model('Experience', expSchema);