const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/:post_id', commentController.getComment);
router.post('', verifyJWT, commentController.createComment);
router.get('/reply/:comment_id', commentController.getReply);

module.exports = router;