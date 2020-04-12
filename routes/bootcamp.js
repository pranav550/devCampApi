const express = require("express");
const { getBootcamps,
        getBootcamp,
        createBootcamp, 
        updateBootcamp, 
        deleteBootcamp,
        getBootcampInRadius,
        bootcampPhotoUpload
       } = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');       

const advancedResults = require('../middleware/advancedResult');

// include other resource router
const courseRouter = require('./courses');

const router = express.Router()

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)

router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get( advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp)
  

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)
module.exports = router;