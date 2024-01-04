const express = require('express');
const profileController = require('../controllers/profileController');
const uploadImage = require('../middlewares/uploadImage');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router.get('/', verifyJWT, profileController.getProfiles);
router.get('/:id', profileController.getProfile);
router.put('/bio', verifyJWT, profileController.updateBio);
router.put('/avatar', verifyJWT, uploadImage.uploadAvatar.single('avatar'), profileController.updateAvatar);
router.put('/cover', verifyJWT, uploadImage.uploadCover.single('cover'), profileController.updateCover);
router.get('/follow/:profile_id', verifyJWT, profileController.isFollow);
router.post('/follow/:profile_id', verifyJWT, profileController.followUser);
router.delete('/follow/:profile_id', verifyJWT, profileController.unFollowUser);

module.exports = router;