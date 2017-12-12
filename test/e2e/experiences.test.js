const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Experience API', () => {


    beforeEach(() => db.drop());

    let experience = { location: 'doughnuts', tags: '30' };

    it('/POST a experience', () => {
        return request
            .post('/api/experiences')
            .send(experience)
            .then(({ body }) => {
                experience = body;
                assert.isOk(body._id);
                assert.equal(body.location, 'doughnuts');
            });
    });

    it('/Delete experience', () => {
        const url = `/api/experiences/${experience._id}`;
        return request.delete(url)
            .then(() => request.get(url))
            .then(
                () => { throw new Error('unexpected success response'); },
                res => assert.equal(res.status, 404)
            );
    });
});