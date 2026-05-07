const mongoose = require('mongoose');
const Appointment = require('./models/appointmentModel');
const User = require('./models/userModel');
require('dotenv').config({ path: './.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ name: /mushfiq/i });
  if (!user) {
    console.log("User Mushfiq not found");
    process.exit(1);
  }
  const appointments = await Appointment.find({ user: user._id }).populate('therapist');
  console.log(JSON.stringify(appointments.map(a => ({
    date: a.appointmentDate,
    status: a.status,
    therapistIdInAppt: a.therapist ? a.therapist._id : "null",
    therapistName: a.therapist ? a.therapist.name : "Therapist field is null"
  })), null, 2));
  mongoose.disconnect();
}
run();
