const express = require('express')
// controller function
const {
    loginUser,
    getAllUsers,
    getProfileDetalis,
    updateProfileDetails,
    addNewTask,
    updateTaskDetails,
    deleteTask
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all user routes
// router.use(requireAuth)

// login route
router.post('/login', loginUser)

// get all students
router.get('/', getAllUsers)

// get profile details for user
router.get('/profileDetails/:username', getProfileDetalis)

// update profile details for user
router.post('/profileDetails/update', updateProfileDetails)

// add new task to course
router.post('/addNewTask', addNewTask)

// update task details
router.post('/updateTask', updateTaskDetails)

// delete task
router.delete('/deleteTask/:courseName/:courseCode/:name', deleteTask)

module.exports = router