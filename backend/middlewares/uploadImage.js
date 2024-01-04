const multer = require('multer');

const AvatarImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/avatar');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const CoverPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/cover');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const PostPhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/post');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const uploadAvatar = multer({ storage: AvatarImage });
const uploadCover = multer({ storage: CoverPhoto });
const uploadPostPhoto = multer({storage: PostPhoto})

module.exports = { uploadAvatar, uploadCover, uploadPostPhoto };