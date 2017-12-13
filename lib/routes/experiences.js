const router = require('express').Router();
const Experience = require('../models/experience');

router
    .post('/', (req, res, next) => {
        console.log( 'hitting post exp with', req.body);
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
            .limit(searchLimit || 5)
            .select('location _id tags images')
            .then(exp => res.json(exp))
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
            req.body, {
                new: true,
                runValidators: true
            }
        )
            .then(exp => res.send(exp))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Experience.findByIdAndRemove({ _id: req.params.id, })
            .then( response => res.send({ removed: !!response }))
            .catch(next);
    });    
    
module.exports = router;