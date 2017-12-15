const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe.skip('Search API', () => {
    const expArr = [
        { title: 'Best1', location: 'New1', tags:['hard', 'soft'] },
        { title: 'Best2', location: 'New2', tags:['soft'] },
        { title: 'Best3', location: 'New3', },
        { title: 'Best4', location: 'New4', },
        { title: 'Best5', location: 'New5', },
        { title: 'Best6', location: 'New6', },
        { title: 'Best7', location: 'New7', },
        { title: 'Best8', location: 'New8', },
        { title: 'Best9', location: 'New9', },
        { title: 'Best10', location: 'New10', },
        { title: 'Best11', location: 'New11', },
        { title: 'Best12', location: 'New12', },
        { title: 'Best13', location: 'New13', },
        { title: 'Best14', location: 'New14', },
        { title: 'Best15', location: 'New15', },
        { title: 'Best16', location: 'New16', },
        { title: 'Best17', location: 'New17', }
    ];
   
    beforeEach(() => {
        db.drop();
        return Promise.all(
            expArr.map((exp) =>{
                return request
                    .post('/api/experiences')
                    .send(exp);
            })
        );    
    });

    it('/search', () => {
        return request.get('/api/experiences/search')
            .then( ({ body }) => {
                assert.equal( body.length, 16);
            });
    });

    it('/search with limit', () => {
        return request.get('/api/experiences/search?limit=2')
            .then(({ body }) => {
                assert.equal(body.length, 2);
            });
    });
    
    it('/search by location', () => {
        return request.get('/api/experiences/search?location=New1')
            .then(({ body }) => {
                assert.equal(body.length, 1);
            });
    });

    it('/search by tags', () => {
        return request.get('/api/experiences/search?tag=hard')
            .then(({ body }) => {
                assert.equal(body.length, 1);
            });
    });

    it('/search by tags', () => {
        return request.get('/api/experiences/search?tag=soft')
            .then(({ body }) => {
                assert.equal(body.length, 2);
            });
    });


});