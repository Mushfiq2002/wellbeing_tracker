const User = require('../models/userModel');
const FriendRequest = require('../models/friendRequestModel');

// @desc    Get all users (role 'user') excluding current user
// @route   GET /api/friends/users
// @access  Private
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: 'user', 
            _id: { $ne: req.user._id } 
        }).select('_id name description');

        res.status(200).json(users);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch users');
    }
};

// @desc    Send a friend request to receiver
// @route   POST /api/friends/send/:receiverId
// @access  Private
const sendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === 'rejected') {
                existingRequest.status = 'pending';
                existingRequest.sender = senderId;
                existingRequest.receiver = receiverId;
                await existingRequest.save();
                return res.status(200).json(existingRequest);
            }
            res.status(400);
            throw new Error('Request already exists');
        }

        const friendRequest = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message || 'Failed to send friend request');
    }
};

// @desc    Cancel a pending request sent by the user
// @route   DELETE /api/friends/cancel/:receiverId
// @access  Private
const cancelRequest = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;

        const request = await FriendRequest.findOneAndDelete({
            sender: senderId,
            receiver: receiverId,
            status: 'pending'
        });

        if (!request) {
            res.status(404);
            throw new Error('Pending request not found');
        }

        res.status(200).json({ message: 'Request cancelled' });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message || 'Failed to cancel request');
    }
};

// @desc    Accept an incoming friend request
// @route   PATCH /api/friends/accept/:senderId
// @access  Private
const acceptRequest = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user._id;

        const request = await FriendRequest.findOneAndUpdate(
            { sender: senderId, receiver: receiverId, status: 'pending' },
            { status: 'accepted' },
            { new: true }
        );

        if (!request) {
            res.status(404);
            throw new Error('Incoming pending request not found');
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message || 'Failed to accept request');
    }
};

// @desc    Reject an incoming friend request
// @route   PATCH /api/friends/reject/:senderId
// @access  Private
const rejectRequest = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user._id;

        const request = await FriendRequest.findOneAndUpdate(
            { sender: senderId, receiver: receiverId, status: 'pending' },
            { status: 'rejected' },
            { new: true }
        );

        if (!request) {
            res.status(404);
            throw new Error('Incoming pending request not found');
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message || 'Failed to reject request');
    }
};

// @desc    Remove an accepted friend relationship
// @route   DELETE /api/friends/remove/:friendId
// @access  Private
const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        const currentUserId = req.user._id;

        const request = await FriendRequest.findOneAndDelete({
            status: 'accepted',
            $or: [
                { sender: currentUserId, receiver: friendId },
                { sender: friendId, receiver: currentUserId }
            ]
        });

        if (!request) {
            res.status(404);
            throw new Error('Friend relationship not found');
        }

        res.status(200).json({ message: 'Friend removed' });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message || 'Failed to remove friend');
    }
};

// @desc    Get all incoming pending friend requests
// @route   GET /api/friends/requests/incoming
// @access  Private
const getIncomingRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            receiver: req.user._id,
            status: 'pending'
        }).populate('sender', 'name description');

        res.status(200).json(requests);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch incoming requests');
    }
};

// @desc    Get all outgoing pending friend requests
// @route   GET /api/friends/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            sender: req.user._id,
            status: { $in: ['pending', 'rejected'] }
        });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch sent requests');
    }
};

// @desc    Get all accepted friends
// @route   GET /api/friends/friends
// @access  Private
const getFriends = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            status: 'accepted',
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        }).populate('sender receiver', 'name description');

        res.status(200).json(requests);
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch friends');
    }
};

module.exports = {
    getAllUsers,
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getIncomingRequests,
    getSentRequests,
    getFriends
};
