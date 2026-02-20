const Dealer = require('../models/Dealer');
const User = require('../models/User');

const registerDealer = async (req, res, next) => {
  try {
    const { gstNumber, shopName, address, city, ownerName, ownerPhone } = req.body;

    if (!gstNumber || !shopName || !address || !city || !ownerName || !ownerPhone) {
      return res.status(400).json({ message: 'All dealer fields are required' });
    }

    const existingGst = await Dealer.findOne({ gstNumber: gstNumber.toUpperCase() });
    if (existingGst) {
      return res.status(409).json({ message: 'Dealer with this GST number already exists' });
    }

    const existingForUser = await Dealer.findOne({ user: req.user._id });
    if (existingForUser) {
      return res.status(409).json({ message: 'User already registered as dealer' });
    }

    const dealer = await Dealer.create({
      user: req.user._id,
      gstNumber,
      shopName,
      address,
      city,
      ownerName,
      ownerPhone,
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

    return res.status(201).json({ message: 'Dealer registration submitted', dealer });
  } catch (error) {
    return next(error);
  }
};

const getMyDealerProfile = async (req, res, next) => {
  try {
    const dealer = await Dealer.findOne({ user: req.user._id }).populate('user', 'name email role');
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer profile not found' });
    }

    return res.status(200).json({ dealer });
  } catch (error) {
    return next(error);
  }
};

const getAllDealers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.approvalStatus = status;
    }

    const dealers = await Dealer.find(filter).populate('user', 'name email phone role');
    return res.status(200).json({ count: dealers.length, dealers });
  } catch (error) {
    return next(error);
  }
};

const updateDealerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    const dealer = await Dealer.findByIdAndUpdate(id, { approvalStatus }, { new: true });
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    return res.status(200).json({ message: 'Dealer status updated', dealer });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerDealer,
  getMyDealerProfile,
  getAllDealers,
  updateDealerStatus,
};
