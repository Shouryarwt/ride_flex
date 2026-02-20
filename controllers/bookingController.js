const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: 'vehicleId, startDate and endDate are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid booking date range' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.isActive) {
      return res.status(404).json({ message: 'Vehicle not available' });
    }

    const overlappingBooking = await Booking.findOne({
      vehicle: vehicleId,
      bookingStatus: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
        { startDate: { $gte: start, $lt: end } },
        { endDate: { $gt: start, $lte: end } },
      ],
    });

    if (overlappingBooking) {
      return res.status(409).json({ message: 'Vehicle already booked for selected time slot' });
    }

    const totalHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const fullDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    const totalAmount = fullDays * vehicle.pricePerDay + remainingHours * vehicle.pricePerHour;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate: start,
      endDate: end,
      totalHours,
      totalAmount,
    });

    return res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    return next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle', 'title type city images pricePerHour pricePerDay')
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    return next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.bookingStatus = status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('vehicle', 'title type city');

    return res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    return next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(bookingStatus)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(id, { bookingStatus }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};
