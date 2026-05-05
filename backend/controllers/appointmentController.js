const crypto = require('crypto');
const Appointment = require('../models/appointmentModel');
const Therapist = require('../models/therapistModel');
const User = require('../models/userModel');

const SESSION_DURATION_MINUTES = 10;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const normalizeDay = (day = '') => {
  return day.trim().slice(0, 3);
};

const convertToMinutes = (time) => {
  if (!time) return null;

  const cleanTime = time.trim();

  const format24 = cleanTime.match(/^(\d{1,2}):(\d{2})$/);
  if (format24) {
    const hour = parseInt(format24[1], 10);
    const minute = parseInt(format24[2], 10);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return hour * 60 + minute;
  }

  const format12 = cleanTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (format12) {
    let hour = parseInt(format12[1], 10);
    const minute = parseInt(format12[2] || '0', 10);
    const period = format12[3].toUpperCase();

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return hour * 60 + minute;
  }

  return null;
};

const isWithinAvailability = (availability, appointmentDate, timeSlot) => {
  const [dayPart, timePart] = availability.split(',').map((p) => p.trim());

  if (!dayPart || !timePart) return false;

  const selectedDate = new Date(appointmentDate);
  const selectedDay = DAYS[selectedDate.getDay()];

  const [startDayRaw, endDayRaw] = dayPart.split('-');

  const startDay = normalizeDay(startDayRaw);
  const endDay = normalizeDay(endDayRaw);

  const startDayIndex = DAYS.indexOf(startDay);
  const endDayIndex = DAYS.indexOf(endDay);
  const selectedDayIndex = DAYS.indexOf(selectedDay);

  if (startDayIndex === -1 || endDayIndex === -1) return false;

  let dayAllowed = false;

  if (startDayIndex <= endDayIndex) {
    dayAllowed =
      selectedDayIndex >= startDayIndex && selectedDayIndex <= endDayIndex;
  } else {
    dayAllowed =
      selectedDayIndex >= startDayIndex || selectedDayIndex <= endDayIndex;
  }

  if (!dayAllowed) return false;

  const [startTimeText, endTimeText] = timePart.split('-').map((t) => t.trim());

  const startMinutes = convertToMinutes(startTimeText);
  const endMinutes = convertToMinutes(endTimeText);
  const selectedMinutes = convertToMinutes(timeSlot);

  if (
    startMinutes === null ||
    endMinutes === null ||
    selectedMinutes === null
  ) {
    return false;
  }

  return selectedMinutes >= startMinutes && selectedMinutes <= endMinutes;
};

const normalizeName = (name = '') =>
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

const getAppointmentStartTime = (appointment) => {
  const start = new Date(appointment.appointmentDate);
  const minutes = convertToMinutes(appointment.timeSlot);

  if (minutes === null) return start;

  start.setHours(Math.floor(minutes / 60));
  start.setMinutes(minutes % 60);
  start.setSeconds(0);
  start.setMilliseconds(0);

  return start;
};

const getAppointmentEndTime = (appointment) => {
  const start = getAppointmentStartTime(appointment);
  return new Date(start.getTime() + SESSION_DURATION_MINUTES * 60 * 1000);
};

const updateAppointmentStatus = async (appointment) => {
  if (appointment.status === 'cancelled') return appointment;
  if (appointment.therapistMarked) return appointment;

  const now = new Date();
  const end = getAppointmentEndTime(appointment);

  if (now < end) {
    appointment.status = 'pending';
  }

  if (now >= end && !appointment.userJoined) {
    appointment.status = 'missed';
  }

  if (now >= end && appointment.userJoined && !appointment.isReviewed) {
    appointment.status = 'review_pending';
  }

  if (now >= end && appointment.userJoined && appointment.isReviewed) {
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

    const selectedMinutes = convertToMinutes(timeSlot);

    if (selectedMinutes === null) {
      return res.status(400).json({
        message: 'Invalid time slot format. Use format like 6 PM, 6:30 PM, or 18:30',
      });
    }

    const appointmentStart = new Date(appointmentDate);
    appointmentStart.setHours(Math.floor(selectedMinutes / 60));
    appointmentStart.setMinutes(selectedMinutes % 60);
    appointmentStart.setSeconds(0);
    appointmentStart.setMilliseconds(0);

    const now = new Date();

    if (appointmentStart <= now) {
      return res.status(400).json({
        message: 'You cannot book an appointment in the past',
      });
    }

    const allowedByAvailability = isWithinAvailability(
      therapistData.availability,
      appointmentDate,
      timeSlot
    );

    if (!allowedByAvailability) {
      return res.status(400).json({
        message: `Appointment must be within therapist availability: ${therapistData.availability}`,
      });
    }

    const selectedMode = modeOfSession || 'online';

    if (
      therapistData.modeOfSession !== 'both' &&
      therapistData.modeOfSession !== selectedMode
    ) {
      return res.status(400).json({
        message: `This therapist only supports ${therapistData.modeOfSession} sessions`,
      });
    }

    const alreadyBooked = await Appointment.findOne({
      therapist,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (alreadyBooked) {
      return res.status(400).json({
        message: 'This time slot is already booked',
      });
    }

    let sessionRoomId = '';
    let meetingLink = '';

    if (selectedMode === 'online') {
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
      modeOfSession: selectedMode,
      notes: notes || '',
      status: 'pending',
      sessionRoomId,
      meetingLink,
      sessionStarted: false,
      sessionStartedAt: null,
      sessionEndedAt: null,
      userJoined: false,
      userJoinedAt: null,
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
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive ratingWarning'
      )
      .populate('user', 'name email discountAvailable');

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
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive ratingWarning'
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
      appointmentDate: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' },
    })
      .populate('user', 'name email')
      .populate(
        'therapist',
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive ratingWarning'
      )
      .sort({ appointmentDate: 1, timeSlot: 1 });

    const updatedAppointments = [];

    for (const appointment of appointments) {
      const updated = await updateAppointmentStatus(appointment);
      updatedAppointments.push(updated);
    }

    const activeAppointments = updatedAppointments.filter(
      (a) => a.status === 'pending'
    );

    const doneAppointments = updatedAppointments.filter(
      (a) => a.status === 'review_pending' || a.status === 'completed'
    );

    const missedAppointments = updatedAppointments.filter(
      (a) => a.status === 'missed'
    );

    const onlineCount = activeAppointments.filter(
      (a) => a.modeOfSession === 'online'
    ).length;

    const offlineCount = activeAppointments.filter(
      (a) => a.modeOfSession === 'offline'
    ).length;

    const dayWise = {};

    updatedAppointments.forEach((appointment) => {
      const dateKey = appointment.appointmentDate.toISOString().split('T')[0];

      if (!dayWise[dateKey]) {
        dayWise[dateKey] = {
          date: dateKey,
          total: 0,
          online: 0,
          offline: 0,
          pending: 0,
          done: 0,
          missed: 0,
          appointments: [],
        };
      }

      if (appointment.status === 'pending') {
        dayWise[dateKey].total += 1;
        dayWise[dateKey].pending += 1;

        if (appointment.modeOfSession === 'online') {
          dayWise[dateKey].online += 1;
        }

        if (appointment.modeOfSession === 'offline') {
          dayWise[dateKey].offline += 1;
        }
      }

      if (
        appointment.status === 'review_pending' ||
        appointment.status === 'completed'
      ) {
        dayWise[dateKey].done += 1;
      }

      if (appointment.status === 'missed') {
        dayWise[dateKey].missed += 1;
      }

      dayWise[dateKey].appointments.push(appointment);
    });

    res.status(200).json({
      total: activeAppointments.length,
      onlineCount,
      offlineCount,
      doneCount: doneAppointments.length,
      missedCount: missedAppointments.length,
      pendingCount: activeAppointments.length,
      dayWise: Object.values(dayWise),
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
        'name specialization location consultationFee availability modeOfSession rating totalReviews reviews isActive ratingWarning user'
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
    }

    if (isPatient && !appointment.userJoined) {
      appointment.userJoined = true;
      appointment.userJoinedAt = now;
    }

    await appointment.save();

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
      'name specialization user'
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
      'name specialization user'
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

      if (!appointment.userJoined) {
        appointment.userJoined = true;
        appointment.userJoinedAt = appointment.sessionStartedAt;
      }

      appointment.status = appointment.isReviewed
        ? 'completed'
        : 'review_pending';
    }

    if (mark === 'missed') {
      appointment.sessionStarted = false;
      appointment.sessionStartedAt = null;
      appointment.sessionEndedAt = getAppointmentEndTime(appointment);
      appointment.userJoined = false;
      appointment.userJoinedAt = null;
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