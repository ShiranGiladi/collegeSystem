const express = require('express')
const {
    getCoursesForUser,
    getCoursesForInfo,
    getCoursesGrades
} = require('../controllers/courseController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all courses routes
// router.use(requireAuth)

// GET courses name for student
router.get('/:username/:year/:semester', getCoursesForUser)

// GET course information
router.get('/:username/:year/:semester/:courseName', getCoursesForInfo)

// GET all course's grades in assignment
router.get('/statsFor/:year/:semester/:courseName/:assignmentName', getCoursesGrades)

module.exports = router