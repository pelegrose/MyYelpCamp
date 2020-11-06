const Campground = require('../models/campground');
const cloudinary = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require('express');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    })
        .send()
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = req.user._id;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await camp.save();
    req.flash('success', `Successfully made ${camp.title} campground!`)
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    // Here we populate both the campground and the reviews of the campground
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: "author"
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'No such campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp })
};

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'No such campground, can not edit!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp })
};

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true, runValidators: true });
    camp.images.push(...images);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            // For some reason I had to specify cloudinary twice
            await cloudinary.cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Successfully updated ${camp.title} campground!`)
    res.redirect(`/campgrounds/${camp._id}`)
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${camp.title} campground!`)
    res.redirect('/campgrounds')
};