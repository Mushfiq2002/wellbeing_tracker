const express = require('express');
const router = express.Router();

const {
  getTherapists,
  createTherapist,
  deleteTherapist,
} = require('../controllers/therapistController');

router.route('/').get(getTherapists).post(createTherapist);
router.route('/:id').delete(deleteTherapist);

module.exports = router;