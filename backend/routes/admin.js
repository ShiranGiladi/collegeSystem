const express = require('express')
const {
    addNewUser,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    addCourseToUser,
    getUserCourses,
    deleteOneCourseForUser,
    deleteAllCoursesForLecturer,
    addNewAdmin,
    editAdminDetails,
    getAdminDetails,
} = require('../controllers/adminController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// POST add new user to the system
router.post('/addNewUser', addNewUser)

// POST update new details to exist user
router.post('/updateUserDetails', updateUserDetails)

// DELETE user
router.delete('/deleteUser/:userId', deleteUser)

// DELETE course for user
router.delete('/deleteOneCourseForUser/:userId/:name/:code/:year?/:semester?', deleteOneCourseForUser)

// DELETE All courses for lecturer
router.delete('/deleteAllCoursesForLecturer/:userId', deleteAllCoursesForLecturer)

// POST add new course to user
router.post('/addCourseToUser', addCourseToUser)

// POST add new admin
router.post('/addNewAdmin', addNewAdmin)

// POST update new admin details
router.post('/editAdminDetails', editAdminDetails)

// GET user details
router.get('/getUserDetails/:userId', getUserDetails)

// GET user courses
router.get('/getUserCourses/:userId', getUserCourses)

// GET admin details
router.get('/getAdminDetails/:username', getAdminDetails)

module.exports = router