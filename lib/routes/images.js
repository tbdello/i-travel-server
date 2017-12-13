const router = require('express').Router();
const Image = require('../models/image');

router
    .post('/', (req, res, next) => {
        const image = new Image(req.body);
        image.save()
            .then(exp => res.json(exp))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Image.findById(id)
            .lean()
            .then(exp => {
                if(!exp) throw {
                    code: 404,
                    error: `Image ${id} does not exist or is not found`
                };
                res.send(exp);
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Image.findByIdAndUpdate({ _id: req.params.id},
            req.body, {
                new: true,
                runValidators: true
            }
        )
            .then(exp => res.send(exp))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Image.findByIdAndRemove({ _id: req.params.id, })
            .then( response => res.send({ removed: !!response }))
            .catch(next);
    });    
    
module.exports = router;