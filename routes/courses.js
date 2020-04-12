const express = require("express");
const { getCourses,
        getCourse, 
        addCourse, 
        updatCourse, 
        deleteCourse
      } = require('../controllers/coures')

const Course = require('../models/Course'); 
const advancedResults =  require('../middleware/advancedResult');      
const router = express.Router({mergeParams:true})

router.route('/')
.get(
      advancedResults(Course,{
path: 'bootcamp',
select: 'name description'
      }),
      getCourses)
.post(addCourse)
router.route('/:id')
      .get(getCourse)
      .put(updatCourse)
      .delete(deleteCourse)

module.exports = router;