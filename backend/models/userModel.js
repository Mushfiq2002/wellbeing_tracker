const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['user', 'therapist'],
      default: 'user',
    },
    description: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
    },
    warningEmailSentAt: {
      type: Date,
    },
    emergencyAlertSentAt: {
      type: Date,
    },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        relation: { type: String, required: true },
      }
    ],
    discountAvailable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);