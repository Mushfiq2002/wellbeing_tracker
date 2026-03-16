const Therapist = require('../models/therapistModel');

// Get all therapists
const getTherapists = async (req, res, next) => {
try {
const therapists = await Therapist.find();
res.status(200).json(therapists);
} catch (error) {
next(error);
}
};

// Create therapist
const createTherapist = async (req, res, next) => {
try {
const {
name,
specialization,
location,
consultationFee,
availability,
modeOfSession,
} = req.body;

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
next(error);
}
};

module.exports = {
getTherapists,
createTherapist,
};