const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/token-service');
const checkAuth = require('../utils/check-auth');
const shortid = require('shortid');
const multer = require('multer');
const AWS = require('aws-sdk');

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

const updateOptions = { 
    new: true,
    runValidators: true
};

module.exports = router
    .post('/signup', (req, res, next) => {
        const { password, email } = req.body;
        delete req.body.password;

        if (!password) throw { code:400, error: 'password is required!'};

        User.emailExists(email)
            .then( exists => {
                if (exists) throw { code: 400, error: 'this email is already taken'};

                const user = new User(req.body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => {
                return res.send({token});
            })
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'password is required'};
        
        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'authentication failed' };
                }
                return user;
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({token}))
            .catch(next);
    })

    .put('/me', checkAuth(), upload, (req, res, next) => {
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
                User.findByIdAndUpdate(req.user.id, { ...req.body, imageURI: data.Location}, updateOptions)
                    .lean()
                    .select('name email experiences, imageURI')
                    .then( user =>{
                        return res.send(user);
                    });
            }
        }); 
    })

    .get('/getuser', checkAuth(), (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .select('name email experiences imageURI')
            .then( user => res.send({user}))
            .catch(next); 
    })

    .get('/verify', checkAuth(), (req, res) => {
        res.send({ valid: true });
    });
