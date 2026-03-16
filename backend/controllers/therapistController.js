const Therapist = require('../models/therapistModel');

// @desc    Get all therapists
// @route   GET /api/therapists
// @access  Public
const getTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({});
    res.status(200).json(therapists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create therapist
// @route   POST /api/therapists
// @access  Public
const createTherapist = async (req, res) => {
  try {
    const {
      name,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession,
    } = req.body;

    if (
      !name ||
      !specialization ||
      !location ||
      !consultationFee ||
      !availability
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const therapist = await Therapist.create({
      name,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession,
    });

    res.status(201).json(therapist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete therapist
// @route   DELETE /api/therapists/:id
// @access  Public
const deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    await therapist.deleteOne();

    res.status(200).json({ message: 'Therapist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTherapists,
  createTherapist,
  deleteTherapist,
};