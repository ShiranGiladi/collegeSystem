const User = require('../models/studentModel')

const getCoursesForUser = async (req, res) => {
    const { username, year, semester } = req.params;
    
    try {
        const user = await User.findOne({ username });
        const courses = user.courses.filter(course => course.year === Number(year) && course.semester === semester);
        console.log("courses=", courses)
        if (courses.length === 0) {
            res.status(404).json({ error: "Courses not found" });
        }
        else {
          const courseDetails = courses.map(course => {
            return { name: course.name, code: course.code };
          });
          res.status(200).json(courseDetails);
        }
        
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
}

const getCoursesForInfo = async (req, res) => {
  const { username, year, semester, courseName } = req.params;
  
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const courses = user.courses.filter(
      (course) =>
        course.year === Number(year) &&
        course.semester === semester &&
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

const getCoursesGrades = async (req, res) => {
  const { statsFor, year, semester, courseName, assignmentName } = req.params;
  
  try {
    const users = await User.find({}); // Retrieve all users

    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }

    const courses = users.reduce((acc, user) => {
      // Filter courses based on year, semester, and course name
      const filteredCourses = user.courses.filter(
        (course) =>
          course.year === Number(year) &&
          course.semester === semester &&
          course.name === courseName
      );

      // Merge filtered courses into the accumulator
      return [...acc, ...filteredCourses];
    }, []);

    if (courses.length === 0) {
      return res.status(404).json({ error: "There are no grades for that course" });
    }

    const grades = courses.flatMap((course) => {
      // Filter tasks based on assignment name
      const filteredTasks = course.tasks.filter(
        (task) => task.name === assignmentName
      );

      // Return an array of grades
      return filteredTasks.map((task) => task.grade);
    });

    return res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
  

module.exports = {
    getCoursesForUser,
    getCoursesForInfo,
    getCoursesGrades
}