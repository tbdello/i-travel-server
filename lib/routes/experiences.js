const router = require('express').Router();
const Experience = require('../models/experience');
const Image = require('../models/image');
// call this once, not for each route
const checkAuth = require('../utils/check-auth')();
const AWS = require('aws-sdk');
const shortid = require('shortid');
const multer = require('multer');
const User = require('../models/user');

const multerOption = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true); // I'm not familiar with this style of calling next. What is it supposed to do?
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
    .post('/:id/images', checkAuth, upload, (req, res, next) => {

        const s3 = new AWS.S3();
        
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: `${shortid()}.${req.file.mimetype.split('/')[1]}`,
            Expires: 60,
            ContentType: req.file.mimetype,
            ACL: 'public-read',
            Body: req.file.buffer
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) return next(err);

            if (data) {
                Image.create({
                    imageURI: data.Location,
                    caption: req.body.caption
                }).then( saved => {
                    return Experience.findOneAndUpdate({
                        _id: req.params.id,
                        user: req.user.id
                    }, {
                        $push: { images: saved._id}
                    }, updateOptions)
                        .then(() => res.send(saved));
                });
            }
        }); 
    })

    .post('/:id/comments', checkAuth, (req, res, next) => {
        // Enforce ownership:
        return Experience.findOneAndUpdate({
            _id: req.params.id, 
            user: req.user.id
        }, {
            $push: { 
                comments: req.body 
            }
        }, updateOptions)
            .then(updated => res.send(!!updated))
            .catch(next);
    })

    .delete('/:id/images/:imageId', checkAuth, (req, res, next) => {
        User.findById(req.user.id)
            .then(user =>{
                if(!user.experiences.find(exp=>exp.toString() === req.params.id)){
                    throw { code: 401, error: 'authentication failed, this is not your exp to post' };
                }
                return Experience.findByIdAndUpdate(req.params.id, {$pull: { images: req.params.imageId}}, updateOptions)
                    .then( (response) => res.send({ removed: !!response }));
            })
            .catch(next); 
    })

    .post('/',checkAuth, (req, res, next) => {
        // add the user "owner" to the experience
        req.body.user = req.user.id;
        const exp = new Experience(req.body);
        exp.generateDate();
        exp.save()
            .then(exp => {
                return User.findByIdAndUpdate(req.user.id,{$push: { experiences: exp._id}}, updateOptions)
                    .then( ()=> res.json(exp));
            })
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

    .get('/user', checkAuth, (req, res, next) => {
        const id = req.user.id;
        Experience.find({user: id})
            .populate('images')
            .populate({ path: 'user', select: 'name email' })
            .then(got =>{
                return res.send(got);
            })
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Experience.findById(id)
            .lean()
            .populate('images')
            .populate({ path: 'user', select: 'email name'})
            .then(exp => {
                if(!exp) throw {
                    code: 404,
                    error: `Experience ${id} does not exist or is not found`
                };
                res.send(exp);
            })
            .catch(next);
    })

    .put('/:id',checkAuth, (req, res, next) => {
        Experience.findByIdAndUpdate({ _id: req.params.id},
            req.body, updateOptions)
            .then(exp => res.send(exp))
            .catch(next);
    })

    .delete('/:id', checkAuth, (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .then(user =>{
                 
                if(!user.experiences.find(exp=>exp.toString() === req.params.id)){
                    throw { code: 401, error: 'authentication failed, this is not your exp to delete' };
                }
                return User.findByIdAndUpdate(req.user.id,{$pull: { experiences: req.params.id}}, updateOptions)
                    .then( ()=>{
                        return Experience.findByIdAndRemove({ _id: req.params.id, })
                            .then( response => res.send({ removed: !!response }));
                    });
            })
            .catch(next);   
    });
    
module.exports = router;
