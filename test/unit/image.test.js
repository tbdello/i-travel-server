const { assert } = require('chai');
const Image = require('../../lib/models/image');

describe('Image Model', () => {
    const image = new Image({
        imageURI: 'home.vga'
    });

    it('should validate the Image model', () => {
        assert.equal(image.validateSync(), undefined);
    });

    it('checks required fields', () => {
        const badExp = new Image();
        return badExp.validate()
            .then(
                () => {throw new Error('User validation error');},
                ({ errors }) => {
                    assert.equal(errors.imageURI.kind, 'required'); 
                }
            );
    });
});