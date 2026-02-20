const Dealer = require('../models/Dealer');
const Vehicle = require('../models/Vehicle');

const addVehicle = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      engineSegment,
      city,
      images = [],
      pricePerHour,
      pricePerDay,
      deliveryAvailable = false,
      deliveryChargePerKm = 0,
    } = req.body;

    if (!title || !type || !engineSegment || !city || pricePerHour == null || pricePerDay == null) {
      return res.status(400).json({ message: 'Missing required vehicle fields' });
    }

    const dealer = await Dealer.findOne({ user: req.user._id });
    if (!dealer) {
      return res.status(403).json({ message: 'Dealer profile required to add vehicle' });
    }

    if (dealer.approvalStatus !== 'approved') {
      return res.status(403).json({ message: 'Dealer is not approved yet' });
    }

    const vehicle = await Vehicle.create({
      seller: req.user._id,
      dealer: dealer._id,
      title,
      description,
      type,
      engineSegment,
      city,
      images,
      pricePerHour,
      pricePerDay,
      deliveryAvailable,
      deliveryChargePerKm,
    });

    return res.status(201).json({ message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    return next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (req.user.role !== 'admin' && vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this vehicle' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    return next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (req.user.role !== 'admin' && vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this vehicle' });
    }

    await vehicle.deleteOne();
    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const { type, engineSegment, minPrice, maxPrice, deliveryAvailable, city } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (engineSegment) filter.engineSegment = engineSegment;
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (deliveryAvailable !== undefined) filter.deliveryAvailable = deliveryAvailable === 'true';

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter)
      .populate('seller', 'name email phone')
      .populate('dealer', 'shopName city ownerName approvalStatus');

    return res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    return next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('seller', 'name email phone')
      .populate('dealer', 'shopName city ownerName approvalStatus');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ vehicle });
  } catch (error) {
    return next(error);
  }
};

const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
};
