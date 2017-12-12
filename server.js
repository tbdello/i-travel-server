const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/connect');
require('dotenv').config();



// const dbUri = process.env.MONGODB_URI || 'mongodb://heroku_m42p1sr7:hvv3kjhret48v6a56eor2v5mtu@ds137256.mlab.com:37256/heroku_m42p1sr7';


const server = http.createServer(app);
const port = process.env.port || 3000;
connect();

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});