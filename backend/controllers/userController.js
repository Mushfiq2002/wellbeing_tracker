const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Therapist = require('../models/therapistModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Therapist signup restriction
    if (role === 'therapist') {
      const therapistExists = await Therapist.findOne({
        name: normalizedName,
        email: normalizedEmail,
      });

      if (!therapistExists) {
        res.status(400);
        throw new Error(
          'You are not authorized to sign up as a therapist. Please use the exact name and email from the therapist list.'
        );
      }

      if (therapistExists.user) {
        res.status(400);
        throw new Error('This therapist account is already registered');
      }
    }

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: role || 'user',
    });

    // Link therapist profile with user account
    if (user.role === 'therapist') {
      await Therapist.findOneAndUpdate(
        {
          name: user.name,
          email: user.email,
        },
        {
          user: user._id,
        }
      );
    }

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      // Update login info for Emergency Alert System
      user.lastLogin = Date.now();
      user.warningEmailSentAt = null;
      user.emergencyAlertSentAt = null;
      await user.save();

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get emergency contacts
// @route   GET /api/users/emergency-contacts
// @access  Private
const getEmergencyContacts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json(user.emergencyContacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Add an emergency contact
// @route   POST /api/users/emergency-contacts
// @access  Private
const addEmergencyContact = async (req, res, next) => {
  try {
    const { name, email, relation } = req.body;
    if (!name || !email || !relation) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.emergencyContacts.push({ name, email, relation });
    await user.save();
    res.status(201).json(user.emergencyContacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an emergency contact
// @route   PUT /api/users/emergency-contacts/:contactId
// @access  Private
const updateEmergencyContact = async (req, res, next) => {
  try {
    const { name, email, relation } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const contact = user.emergencyContacts.id(req.params.contactId);
    if (!contact) {
      res.status(404);
      throw new Error('Contact not found');
    }

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (relation) contact.relation = relation;

    await user.save();
    res.status(200).json(user.emergencyContacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an emergency contact
// @route   DELETE /api/users/emergency-contacts/:contactId
// @access  Private
const removeEmergencyContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const contact = user.emergencyContacts.id(req.params.contactId);
    if (!contact) {
      res.status(404);
      throw new Error('Contact not found');
    }

    user.emergencyContacts.pull(req.params.contactId);
    await user.save();
    res.status(200).json(user.emergencyContacts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  removeEmergencyContact,
};