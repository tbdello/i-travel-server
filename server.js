const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/connect');

const server = http.createServer(app);
const port = process.env.PORT || 3000;
connect();

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});