const { assert } = require('chai');
const Experience = require('../../lib/models/experience');

describe('Experience Model', () => {
    const experience = new Experience({
        location: 'home'
    });

    it('should validate the experience model', () => {
        assert.equal(experience.validateSync(), undefined);
    });

    it.skip('checks required fields', () => {
        const badexp = new Experience();
        return badexp.validate()
            .then(
                () => { throw new Error('User validation error'); },
                ({ errors }) => {
                    assert.equal(errors.location.kind, 'required');
                }
            );
    });
});