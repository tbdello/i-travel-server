const router = require('express').Router();
const Experience = require('../models/experience');
const Image = require('../models/image');

const updateOptions = { 
    new: true,
    runValidators: true
};

router
    .post('/:id/images', (req, res, next) => {
        console.log('positing image into an album:', req.body);
        const image = new Image(req.body);
        image.save()
            .then( saved => {
                return Experience.findByIdAndUpdate(req.params.id, {$push: { images: saved._id}}, updateOptions)
                    .then( () => res.send(saved));
            })
            .catch(next);     
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
            .populate('images user')
            .then(exp => res.json(exp))
            .catch(next);
    })

    .get('/user/:id', (req, res, next) => {
        const id = req.params.id;
        Experience.find({user: id})
            .populate('images user')
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