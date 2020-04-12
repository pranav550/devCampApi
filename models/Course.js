const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true, 'please add a course title']
    },
    description:{
        type:String,
        required:[true, 'Please add a description']
    },
    weeks:{
        type:String,
        required:[true, 'Please add a number of weeks']
    },
    tuition:{
        type:Number,
        required:[true, 'Please add a tuition cost']
    },
    minimumSkill:{
        type:String,
        required:[true, 'Please add a minimum skill'],
        enum:['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required: true
    }
})

CourseSchema.statics.getAverageCost = async  function(){}

// call getAverageCost after save
CourseSchema.post('save', function(){

})

// call getAverageCost before remove
CourseSchema.pre('remove', function(){

})

module.exports = mongoose.model('Course', CourseSchema)