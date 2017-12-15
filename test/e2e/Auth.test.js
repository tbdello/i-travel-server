const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Auth API', () => {
    let testToken = null;
    beforeEach( () => db.drop());
    beforeEach( () => {
        return request.post('/api/auth/signup')
            .send({name: 'Testing', email: 'Testing@test.com' , password: 'secret'})
            .then( ( {body} ) => testToken = body.token);
    });

    it('should sign up a new user and return a token', () => {
        assert.ok(testToken);
    });

    it('can not sign up without password', () => {
        return request
            .post('/api/auth/signup')
            .send({name: 'Testie', email: 'Tasty-Testie'})
            .then(
                () => {throw new Error('Unexpected success which is bad');},
                err => {
                    assert.equal(err.status, 400);
                }
            );
    });

    it('should sign in with the same credentials',() => {
        return request
            .post('/api/auth/signin')
            .send({ email: 'Tasty-Testie', password:'secret' })
            .then( ({ body }) => {
                assert.ok(body.token);
            });
    });

    it('should get back a user id', () => {
        return request
            .get('/api/auth/getuser')
            .set('Authorization', testToken)
            .then( ({ body }) => {
                assert.ok(body.user);
            });
    });

});
