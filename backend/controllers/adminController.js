const lecturers = require('../models/lecturerModel')
const students = require('../models/studentModel')
const admins = require('../models/adminModel')

// Checking for non-existence of a username and id for new user
const checkExistenceAUsername = async (username, idUser) => {
    try {
        const userExistInStudents = await students.findOne({ 'username': username });
        const userExistInLecturers = await lecturers.findOne({ 'username': username });
        const userIdExistInStudents = await students.findOne({ 'id': idUser });
        const userIdExistInLecturers = await lecturers.findOne({ 'id': idUser });

        if (!userExistInStudents && !userExistInLecturers) {
            if (!userIdExistInStudents && !userIdExistInLecturers) {
                return 'ok';
            }
            else {
                return 'Id already exist';
            }
        }
        else {
            return 'Username already exist';
        }
      } catch (error) {
        return 'An error occurred while retrieving the user username/id';
      }
}

// check valitation fields
const ValidationCheck = async (fullName, email, phone, idUser, username, password) => {
    // Validate that all fields are complete
    if(!fullName.trim() || !email.trim() || !phone.trim() || !idUser.trim() || !username.trim() || !password.trim()) {
        return 'All fields must be filled';
    }

    // Validate fullName
    const fullNameRegex = /^[A-Za-z]+\s[A-Za-z]+$/;
    if (!fullNameRegex.test(fullName)) {
        return 'Invalid full name format. It should contain at least two words with letters only';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    // Validate phone
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone) || phone.length !== 10) {
        return 'Invalid phone format';
    }

    // Validate idUser
    const idUserRegex = /^\d{9}$/;
    if (!idUserRegex.test(idUser)) {
        return 'Invalid user id format. It should be a 9-digit number';
    }

    return 'ok'
}

const addNewUser = async (req, res) => {
    const { userType, fullName, email, phone, idUser, username, password } = req.body;

    try {
        const response = await ValidationCheck(fullName, email, phone, idUser, username, password)
        if (response !== 'ok') {
            return res.status(400).json({ error: response })
        }
        // Checking for non-existence of a username and id
        const existUsernameAndId = await checkExistenceAUsername(username, idUser)
        if (existUsernameAndId !== 'ok') {
            return res.status(400).json({ error: existUsernameAndId });
        }
        
        if (userType === 'Student') {
            const newUser = new students({
              username: username,
              password: password,
              id: idUser,
              name: fullName,
              email: email,
              phone: phone,
              courses: [],
            });
      
            await newUser.save();
      
            res.status(200).json({ message: 'New student user added successfully' });
        } else if (userType === 'Lecturer') {
            const newUser = new lecturers({
              username: username,
              password: password,
              id: idUser,
              name: fullName,
              email: email,
              phone: phone,
              courses: [],
            });
      
            await newUser.save();
      
            res.status(200).json({ message: 'New lecturer user added successfully' });
        } else {
            res.status(400).json({ error: 'Invalid userType' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the new user' });
    }
}

const getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        let user;
        user = await students.findOne({ 'id': userId });
        
        if (!user) {
            user = await lecturers.findOne({ 'id': userId });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        const userDetails = {
            name: user.name,
            email: user.email,
            phone: user.phone,
            idUser: user.id,
            username: user.username,
            password: user.password
        };

        res.status(200).json({ userDetails });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user details' });
    }
}

// check if the username already exist - for update user details
const checkExistenceAUsernameForUpadteUserDetails = async (userId, username) => {
    try {
        const userExistInStudents = await students.findOne({ 'username': username });
        const userExistInLecturers = await lecturers.findOne({ 'username': username });
        
        if (!userExistInStudents && !userExistInLecturers) {
            return 'ok'; // Username does not exist
        }
        else if ((userExistInStudents && userExistInStudents.id == userId) || (userExistInLecturers && userExistInLecturers.id == userId)){
            return 'ok'; // Username exist and match to the current user's username
        }
        else {
            return 'Username already exist';
        }
      } catch (error) {
        return 'An error occurred while retrieving the user username';
      }
}

// check if the id already exist - for update user details
const checkExistenceIdForUpadteUserDetails = async (idUser) => {
    try {
        const userIdExistInStudents = await students.findOne({ 'id': idUser });
        const userIdExistInLecturers = await lecturers.findOne({ 'id': idUser });

        if (!userIdExistInStudents && !userIdExistInLecturers) {
            return 'ok';
        }
        else {
            return 'id already exist';
        }
      } catch (error) {
        return 'An error occurred while retrieving the user id';
      }
}

const updateUserDetails = async (req, res) => {
    const { userId, fullName, email, phone, idUser, username, password } = req.body;
    
    try {
        const response = await ValidationCheck(fullName, email, phone, idUser, username, password)
        if (response !== 'ok') {
            return res.status(400).json({ error: response })
        }

        // check validation for username
        const existUsername = await checkExistenceAUsernameForUpadteUserDetails(userId, username)
        if(existUsername !== 'ok') {
            return res.status(400).json({ error: existUsername })
        }

        // check validation for new id
        if (userId !== idUser) {
            const existId = await checkExistenceIdForUpadteUserDetails(idUser)
            if(existId !== 'ok') {
                return res.status(400).json({ error: existUsername })
            }
        }

        let user;
        user = await students.findOne({ 'id': userId });
        if (!user) {
            user = await lecturers.findOne({ 'id': userId });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        }
        // Update user details
        user.name = fullName;
        user.email = email;
        user.phone = phone;
        user.id = idUser;
        user.username = username;
        user.password = password;
        await user.save();

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the user details' });
    }   
}

const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      let user;
      user = await students.findOne({ 'id': userId });
      if (!user) {
        user = await lecturers.findOne({ 'id': userId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        await lecturers.deleteOne({ 'id': userId });
      } else {
        await students.deleteOne({ 'id': userId });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
};

const addCourseToUser = async (req, res) => {
    const { userType, userId, courseName, courseCode, year, semester } = req.body;
    
    try {
        let user;

        // Validate that all fields are complete
        if(!userId.trim() || !courseName.trim() || !courseCode.trim() || !year.trim()) {
            return res.status(400).json({ error: 'All fields must be filled' });
        }

        if (userType === 'Student') {
            // Check if the year contains only digits
            const yearRegex = /^\d+$/;
            if (!yearRegex.test(year)) {
                return res.status(400).json({ error: 'Invalid year format. It should contain only digits' });
            }

            user = await students.findOneAndUpdate(
                { id: userId },
                { $push: { courses: { name: courseName, code: courseCode, year: Number(year), semester } } },
                { new: true }
            );
        } else if (userType === 'Lecturer') {
            user = await lecturers.findOneAndUpdate(
                { id: userId },
                { $push: { courses: { name: courseName, code: courseCode } } },
                { new: true }
            );
        } else {
            return res.status(400).json({ error: 'Invalid userType' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the course to the user' });
    }
}

const getUserCourses = async (req, res) => {
    const { userId } = req.params;

    try {
        let user;
        let userType;
        user = await students.findOne({ id: userId }, { _id: 0, courses: 1 });
        userType = 'student'
        if (!user) {
            user = await lecturers.findOne({ id: userId }, { _id: 0, courses: 1 });
            userType = 'lecturer'
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        const courses = user.courses.map(course => {
            if (userType === 'student') {
                const { name, code, year, semester } = course;
                return { name, code, year, semester };
            } else if (userType === 'lecturer') {
                const { name, code } = course;
                return { name, code };
            }
        });

        res.status(200).json({ userType, courses });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the user courses' });
    }
}

const deleteOneCourseForUser = async (req, res) => {
    const { userId, name, code, year, semester } = req.params;
    
    try {
      let user;
      let UserModel;
  
      // Find the user in the students collection
      user = await students.findOne({ id: userId });
      UserModel = students;
  
      if (!user) {
        // If the user is not found in the students collection, find in the lecturers collection
        user = await lecturers.findOne({ id: userId });
        UserModel = lecturers;
  
        if (!user) {
          return res.status(404).json({ error: 'User not found', userId });
        }
      }
  
      // Check if the user is a student or lecturer
      const userType = UserModel.modelName.toLowerCase();
      
      // Prepare the update query based on the user type
      let updateQuery;
      if (userType === 'student') {
        updateQuery = {
          $pull: {
            courses: {
              name: name,
              code: code,
              year: Number(year),
              semester: semester
            }
          }
        };
      } else if (userType === 'lecturer') {
        updateQuery = {
          $pull: {
            courses: {
              name: name,
              code: code
            }
          }
        };
      }
  
      // Update the user's courses with the matched course removed
      await UserModel.updateOne({ id: userId, 'courses.name': name, 'courses.code': code }, updateQuery);
  
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the course' });
    }
};

const deleteAllCoursesForLecturer = async (req, res) => {
    const { userId } = req.params;
  
    try {
        const result = await lecturers.updateOne({ id: userId }, { $set: { courses: [] } });
        
        if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Lecturer not found' });
        }

        res.status(200).json({ message: 'All courses deleted successfully for the lecturer' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the courses' });
    }
};

const addNewAdmin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        if(!username.trim() || !password.trim()) {
            return res.status(400).json({ error: 'All fields must be filled' });
        }
    
        // Check if the admin already exists
        const existingAdmin = await admins.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }
    
        // Create a new admin document
        const newAdmin = new admins({ username, password });
    
        // Save the new admin to the database
        await newAdmin.save();
    
        res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add admin' });
    }
};

const editAdminDetails = async (req, res) => {
    const { currentUsername, username, password } = req.body;
  
    try {
        if(!username.trim() || !password.trim()) {
            return res.status(400).json({ error: 'All fields must be filled' });
        }
        
        // Check if the admin new username already exists
        if (currentUsername !== username) {
            const existingAdmin = await admins.findOne({ username });
            if (existingAdmin) {
                return res.status(400).json({ error: 'Admin username already exists' });
            }
        }
        
        // Find the admin with the current username
        const admin = await admins.findOne({ username: currentUsername });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
    
        // Update the admin's username and password
        admin.username = username;
        admin.password = password;
    
        // Save the updated admin to the database
        await admin.save();
    
        res.status(200).json({ message: 'Admin details updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update admin details' });
    }
};

const getAdminDetails = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the admin with the current username
        const admin = await admins.findOne({ username });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load admin details' });
    }
}

module.exports = {
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
}