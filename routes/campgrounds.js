const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campController = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//Campgrounds Routes

router.route('/')
    .get(catchAsync(campController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campController.createCampground))

router.get('/new', isLoggedIn, campController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campController.renderEditForm))

module.exports = router;