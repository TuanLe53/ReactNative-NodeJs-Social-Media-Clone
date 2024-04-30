const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.post('', verifyJWT, notificationController.assignDeviceToken);

module.exports = router;