// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/registerAudience', authController.registerAudience);
router.post('/login', authController.login);

module.exports = router;