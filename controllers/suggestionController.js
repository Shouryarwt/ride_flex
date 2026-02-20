const LocationSuggestion = require('../models/LocationSuggestion');

const createSuggestion = async (req, res, next) => {
  try {
    const { city, title, category = 'other', description, address, coordinates } = req.body;

    if (!city || !title) {
      return res.status(400).json({ message: 'city and title are required' });
    }

    const suggestion = await LocationSuggestion.create({
      city,
      title,
      category,
      description,
      address,
      coordinates,
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: 'Suggestion created', suggestion });
  } catch (error) {
    return next(error);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const { city, category } = req.query;
    const filter = {};

    if (city) {
      filter.city = new RegExp(`^${city}$`, 'i');
    }
    if (category) {
      filter.category = category;
    }

    const suggestions = await LocationSuggestion.find(filter)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: suggestions.length, suggestions });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createSuggestion,
  getSuggestions,
};
