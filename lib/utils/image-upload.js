const multer = require('multer');

const multerOption = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn’t allowed'});
        }
    }
};

module.exports = () => multer(multerOption).single('image');
