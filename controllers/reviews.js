const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`);
};