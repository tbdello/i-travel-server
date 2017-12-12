const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Experience API', () => {
    let experience = null;
    let image = { imageURI:'http://i.dailymail.co.uk/i/pix/2016/09/06/11/37F60FD200000578-0-image-a-5_1473156426673.jpg', caption: 'rock' };

    beforeEach(() =>{
        db.drop();
        return request.post('/api/images/')
            .send(image)
            .then( ({ body }) => image = body);
    });
    it('/POST an experience', () => {
        experience = {title: 'Best', location: 'New York', images:[image._id] };
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
        experience = {title: 'Best', location: 'New York', images:[image._id] };
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


    it.skip('/Delete experience', () => {
        const url = `/api/experiences/${experience._id}`;
        return request.delete(url)
            .then(() => request.get(url))
            .then(
                () => { throw new Error('unexpected success response'); },
                res => assert.equal(res.status, 404)
            );
    });
});