// @desc = Get all bootcamp
// @route = GET /api/v1/bootcamps
// @access = Public

exports.getBootcamps = (req, res, next)=>{
    res.status(200).json({success:true, msg:'Show All bootcamps'})
}


// @desc = Get single bootcamp
// @route = GET /api/v1/bootcamps/:id
// @access = Public

exports.getBootcamp = (req, res, next)=>{
    res.status(200).json({success:true, msg:`Single bootcamps ${req.params.id}`})
}


// @desc = Create new bootcamp
// @route = POST /api/v1/bootcamps
// @access = Public

exports.createBootcamp = (req, res, next)=>{
    res.status(200).json({success:true, msg:'create bootcamps'})
}

// @desc = Update bootcamp
// @route = PUT /api/v1/bootcamps/:id
// @access = Private

exports.updateBootcamp = (req, res, next)=>{
    res.status(200).json({success:true, msg:`update bootcamps ${req.params.id}`})
}

// @desc = Delete bootcamp
// @route = DELETE /api/v1/bootcamps/:id
// @access = private

exports.deleteBootcamp = (req, res, next)=>{
    res.status(200).json({success:true, msg:`delete bootcamps ${req.params.id}`})
}