const User = require('../models/lecturerModel')
const students = require('../models/studentModel')

const getCoursesName = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });
        const courses = user.courses;
        if (courses.length === 0) {
            res.status(404).json({ error: "Courses not found" });
        } else {
            const courseDetails = courses.map(course => {
                return { name: course.name, code: course.code };
            });
            res.status(200).json(courseDetails);
        }
        
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
}

const getCoursesInfo = async (req, res) => {
    const { username, courseName, courseCode } = req.params;
    
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const courses = user.courses.filter(
        (course) =>
          course.code === courseCode &&
          course.name === courseName
      );
  
      if (courses.length === 0) {
        return res.status(404).json({ error: "There are no tasks for that course" });
      }
  
      const courseTasks = courses.flatMap((course) => course.tasks);
      return res.status(200).json(courseTasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
};

const getStudentGrade = async (req, res) => {
  const { courseName, courseCode, taskName, userId } = req.params;

  try {
    const student = await students.findOne({
      'courses.name': courseName,
      'courses.code': courseCode,
      'id': userId
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const course = student.courses.find(course => course.name === courseName && course.code === courseCode);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const task = course.tasks.find(task => task.name === taskName);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const grade = task.grade;
    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the student grade' });
  }
};

const uploadGradeForOneStudent = async (req, res) => {
  const { courseName, courseCode, taskName, userId, newGrade } = req.body;
  console.log(courseName, courseCode, taskName, userId, newGrade)
  // Validate the newGrade parameter
  if (!/^\d+$/.test(newGrade)) {
    return res.status(400).json({ error: 'Invalid grade format. Grade must contain only numbers.' });
  }

  const gradeValue = parseInt(newGrade, 10);

  if (gradeValue < 0 || gradeValue > 100) {
    return res.status(400).json({ error: 'Invalid grade value. Grade must be between 0 and 100.' });
  }

  const student = await students.findOne({
    'courses.name': courseName,
    'courses.code': courseCode,
    'id': userId
  });

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  try {
    // Perform the update operation using the provided parameters
    const updatedGrade = await students.findOneAndUpdate(
      {
        id: userId,
        'courses.name': courseName,
        'courses.code': courseCode,
        'courses.tasks.name': taskName
      },
      {
        $set: {
          'courses.$.tasks.$[task].grade': gradeValue
        }
      },
      {
        arrayFilters: [
          { 'task.name': taskName }
        ],
        new: true
      }
    );    

    res.status(200).json({ message: 'Grade updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the grade' });
  }
};

const multer = require('multer');
const xlsx = require('xlsx');
const axios = require('axios');

// Configure multer to handle file upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file'); // Assuming the file is uploaded as 'file' field in the request

const uploadExcelFile = async (req, res) => {
  try {
    const { courseName, courseCode, taskName } = req.params
    const file = req.file;

    // Read the Excel file
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }); // Use file.buffer to access the file data

    // Assuming the necessary data is in the first sheet of the workbook
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Extract the relevant data from the sheet
    const data = xlsx.utils.sheet_to_json(sheet);

    // Convert the data into a JSON object
    const jsonObject = {};
    data.forEach((row) => {
      const id = row['id']; // Assuming the column header is 'id'
      const grade = row['grade']; // Assuming the column header is 'grade'
      jsonObject[id] = grade;
    });

    // console.log(jsonObject); // Output the JSON object

    const msg = await uploadGradesForManyStudents(jsonObject, courseName, courseCode, taskName)

    if (!msg.trim()) {
      res.status(200).json({ message: 'Excel file uploaded and processed successfully.' });
    }
    else {
      res.status(400).json({ error: msg })
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during file upload and processing.' });
  }
};

const api = axios.create({
  baseURL: 'http://localhost:4000' // Update the port number
});

const uploadGradesForManyStudents = async (jsonObject, courseName, courseCode, taskName) => {
  let msg = '';
  
  for (const [userId, newGrade] of Object.entries(jsonObject)) {
    try {
      const response = await api.post('/api/lecturer/uploadGradeForOneStudent', {
        courseName,
        courseCode,
        taskName,
        userId,
        newGrade,
      });
      
      const json = response.data;
      
      if (response.status !== 200) {
        msg += `\nFailed to upload grade for user ID: ${userId}`;
      }
    } catch (error) {
      msg += `\nAn error occurred while uploading grade for user ID: ${userId}`;
    }
  }
  
  return msg;
};


module.exports = {
    getCoursesName,
    getCoursesInfo,
    getStudentGrade,
    uploadGradeForOneStudent,
    uploadExcelFile
}