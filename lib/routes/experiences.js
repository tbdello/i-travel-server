const router = require('express').Router();
const Experience = require('../models/experience');
const Image = require('../models/image');
const checkAuth = require('../utils/check-auth');
const AWS = require('aws-sdk');
const shortid = require('shortid');
const multer = require('multer');


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

router
    .post('/:id/images',upload, (req, res, next) => {
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
    })

    .post('/', (req, res, next) => {
        const exp = new Experience(req.body);
        exp.generateDate();
        exp.save()
            .then(exp => res.json(exp))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Experience.find()
            .select('location _id tags images')
            .lean()
            .then(exp => res.json(exp))
            .catch(next);
    })

    .get('/search', (req, res, next) => {
        const search ={};
        let searchLimit = null;
        if(req.query.location){
            search.location = req.query.location;
        }
        if(req.query.tag) {
            search.tags = { $in: [req.query.tag] };
        }
        if(req.query.limit) {
            searchLimit = parseInt(req.query.limit);
        }

        Experience.find(search).sort({ date: -1 })
            .limit(searchLimit || 16)
            .populate('images')
            .populate({ path: 'user', select: 'name email' })
            .then(exp => res.json(exp))
            .catch(next);
    })

    .get('/user',checkAuth(), (req, res, next) => {
        const id = req.user.id;
        console.log(req.user);
        Experience.find({user: id})
            .populate('images')
            .populate({ path: 'user', select: 'name email' })
            .then(got =>{
                console.log('we are getting by user', got);
                return res.send(got);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Experience.findById(id)
            .lean()
            .populate('images')
            .then(exp => {
                if(!exp) throw {
                    code: 404,
                    error: `Experience ${id} does not exist or is not found`
                };
                res.send(exp);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Experience.findByIdAndUpdate({ _id: req.params.id},
            req.body, updateOptions)
            .then(exp => res.send(exp))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Experience.findByIdAndRemove({ _id: req.params.id, })
            .then( response => res.send({ removed: !!response }))
            .catch(next);
    });    
    
module.exports = router;