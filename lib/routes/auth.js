const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/token-service');
const checkAuth = require('../utils/check-auth');

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

    .post('/profile', checkAuth(), (req, res, next) => {
        User.findByIdAndUpdate(req.user.id, {imageURI: req.body}, updateOptions)
            .then(updated => res.send(updated))
            .catch(next);
    })

    .get('/getuser', checkAuth(), (req, res, next) => {
        User.findById(req.user.id)
            .then( user => res.send({user}))
            .catch(next); 
    })

    .get('/verify', checkAuth(), (req, res) => {
        res.send({ valid: true });
    });