const express = require('express');
const app = express();
const errorHandler = require('./utils/error-handler');
const morgan = require('morgan');


//  middleware 
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

//  required routes 
const auth = require('./routes/auth');
const experiences = require('./routes/experiences');
const images = require('./routes/images');
const s3 = require('./routes/s3');

//  used routes 
app.use('/api/auth', auth);
app.use('/api/experiences', experiences);
app.use('/api/images', images);
app.use('/api/uploads', s3);

//  catchers 
app.use(errorHandler());

module.exports = app;