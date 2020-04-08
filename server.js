const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require('./config/db');
// load env varaible
dotenv.config({ path: './config/config.env' })

// connect to database
connectDB()

// routes
const bootcamps = require("./routes/bootcamp");

const app = express()

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// mount router
app.use('/api/v1/bootcamps', bootcamps)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`))

//Handle database error
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // close server and exit process
    server.close(() => {
        process.exit(1)
    })
}) 