const User = require('../models/studentModel')
const lecturerUser = require('../models/lecturerModel')
const adminUser = require('../models/adminModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'}) //the user will remain logged in for 1 day and then the token is going to expire
}

// login user
const loginUser = async (req, res) => {
    const {username, password} = req.body
    
    try {
      const user = await User.login(username, password)
      // create token
      const token = createToken(user._id)
      const userType = 'student'
      res.status(200).json({username, token, userType})
    } catch (error) {
      if (error.message == 'Incorrect password') {
        res.status(401).json({error: 'Incorrect username or password'})
      }
      else {
        try {
            const user = await lecturerUser.login(username, password)
            // create token
            const token = createToken(user._id)
            const userType = 'lecturer'
            res.status(200).json({username, token, userType})
        } catch (error) {
          if (error.message == 'Incorrect password') {
            res.status(401).json({error: 'Incorrect username or password'})
          }
          else {
              try {
                const user = await adminUser.login(username, password)
                // create token
                const token = createToken(user._id)
                const userType = 'admin'
                res.status(200).json({username, token, userType})
              } catch (error) {
                res.status(401).json({error: error.message})
              }
          }
        }
      }
    }
}

// user profile details
const getProfileDetalis = async (req, res) => {
    const { profileDetails, username } = req.params

    try { // student case
        const user = await User.findOne({ username });
        res.status(200).json({email: user.email, phone: user.phone, name: user.name})

    } catch (error) {
        
        try { // lecturer case
            const user = await lecturerUser.findOne({ username });
            res.status(200).json({email: user.email, phone: user.phone, name: user.name})
        } catch (error) {
            res.status(401).json({error: error.message})
        }
        
    }
}

// update profile details
const updateProfileDetails = async (req, res) => {
    const { username, detailToUpdate, whatToUpdate } = req.body;

    // Validate the detailToUpdate value
    if (!detailToUpdate) {
        return res.status(400).json({ error: 'Detail to update is required' });
    }

    // Regular expressions for email and phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d+$/;

    try {
        let updatedUser;

        if (whatToUpdate === 'email') {
        if (!emailRegex.test(detailToUpdate)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Update the email field
        updatedUser = await User.findOneAndUpdate(
            { username },
            { email: detailToUpdate },
            { new: true }
        );

        if (!updatedUser) {
            // If the user is not found in the student model, update the lecturer details
            updatedUser = await lecturerUser.findOneAndUpdate(
            { username },
            { email: detailToUpdate },
            { new: true }
            );
        }
        } else if (whatToUpdate === 'phone') {
        if (!phoneRegex.test(detailToUpdate) || detailToUpdate.length !== 10) {
            return res.status(400).json({ error: 'Invalid phone format' });
        }

        // Update the phone field
        updatedUser = await User.findOneAndUpdate(
            { username },
            { phone: detailToUpdate },
            { new: true }
        );

        if (!updatedUser) {
            // If the user is not found in the student model, update the lecturer details
            updatedUser = await lecturerUser.findOneAndUpdate(
            { username },
            { phone: detailToUpdate },
            { new: true }
            );
        }
        } else {
        return res.status(400).json({ error: 'Invalid field to update' });
        }

        if (!updatedUser) {
        // If the user is not found, return an error
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile details updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile details' });
    }
};

// check valitation
const ValidationCheck = async (dueDate, percentage, name) => {
  // Validate name and dueDate
  if(!name.trim() || !dueDate.trim()) {
    return 'All fields must be filled';
  }

  // Validate dueDate
  const currentDate = new Date();
  const taskDueDate = new Date(dueDate);
  if (taskDueDate < currentDate) {
    return 'Due date has already passed';
  }

  // Validate percentage
  const percentageValue = parseInt(percentage, 10);
  if (isNaN(percentageValue) || percentageValue < 1 || percentageValue > 100 || !percentage.endsWith('%')) {
    return 'Invalid percentage value';
  }
  return 'ok'
}

// Validate name uniqueness for lecturers
const ValidationCheckForUniquenessTaskName = async (courseName, courseCode, name) => {
  const lecturer = await lecturerUser.findOne({
    'courses.name': courseName,
    'courses.code': courseCode,
    'courses.tasks.name': name
  });
  if (lecturer) {
    return 'Task name already exists for the given course';
  }
  
  return 'ok'
}

// add new task to all relevant lecturers and students
const addNewTask = async (req, res) => {
    const { courseName, courseCode, name, dueDate, percentage, type } = req.body;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

    try {
      const response = await ValidationCheck(dueDate, percentage, name)
      if (response !== 'ok') {
        return res.status(400).json({ error: response })
      }
      
      const validName = await ValidationCheckForUniquenessTaskName(courseName, courseCode, name)
      if (validName !== 'ok') {
        return res.status(400).json({ error: validName })
      }
  
      // Update task for lecturers
      const lecturers = await lecturerUser.updateMany(
        { 'courses.name': courseName, 'courses.code': courseCode },
        {
          $push: {
            'courses.$.tasks': {
              name,
              dueDate: dueDate,
              percentage,
              type,
            },
          },
        }
      );
  
      if (lecturers.modifiedCount === 0) {
        res
          .status(404)
          .json({ error: 'No lecturers found or course not assigned to any lecturer' });
        return;
      }

      // Update task for students
      const students = await User.updateMany(
        {
          'courses.name': courseName,
          'courses.code': courseCode,
          'courses.year': currentYear,
          'courses.semester': semester,
        },
        {
          $push: {
            'courses.$[course].tasks': {
              name,
              dueDate: dueDate,
              percentage,
              grade: 'Not Graded Yet',
              type,
            },
          },
        },
        { arrayFilters: [{ 'course.name': courseName, 'course.code': courseCode }] }
      );


      if (students.modifiedCount === 0) {
        res.status(404).json({
          error: 'No students found for the given course, year, and semester',
        });
        return;
      }
  
      res
        .status(200)
        .json({ message: 'Task added successfully for lecturers and students' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'An error occurred while adding the task' });
    }
};

// update task details to all relevant lecturers and students
const updateTaskDetails = async (req, res) => {
  const { courseName, courseCode, previousName, updateName, dueDate, percentage, type } = req.body;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

  try {
    const response = await ValidationCheck(dueDate, percentage, updateName);
    if (response !== 'ok') {
      return res.status(400).json({ error: response });
    }

    if (previousName !== updateName) {
      const validName = await ValidationCheckForUniquenessTaskName(courseName, courseCode, updateName)
      if (validName !== 'ok') {
        return res.status(400).json({ error: validName })
      }
    }
    
    // Update task for lecturers
    const lecturers = await lecturerUser.updateMany(
      { 'courses.name': courseName, 'courses.code': courseCode, 'courses.tasks.name': previousName },
      {
        $set: {
          'courses.$[course].tasks.$[task].name': updateName,
          'courses.$[course].tasks.$[task].dueDate': dueDate,
          'courses.$[course].tasks.$[task].percentage': percentage,
          'courses.$[course].tasks.$[task].type': type,
        },
      },
      { arrayFilters: [{ 'course.name': courseName, 'course.code': courseCode }, { 'task.name': previousName }] }
    );

    if (lecturers.modifiedCount === 0) {
      res.status(404).json({ error: 'No matching task found for the given course' });
      return;
    }

    // Update task for students
    const students = await User.updateMany(
      {
        'courses.name': courseName,
        'courses.code': courseCode,
        'courses.tasks.name': previousName,
        'courses.year': currentYear,
        'courses.semester': semester,
      },
      {
        $set: {
          'courses.$[course].tasks.$[task].name': updateName,
          'courses.$[course].tasks.$[task].dueDate': dueDate,
          'courses.$[course].tasks.$[task].percentage': percentage,
          'courses.$[course].tasks.$[task].type': type,
        },
      },
      { arrayFilters: [{ 'course.name': courseName, 'course.code': courseCode }, { 'task.name': previousName }] }
    );

    if (students.modifiedCount === 0) {
      res.status(404).json({ error: 'No matching task found for the given course' });
      return;
    }

    res.status(200).json({ message: 'Task updated successfully for lecturers and students' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the task' });
  }
};

const deleteTask = async (req, res) => {
  const { courseName, courseCode, name } = req.params;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

  try {
    // Find and delete the task from lecturers
    const deletedLecturers = await lecturerUser.updateMany(
      { 'courses.name': courseName, 'courses.code': courseCode },
      { $pull: { 'courses.$.tasks': { name: name } } }
    );

    // Find and delete the task from students
    const deletedStudents = await User.updateMany(
      {
        'courses.name': courseName,
        'courses.code': courseCode,
        'courses.year': currentYear,
        'courses.semester': semester,
      },
      { $pull: { 'courses.$[course].tasks': { name: name } } },
      { arrayFilters: [{ 'course.name': courseName, 'course.code': courseCode }] }
    );
    
    // Check if any tasks were deleted
    if (deletedLecturers.modifiedCount === 0 && deletedStudents.modifiedCount === 0) {
      res.status(404).json({ error: 'No users found with matching tasks.' });
    } else {
      res.status(200).json({ message: 'Task deleted successfully for users.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
}

const getAllUsers = async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
}

module.exports = {
    loginUser,
    getAllUsers,
    getProfileDetalis,
    updateProfileDetails,
    addNewTask,
    updateTaskDetails,
    deleteTask
}