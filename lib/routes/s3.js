require('dotenv').config();
const router = require('express').Router();
const AWS = require('aws-sdk');
const shortid = require('shortid');
const multer = require('multer');
const Image = require('../models/image');
const Experience =require('../models/experience');

const updateOptions = { 
    new: true,
    runValidators: true
};

const multerOption = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn’t allowed'});
        }
    }
};
 
AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-2'
});

const upload = multer(multerOption).single('image');

module.exports = router
    .get('/sign-s3', (req, res) => {
        const s3 = new AWS.S3();
        const imageName = req.query['image-name'];
        const imageType = req.query['image-type'];
        const s3Params = {
            Bucket: process.env.S3_BUCKET,
            Key: imageName,
            Expires: 60,
            ContentType: imageType,
            ACL: 'public-read'
        };

        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if(err){
                return res.end();
            }
            const returnData = {
                signedRequest: data,
                url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${imageName}`
            };
            res.write(JSON.stringify(returnData));
            res.end();
        });

    })
    .post('/', upload, (req, res, next) => {

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
            if (err) {
                next(err);
            } 
            if (data) {
                Image.create({
                    imageURI: data.Location,
                    caption: req.body.caption
                }).then( saved => {
                    return Experience.findByIdAndUpdate(req.params.id, {$push: { images: saved._id}}, updateOptions)
                        .then( () => res.send(saved));
                });

            }
        });
    });
    