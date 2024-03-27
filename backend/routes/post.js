const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const paginatedResults = require('../middlewares/paginatedResults');
const postController = require('../controllers/postController');
const uploadImage = require('../middlewares/uploadImage');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('', verifyJWT, paginatedResults('post'), postController.getPosts);
router.post('', verifyJWT, uploadImage.uploadPostPhoto.array('photos', 4), postController.createPost);
router.get('/:post_id', verifyJWT, postController.getPostByID);
router.delete('/:post_id', verifyJWT, postController.DeletePost);
router.get('/:post_id/comments', commentController.getComment);
router.post('/:post_id/comments', verifyJWT, commentController.createComment);
router.get('/:post_id/comments/:comment_id/replies', commentController.getReply);
router.post('/:post_id/like', verifyJWT, postController.LikePost);
router.delete('/:post_id/like', verifyJWT, postController.UnlikePost);
router.get('/user/:user_id', verifyJWT, paginatedResults('postByUser'), postController.getPostsByUser);

module.exports = router;