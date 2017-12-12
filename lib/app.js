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
const images = require('./routes/images');
const experiences = require('./routes/experiences');

//  used routes 
app.use('/api/auth', auth);
app.use('/api/experiences', experiences);
app.use('/api/images', images);

//  catchers 
app.use(errorHandler());

module.exports = app;