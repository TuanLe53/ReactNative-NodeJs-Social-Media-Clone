const express = require('express');
const chatController = require('../controllers/chatController');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router.get('/room', verifyJWT, chatController.getRoomsByUser);
router.post('/room/:receiver', verifyJWT, chatController.createRoom);
router.get('/room-with-user/:receiver', verifyJWT, chatController.getRoomBetweenUsers);
router.get('/message/:roomId', chatController.getMessage);

module.exports = router;