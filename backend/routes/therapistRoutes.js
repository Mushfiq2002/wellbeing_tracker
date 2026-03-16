const express = require("express");
const router = express.Router();

const {
getTherapists,
createTherapist,
} = require("../controllers/therapistController");

router.get("/", getTherapists);
router.post("/", createTherapist);

module.exports = router;