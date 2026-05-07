const mongoose = require('mongoose');
const Appointment = require('./backend/models/appointmentModel');
const Therapist = require('./backend/models/therapistModel');
require('dotenv').config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const appointments = await Appointment.find().populate('therapist');
  console.log(JSON.stringify(appointments.map(a => ({
    id: a._id,
    status: a.status,
    therapist: a.therapist
  })), null, 2));
  mongoose.disconnect();
}
run();
