const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isReviewAuthor, isLoggedIn } = require('../middleware');
const reviewController = require('../controllers/reviews')

//Review Routes

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;