const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../models/Bootcamp");
const geocoder = require('../utils/geocoder');
const asyncHandler = require("../middleware/async");
// @desc = Get all bootcamp
// @route = GET /api/v1/bootcamps
// @access = Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query;
        const reqQuery = {...req.query}
        const removeFields = ['select', 'sort', 'page', 'limit']
        removeFields.forEach(param=> delete reqQuery[param]);
        console.log(reqQuery)
        // filter
        
        let queryStr = JSON.stringify(reqQuery)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        //find All
        query = Bootcamp.find(JSON.parse(queryStr));

        // Select Field
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        //sort 
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else{
            query = query.sort('-createdAt');
        }

        // pagination
       const page = parseInt(req.query.page, 10) || 1;
       const limit = parseInt(req.query.limit, 10) || 25;
       const startIndex = (page-1)*limit; 
       const endIndex = page*limit;
       const total = await Bootcamp.countDocuments()

       query = query.skip(startIndex).limit(limit);

       // executing query
        const bootcamps = await query
     
        // pagination result
         const pagination = {}
         if(endIndex < total){
            pagination.next = {
                page: page+1,
                limit
            }
         }

         if(startIndex>0){
             pagination.prev={
                 page:page-1,
                 limit
             }
         }
    
        res.status(200).json({ success: true, count: bootcamps.length, pagination,  data: bootcamps })
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