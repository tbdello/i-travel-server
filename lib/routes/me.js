const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/token-service');
const checkAuth = require('../utils/check-auth')();
const imageUpload = require('../utils/image-upload')();
const shortid = require('shortid');
const AWS = require('aws-sdk');
 
AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-2'
});

const updateOptions = { 
    new: true,
    runValidators: true
};

module.exports = router
    .get('/', checkAuth, (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .select('name email experiences imageURI')
            .then( user => res.send({user}))
            .catch(next); 
    })

    .put('/', checkAuth, imageUpload, (req, res, next) => {
        // structure so that you're not repeating the findByIdAndUpdate
        const updateMe = data => {
            const body = data ? { ...req.body, imageURI: data.Location } : req.body;
            User.findByIdAndUpdate(req.user.id, body, updateOptions)
                .lean()
                .select('name email experiences imageURI')
                .then( user => res.send(user));
        };

        if (!req.file) updateMe();
        else {
            const s3 = new AWS.S3();
                        
            const uploadParams = {
                Bucket: process.env.S3_BUCKET,
                Key: `${shortid()}.${req.file.mimetype.split('/')[1]}`,
                Expires: 60,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
                Body: req.file.buffer
            };

            s3.upload (uploadParams, function (err, data) {
                if (err) return next(err);
                updateMe(data);
            });
        }
    });
    

