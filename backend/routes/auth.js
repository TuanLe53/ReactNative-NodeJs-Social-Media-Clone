const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get('/update_token', authController.updateRefreshToken);
router.post('/reset_password_token', authController.resetPasswordToken);
router.post('/reset_password', authController.resetPassword);

module.exports = router;