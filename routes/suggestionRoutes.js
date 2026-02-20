const express = require('express');
const { createSuggestion, getSuggestions } = require('../controllers/suggestionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getSuggestions);
router.post('/', authMiddleware, roleMiddleware('user', 'seller', 'admin'), createSuggestion);

module.exports = router;
