const express = require('express');
const router = express.Router();
const { getUsers, registerUser } = require('../controllers/userController');

router.route('/').get(getUsers).post(registerUser);

module.exports = router;
