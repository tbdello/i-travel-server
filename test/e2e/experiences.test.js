const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Experience API', () => {
    let image = { imageURI:'http://i.dailymail.co.uk/i/pix/2016/09/06/11/37F60FD200000578-0-image-a-5_1473156426673.jpg', caption: 'rock' };
    let experience =null;

    beforeEach(() =>{
        db.drop();
        return request.post('/api/images/')
            .send(image)
            .then( ({ body }) =>{
                image = body;
                experience = { title: 'Best', location: 'New York222', images:[image._id] };
            });

    });
    it('/POST an experience', () => {
        return request
            .post('/api/experiences')
            .send(experience)
            .then(({ body }) => {
                experience = body;
                assert.isOk(body._id);
                assert.equal(body.location, 'New York');
                
            });
    });

    it('/ Gets and populates exp by id', () => {
        return request.post('/api/experiences')
            .send(experience)
            .then(({ body })=> {
                return request.get(`/api/experiences/${body._id}`);
            })
            .then( ({ body }) => {
                console.log('we got back', body);
                assert.equal( body.images[0].imageURI, 
                    'http://i.dailymail.co.uk/i/pix/2016/09/06/11/37F60FD200000578-0-image-a-5_1473156426673.jpg'
                );
            });
    });


    it('/Delete experience', () => {
        let id = null;
        return request.post('/api/experiences')
            .send(experience)
            .then(({ body })=> {
                id = body._id;
                console.log('id is', id);
                return request.delete(`api/experiences/${id}`);
            })
            .then(() => request.get(`api/experiences/${id}`))
            .then(
                () => { throw new Error('unexpected success response'); },
                res => assert.equal(res.status, 404)
            );
    });

});