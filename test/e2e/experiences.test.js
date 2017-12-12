const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

describe('Experience API', () => {


    beforeEach(() => db.drop());

    let expense = { name: 'doughnuts', amount: 30 };

    it('/POST a experience', () => {
        return request
            .post('/api/exp')
            .send(expense)
            .then(({ body }) => {
                assert.isOk(body._id);
                for (const key of ['name', 'url']) {
                    assert.equal(body[key], expense[key]);
                }
                expense = body;
            });
    });
    it('/Delete experience', () => {
        const url = `/api/exp/${expense._id}`;
        return request.delete(url)
            .then(() => request.get(url))
            .then(
                () => { throw new Error('unexpected success response'); },
                res => assert.equal(res.status, 404)
            );
    });
});