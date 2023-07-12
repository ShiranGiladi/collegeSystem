const express = require('express')
const multer = require('multer');
const {
    getCoursesName,
    getCoursesInfo,
    getStudentGrade,
    uploadGradeForOneStudent,
    uploadExcelFile
} = require('../controllers/lecturerController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Configure multer to handle file upload
const upload = multer().single('file');

// require auth for all courses routes
// router.use(requireAuth)

// GET courses name for lecturer
router.get('/:username', getCoursesName)

// GET course information
router.get('/:username/:courseName/:courseCode', getCoursesInfo)

// GET student grade for a task
router.get('/studentGrade/:courseName/:courseCode/:taskName/:userId', getStudentGrade)

// POST upload student grade for a task
router.post('/uploadGradeForOneStudent', uploadGradeForOneStudent)

// GET upload students grades for a task using excel file
router.post('/uploadExcelFile/:courseName/:courseCode/:taskName/upload', upload, uploadExcelFile);

module.exports = router