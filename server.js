const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
// load env varaible
dotenv.config({ path: './config/config.env' })

// connect to database
connectDB()

// routes
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/courses");

const app = express()

//body-parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// mount router
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

// call errorHandler
app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))

//Handle database error
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // close server and exit process
    server.close(() => {
        process.exit(1)
    })
}) 