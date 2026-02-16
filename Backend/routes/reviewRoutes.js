const express = require('express');
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

router.route('/:id')
    .delete(protect, deleteReview); // Owner/Admin functionality handled in controller

module.exports = router;
