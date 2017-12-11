const { assert } = require('chai');
const Experience = require('../../lib/models/experience');

describe.skip('Experience Model', () => {
    const experience = new Experience({
    });

    it('should validate the user model', () => {
        assert.equal(experience.validateSync(), undefined);
    });

    it('checks required fields', () => {
        const badUser = new Experience();
        return badUser.validate()
            .then(
                () => { throw new Error('User validation error'); },
                ({ errors }) => {
                    assert.equal(errors.userName.kind, 'required');
                }
            );
    });
});