const express = require('express');
const router = express.Router();
const {
  addMedicine,
  getMedicines,
  deleteMedicine,
  getTodayReminders,
  markAsTaken,
} = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').post(addMedicine).get(getMedicines);
router.route('/today').get(getTodayReminders);
router.route('/:id').delete(deleteMedicine);
router.route('/:id/taken').patch(markAsTaken);

module.exports = router;
