const router = require('express').Router();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
 
AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-2'
});


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
                console.log(err);
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
    .post('/', (req, res) => {
        const s3 = new AWS.S3();
        // const imageName = req.query['image-name'];
        // const imageType = req.query['image-type'];
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: 'abcde.jpeg',
            Expires: 60,
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };

        const file = path.resolve(__dirname, '../images/travel2.jpg');
        const fileStream = fs.createReadStream(file);
        uploadParams.Body = fileStream;


        s3.upload (uploadParams, function (err, data) {
            if (err) {
                console.log('Error', err);
            } if (data) {
                console.log('Upload Success', data.Location);
            }
        });
    });