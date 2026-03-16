const Medicine = require('../models/medicineModel');
const ReminderLog = require('../models/reminderLogModel');

// @desc    Add a new medicine
// @route   POST /api/medicines
// @access  Private
const addMedicine = async (req, res) => {
  try {
    const { medicineName, times } = req.body;

    if (!medicineName || !times || times.length === 0) {
      return res.status(400).json({ message: 'Please add medicine name and at least one time' });
    }

    const medicine = await Medicine.create({
      user: req.user._id,
      medicineName,
      times,
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all medicines for the logged in user
// @route   GET /api/medicines
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a medicine by id
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check for user ownership
    if (medicine.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this medicine' });
    }

    await medicine.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's reminders
// @route   GET /api/medicines/today
// @access  Private
const getTodayReminders = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format based on local time or UTC
    const today = new Date();
    // Using string manipulation to ensure YYYY-MM-DD format reliably
    const dateStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');

    // Fetch all medicines for the logged in user
    const medicines = await Medicine.find({ user: req.user._id });

    // We'll collect all today's logs here
    let todayLogs = [];

    // For each medicine, check if reminder log exists for today
    for (const medicine of medicines) {
      for (const time of medicine.times) {
        let log = await ReminderLog.findOne({
          user: req.user._id,
          medicine: medicine._id,
          date: dateStr,
          time: time,
        });

        // If log doesn't exist, create it (default taken: false)
        if (!log) {
          log = await ReminderLog.create({
            user: req.user._id,
            medicine: medicine._id,
            time: time,
            date: dateStr,
          });
        }
        todayLogs.push(log);
      }
    }

    // Populate the medicine details (like name) into the logs
    const populatedLogs = await ReminderLog.find({
      _id: { $in: todayLogs.map(log => log._id) }
    }).populate('medicine', 'medicineName');

    res.status(200).json(populatedLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark reminder as taken
// @route   PATCH /api/medicines/:id/taken
// @access  Private
const markAsTaken = async (req, res) => {
  try {
    const log = await ReminderLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: 'Reminder log not found' });
    }

    // Check ownership
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    log.taken = true;
    const updatedLog = await log.save();
    
    // Return with populated medicine
    const populatedLog = await ReminderLog.findById(updatedLog._id).populate('medicine', 'medicineName');

    res.status(200).json(populatedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  deleteMedicine,
  getTodayReminders,
  markAsTaken,
};
