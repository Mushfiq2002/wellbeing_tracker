const mongoose = require('mongoose');

const therapistSchema = mongoose.Schema(
{
name: {
type: String,
required: true,
},
specialization: {
type: String,
required: true,
},
location: {
type: String,
required: true,
},
consultationFee: {
type: Number,
required: true,
},
availability: {
type: String,
required: true,
},
modeOfSession: {
type: String,
enum: ['online', 'offline', 'both'],
default: 'both',
},
},
{
timestamps: true,
}
);

module.exports = mongoose.model('Therapist', therapistSchema);