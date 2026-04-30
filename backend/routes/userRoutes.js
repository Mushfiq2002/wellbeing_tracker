const express = require('express');
const router = express.Router();
const { getUsers, registerUser, loginUser, getEmergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getUsers).post(registerUser);
router.post('/login', loginUser);

router.route('/emergency-contacts')
    .get(protect, getEmergencyContacts)
    .post(protect, addEmergencyContact);

router.route('/emergency-contacts/:contactId')
    .put(protect, updateEmergencyContact)
    .delete(protect, removeEmergencyContact);

module.exports = router;
