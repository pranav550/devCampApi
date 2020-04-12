const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load en vars
dotenv.config({path:'./config/config.env'});

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// connect to db

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})

//Read Json File
const bootcamps = JSON.parse
(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const courses = JSON.parse
(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// Import in to db

const importData = async()=>{
    try{
       await Bootcamp.create(bootcamps)
       await Course.create(courses)
       console.log('Data importe...'.green.inverse)
       process.exit();
    }catch(err){
       console.error(err)
    }
}


// delete data

const deleteData = async()=>{
    try{
       await Bootcamp.deleteMany()
       await Course.deleteMany()
       console.log('Data destroyed...'.red.inverse)
       process.exit();
    }catch(err){
       console.error(err)
    }
}

if(process.argv[2]=== '-i'){
    importData()
}
else if (process.argv[2]=== '-d'){
    deleteData()
}