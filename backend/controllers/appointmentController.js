const crypto = require('crypto');
const Appointment = require('../models/appointmentModel');
const Therapist = require('../models/therapistModel');
const User = require('../models/userModel');

const SESSION_DURATION_MINUTES = 10; // testing: 10 minutes. Later change to 60.

const normalizeName = (name) =>
  name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '').trim();

const findTherapistProfile = async (user) => {
  let therapistProfile = await Therapist.findOne({ user: user._id });

  if (therapistProfile) return therapistProfile;

  const therapists = await Therapist.find();

  therapistProfile = therapists.find(
    (therapist) => normalizeName(therapist.name) === normalizeName(user.name)
  );

  return therapistProfile || null;
};

const timeToMinutes = (time) => {
  let cleanTime = time.trim().toUpperCase();

  const isPM = cleanTime.includes('PM');
  const isAM = cleanTime.includes('AM');

  cleanTime = cleanTime.replace('AM', '').replace('PM', '').trim();

  let [hour, minute] = cleanTime.split(':');
  hour = parseInt(hour, 10);
  minute = minute ? parseInt(minute, 10) : 0;

  if (isPM && hour !== 12) hour += 12;
  if (isAM && hour === 12) hour = 0;

  return hour * 60 + minute;
};

const getAllowedDays = (daysPart) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cleanDays = daysPart.replace(/\s/g, '');

  if (cleanDays.includes('-')) {
    const [startDay, endDay] = cleanDays.split('-');

    const startIndex = dayNames.indexOf(startDay);
    const endIndex = dayNames.indexOf(endDay);

    if (startIndex === -1 || endIndex === -1) return [];

    const allowedDays = [];
    let i = startIndex;

    while (true) {
      allowedDays.push(dayNames[i]);
      if (i === endIndex) break;
      i = (i + 1) % 7;
    }

    return allowedDays;
  }

  return cleanDays.split('/').filter(Boolean);
};

const isValidSlot = (availability, appointmentDate, timeSlot) => {
  try {
    const [daysPart, timePart] = availability.split(',');

    if (!daysPart || !timePart) return true;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDate = new Date(appointmentDate);
    const selectedDay = dayNames[selectedDate.getDay()];

    const allowedDays = getAllowedDays(daysPart);

    if (!allowedDays.includes(selectedDay)) {
      return false;
    }

    const [startTime, endTime] = timePart.trim().split('-');

    if (!startTime || !endTime) return true;

    const selectedMinutes = timeToMinutes(timeSlot);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Supports slots crossing midnight, e.g. 7 PM - 12 AM
    if (endMinutes < startMinutes) {
      return selectedMinutes >= startMinutes || selectedMinutes < endMinutes;
    }

    return selectedMinutes >= startMinutes && selectedMinutes < endMinutes;
  } catch (error) {
    return true;
  }
};

const getAppointmentStartTime = (appointment) => {
  const appointmentStart = new Date(appointment.appointmentDate);
  const [hour, minute] = appointment.timeSlot.split(':');

  appointmentStart.setHours(parseInt(hour, 10));
  appointmentStart.setMinutes(parseInt(minute, 10));
  appointmentStart.setSeconds(0);
  appointmentStart.setMilliseconds(0);

  return appointmentStart;
};

const getAppointmentEndTime = (appointment) => {
  const appointmentStart = getAppointmentStartTime(appointment);

  return new Date(
    appointmentStart.getTime() + SESSION_DURATION_MINUTES * 60 * 1000
  );
};

const updateAppointmentStatus = async (appointment) => {
  if (appointment.status === 'cancelled') return appointment;

  // If therapist manually marks done/missed, do not override it automatically
  if (appointment.therapistMarked) return appointment;

  const appointmentEnd = getAppointmentEndTime(appointment);
  const now = new Date();

  if (now < appointmentEnd) {
    appointment.status = 'pending';
  }

  if (now >= appointmentEnd && !appointment.sessionStarted) {
    appointment.status = 'missed';
  }

  if (
    now >= appointmentEnd &&
    appointment.sessionStarted &&
    !appointment.isReviewed
  ) {
    appointment.status = 'review_pending';
  }

  if (
    now >= appointmentEnd &&
    appointment.sessionStarted &&
    appointment.isReviewed
  ) {
    appointment.status = 'completed';
  }

  await appointment.save();
  return appointment;
};

const createAppointment = async (req, res) => {
  try {
    const { therapist, appointmentDate, timeSlot, modeOfSession, notes } =
      req.body;

    if (!therapist || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        message: 'Please provide therapist, appointment date, and time slot',
      });
    }

    const therapistData = await Therapist.findById(therapist);

    if (!therapistData) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    if (!therapistData.isActive) {
      return res.status(400).json({
        message: 'This therapist is currently not available for booking',
      });
    }

    if (!isValidSlot(therapistData.availability, appointmentDate, timeSlot)) {
      return res.status(400).json({
        message: `This therapist is only available at ${therapistData.availability}`,
      });
    }

    let sessionRoomId = '';
    let meetingLink = '';

    if (modeOfSession === 'online') {
      sessionRoomId = crypto.randomBytes(16).toString('hex');
      meetingLink = `/session/${sessionRoomId}`;
    }

    const user = await User.findById(req.user._id);

    let finalFee = therapistData.consultationFee;
    let discountApplied = false;
    let discountAmount = 0;

    if (user?.discountAvailable) {
      discountApplied = true;
      discountAmount = therapistData.consultationFee * 0.05;
      finalFee = therapistData.consultationFee - discountAmount;

      user.discountAvailable = false;
      await user.save();
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      therapist,
      appointmentDate,
      timeSlot,
      modeOfSession,
      notes,
      status: 'pending',
      sessionRoomId,
      meetingLink,
      sessionStarted: false,
      sessionStartedAt: null,
      sessionEndedAt: null,
      therapistMarked: false,
      therapistMarkedStatus: '',
      therapistMarkedAt: null,
      isReviewed: false,
      reviewedAt: null,
      discountApplied,
      discountAmount,
      finalFee,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate(
        'therapist',
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive'
      )
      .populate('user', 'name email');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to create appointment',
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate(
        'therapist',
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive'
      )
      .sort({ appointmentDate: 1, timeSlot: 1 });

    const updatedAppointments = [];

    for (const appointment of appointments) {
      const updated = await updateAppointmentStatus(appointment);
      updatedAppointments.push(updated);
    }

    res.status(200).json(updatedAppointments);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to get appointments',
    });
  }
};

const getTodayTherapistAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'therapist') {
      return res.status(403).json({
        message: 'Only therapists can view this dashboard',
      });
    }

    const therapistProfile = await findTherapistProfile(req.user);

    if (!therapistProfile) {
      return res.status(404).json({
        message: 'Therapist profile not found for this account',
      });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      therapist: therapistProfile._id,
      appointmentDate: {
        $gte: start,
        $lte: end,
      },
      status: { $ne: 'cancelled' },
    })
      .populate('user', 'name email')
      .populate(
        'therapist',
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive'
      )
      .sort({ appointmentDate: 1, timeSlot: 1 });

    const updatedAppointments = [];

    for (const appointment of appointments) {
      const updated = await updateAppointmentStatus(appointment);
      updatedAppointments.push(updated);
    }

    const onlineCount = updatedAppointments.filter(
      (appointment) => appointment.modeOfSession === 'online'
    ).length;

    const offlineCount = updatedAppointments.filter(
      (appointment) => appointment.modeOfSession === 'offline'
    ).length;

    const doneCount = updatedAppointments.filter(
      (appointment) =>
        appointment.status === 'review_pending' ||
        appointment.status === 'completed'
    ).length;

    const missedCount = updatedAppointments.filter(
      (appointment) => appointment.status === 'missed'
    ).length;

    const pendingCount = updatedAppointments.filter(
      (appointment) => appointment.status === 'pending'
    ).length;

    res.status(200).json({
      total: updatedAppointments.length,
      onlineCount,
      offlineCount,
      doneCount,
      missedCount,
      pendingCount,
      appointments: updatedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to get therapist appointments',
    });
  }
};

const getSessionAccess = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      sessionRoomId: req.params.roomId,
    })
      .populate('user', 'name email')
      .populate(
        'therapist',
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive'
      );

    if (!appointment) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (appointment.modeOfSession !== 'online') {
      return res.status(400).json({ message: 'This is not an online session' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'This appointment has been cancelled',
      });
    }

    const isPatient =
      appointment.user._id.toString() === req.user._id.toString();

    let isTherapist = false;

    if (req.user.role === 'therapist') {
      const therapistProfile = await findTherapistProfile(req.user);

      if (therapistProfile) {
        isTherapist =
          appointment.therapist._id.toString() ===
          therapistProfile._id.toString();
      }
    }

    if (!isPatient && !isTherapist) {
      return res.status(403).json({
        message: 'You are not allowed to join this session',
      });
    }

    const appointmentStart = getAppointmentStartTime(appointment);
    const appointmentEnd = getAppointmentEndTime(appointment);
    const now = new Date();

    if (now < appointmentStart) {
      return res.status(400).json({
        message: 'Session cannot start before the scheduled time',
      });
    }

    if (now > appointmentEnd) {
      await updateAppointmentStatus(appointment);

      return res.status(400).json({
        message: `Session expired. A session lasts exactly ${SESSION_DURATION_MINUTES} minutes.`,
        sessionEnded: true,
        appointment,
      });
    }

    if (!appointment.sessionStarted) {
      appointment.sessionStarted = true;
      appointment.sessionStartedAt = now;
      appointment.sessionEndedAt = appointmentEnd;
      await appointment.save();
    }

    res.status(200).json({
      message: 'Access granted',
      appointment,
      sessionStartTime: appointmentStart,
      sessionEndTime: appointmentEnd,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to access session',
    });
  }
};

const startSession = async (req, res) => {
  try {
    if (req.user.role !== 'therapist') {
      return res.status(403).json({
        message: 'Only therapist can start the session',
      });
    }

    const appointment = await Appointment.findById(req.params.id).populate(
      'therapist',
      'name specialization'
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.modeOfSession !== 'online') {
      return res.status(400).json({
        message: 'Only online session can be started',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cancelled appointment cannot be started',
      });
    }

    const therapistProfile = await findTherapistProfile(req.user);

    if (
      !therapistProfile ||
      appointment.therapist._id.toString() !== therapistProfile._id.toString()
    ) {
      return res.status(403).json({
        message: 'You are not allowed to start this session',
      });
    }

    const appointmentStart = getAppointmentStartTime(appointment);
    const appointmentEnd = getAppointmentEndTime(appointment);
    const now = new Date();

    if (now < appointmentStart) {
      return res.status(400).json({
        message: 'Session cannot start before the scheduled time',
      });
    }

    if (now > appointmentEnd) {
      appointment.sessionEndedAt = appointmentEnd;
      await updateAppointmentStatus(appointment);

      return res.status(400).json({
        message: 'Session time has already expired',
      });
    }

    appointment.sessionStarted = true;
    appointment.sessionStartedAt = now;
    appointment.sessionEndedAt = appointmentEnd;

    const updatedAppointment = await appointment.save();

    res.status(200).json({
      message: 'Session started successfully',
      appointment: updatedAppointment,
      sessionEndTime: appointmentEnd,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to start session',
    });
  }
};

const markSessionStatus = async (req, res) => {
  try {
    if (req.user.role !== 'therapist') {
      return res.status(403).json({
        message: 'Only therapist can mark session status',
      });
    }

    const { mark } = req.body;

    if (!['done', 'missed'].includes(mark)) {
      return res.status(400).json({
        message: 'Mark must be either done or missed',
      });
    }

    const appointment = await Appointment.findById(req.params.id).populate(
      'therapist',
      'name specialization'
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cancelled appointment cannot be marked',
      });
    }

    const therapistProfile = await findTherapistProfile(req.user);

    if (
      !therapistProfile ||
      appointment.therapist._id.toString() !== therapistProfile._id.toString()
    ) {
      return res.status(403).json({
        message: 'You are not allowed to mark this appointment',
      });
    }

    appointment.therapistMarked = true;
    appointment.therapistMarkedStatus = mark;
    appointment.therapistMarkedAt = new Date();

    if (mark === 'done') {
      appointment.sessionStarted = true;
      appointment.sessionStartedAt =
        appointment.sessionStartedAt || getAppointmentStartTime(appointment);
      appointment.sessionEndedAt = getAppointmentEndTime(appointment);
      appointment.status = appointment.isReviewed
        ? 'completed'
        : 'review_pending';
    }

    if (mark === 'missed') {
      appointment.sessionStarted = false;
      appointment.sessionStartedAt = null;
      appointment.sessionEndedAt = getAppointmentEndTime(appointment);
      appointment.status = 'missed';
    }

    const updatedAppointment = await appointment.save();

    res.status(200).json({
      message: `Session marked as ${mark}`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to mark session status',
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized to cancel this appointment',
      });
    }

    appointment.status = 'cancelled';

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to cancel appointment',
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getTodayTherapistAppointments,
  getSessionAccess,
  startSession,
  markSessionStatus,
  cancelAppointment,
};