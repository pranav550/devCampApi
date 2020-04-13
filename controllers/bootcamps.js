const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../models/Bootcamp");
const geocoder = require('../utils/geocoder');
const asyncHandler = require("../middleware/async");
// @desc = Get all bootcamp
// @route = GET /api/v1/bootcamps
// @access = Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})


// @desc = Get single bootcamp
// @route = GET /api/v1/bootcamps/:id
// @access = Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp })
})


// @desc = Create new bootcamp
// @route = POST /api/v1/bootcamps
// @access = Public

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    //Add User to req,body
    req.body.user = req.user.id;

    // check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If the user is not admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc = Update bootcamp
// @route = PUT /api/v1/bootcamps/:id
// @access = Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make Sure is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User  ${req.params.id} is not authorize to update this bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: bootcamp })

})

// @desc = Delete bootcamp
// @route = DELETE /api/v1/bootcamps/:id
// @access = private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {


    //  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make Sure is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User  ${req.params.id} is not authorize to delete this bootcamp`, 401));
    }

    bootcamp.remove()
    res.status(200).json({ success: true, data: {} })

})


// @desc = GET bootcamps with in a radius
// @route = GET /api/v1/bootcamps/:zipcode/:distance
// @access = private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    // get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    console.log(loc, "cccccc")
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // cal radius using radian
    // divide distance by radius of earth
    // earth radius = 3963 mi/ 6378 km 

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})


// @desc = Upload Photo For Bootcamp
// @route = PUT /api/v1/bootcamps/:id/photo
// @access = private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    //  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make Sure is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User  ${req.params.id} is not authorize to delete this bootcamp`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please Upload A File`, 400));
    }

    console.log(req.files)
    const file = req.files.file

    // Make Sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please Upload A Image File`, 400));
    }

    // check FileSize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please Upload An image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // create custom file name
    console.log(path.parse(file.name).ext, "ccccc")
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Failed With File Upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    })



})