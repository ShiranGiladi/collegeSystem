require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const courseRoutes = require('./routes/course')
const lecturerRoutes = require('./routes/lecturer')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')

// express app
const app = express()

// Enable CORS for all routes
app.use(cors());

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/course', courseRoutes)
app.use('/api/lecturer', lecturerRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI, {dbName: 'db'})
    .then(() => {
        // listen to requests
        app.listen(process.env.PORT, () => {
        console.log('connecting to db & listening on port', process.env.PORT)
    })
    })
    .catch((error) => {
        console.log(error)
    })
