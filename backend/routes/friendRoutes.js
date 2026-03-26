const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getIncomingRequests,
    getSentRequests,
    getFriends
} = require('../controllers/friendController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/users', getAllUsers);
router.post('/send/:receiverId', sendRequest);
router.delete('/cancel/:receiverId', cancelRequest);
router.patch('/accept/:senderId', acceptRequest);
router.patch('/reject/:senderId', rejectRequest);
router.delete('/remove/:friendId', removeFriend);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/sent', getSentRequests);
router.get('/friends', getFriends);

module.exports = router;
