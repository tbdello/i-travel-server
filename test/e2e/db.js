require('dotenv').config();
const connect = require('../../lib/connect');
const url = 'mongodb://localhost:27017/itravelTest';
const mongoose = require('mongoose');

before(() => connect(process.env.MONGODB_URI || url ));
after( ()=> mongoose.connection.close()); //data agg

module.exports = {
    drop() {
        return mongoose.connection.dropDatabase();
    }
};
