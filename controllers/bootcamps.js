const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../models/Bootcamp");
const geocoder = require('../utils/geocoder');
const asyncHandler = require("../middleware/async");
// @desc = Get all bootcamp
// @route = GET /api/v1/bootcamps
// @access = Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
        console.log(req.query)
        let query;
        let queryStr = JSON.stringify(req.query)
        console.log(queryStr)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log(queryStr)
        query = Bootcamp.find(JSON.parse(queryStr));

        const bootcamps = await query
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
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
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp })
   
})

// @desc = Delete bootcamp
// @route = DELETE /api/v1/bootcamps/:id
// @access = private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} })
   
})


// @desc = GET bootcamps with in a radius
// @route = GET /api/v1/bootcamps/:zipcode/:distance
// @access = private

exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
    
const {zipcode, distance}= req.params;

// get lat/lng from geocoder
const loc = await geocoder.geocode(zipcode);
console.log(loc,"cccccc")
const lat = loc[0].latitude
const lng = loc[0].longitude

// cal radius using radian
// divide distance by radius of earth
// earth radius = 3963 mi/ 6378 km 

const radius= distance/3963;

const bootcamps = await Bootcamp.find({
    location:{$geoWithin:{$centerSphere:[[lng, lat], radius]}}
})
res.status(200).json({
    success:true,
    count: bootcamps.length,
    data:bootcamps
})

})