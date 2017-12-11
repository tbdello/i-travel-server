const { assert } = require('chai');
const User = require('../../lib/models/user');

describe('User Model', () => {
    let user = null;
    before( ()=> {
        user = new User({
            userName: 'Goat',
            email: 'Goat@Goat.com',
            experiences: '59eb914ffcd9df5be2d25d18' 
        });
        user.generateHash('secret');
    });

    it('should validate the user model', () => {
        assert.equal(user.validateSync(), undefined);
    });
    
    it('checks required fields', () => {
        const badUser = new User();
        return badUser.validate()
            .then(
                () => { throw new Error('User validation error');},
                ({ errors }) => {
                    assert.equal(errors.userName.kind, 'required');
                    assert.equal(errors.hash.kind, 'required');
                }            
            );
    });
});