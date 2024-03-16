const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const postController = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');

const router = express.Router();

router.get('', verifyJWT, postController.getPosts);
router.post('', verifyJWT, uploadImage.uploadPostPhoto.array('photos', 4), postController.createPost);
router.get('/:post_id', verifyJWT, postController.getPostByID);
router.delete('/:post_id', verifyJWT, postController.DeletePost);
router.post('/:post_id/like', verifyJWT, postController.LikePost);
router.delete('/:post_id/like', verifyJWT, postController.UnlikePost);
router.get('/user/:user_id', verifyJWT, postController.getPostsByUser);

module.exports = router;