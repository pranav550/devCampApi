const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// routes
const bootcamps = require("./routes/bootcamp");

// load env varaible
dotenv.config({path:'./config/config.env'})

const app = express()



// Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}



// mount router
app.use('/api/v1/bootcamps', bootcamps )


const PORT= process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))