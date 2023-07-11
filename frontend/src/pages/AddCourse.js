import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddCourse = () => {
  const [selectedUserType, setSelectedUserType] = useState('Lecturer');
  const [userId, setUserId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('Winter');
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user])

  const handleAddCourseButton = async () => {
    const response = await fetch('https://college-system-pixh.onrender.com/api/admin/addCourseToUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userType: selectedUserType, userId, courseName, courseCode, year, semester }),
    });
    const json = await response.json();
    if(response.ok) {
      setMsg(json.message);
    }
    if(!response.ok) {
      setMsg(json.error);
    }
  };

  let link = '/admin';

  return (
    <section className="add-course">
      <h1 className="display-5">Add Course to User</h1>
      <Container className='container-add-course'>
        <div className='user-type'>
          <label className="form-label label-user-type">User Type:</label>
          <select className="form-select" aria-label="Default select example" id="userType" value={selectedUserType} onChange={(e) => setSelectedUserType(e.target.value)}>
            <option value="Lecturer">Lecturer</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div className="label-input-div">
            <label className="form-label label-info">User's ID:</label>
            <input className="form-control" placeholder="e.g. 12345" value={userId} onChange={(e) => setUserId(e.target.value)}/>
        </div>

        <div className="label-input-div">
            <label className="form-label label-info">Course Name:</label>
            <input className="form-control" placeholder="e.g. Probability" value={courseName} onChange={(e) => setCourseName(e.target.value)}/>
        </div>

        <div className="label-input-div">
            <label className="form-label label-info">Course Code:</label>
            <input className="form-control" placeholder="e.g. 61760" value={courseCode} onChange={(e) => setCourseCode(e.target.value)}/>
        </div>

        {selectedUserType === 'Student' && (
            <div>
              <div className="label-input-div">
                <label className="form-label label-info">Year:</label>
                <input className="form-control" placeholder="e.g. 2023" value={year} onChange={(e) => setYear(e.target.value)}/>
              </div>

              <div className="label-input-div">
                <label className="form-label label-info">Semester:</label>
                <select className="form-select" aria-label="Default select example" value={semester} onChange={(e) => setSemester(e.target.value)}>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>

           
        )}
        <Button className="btn-secondary add-btn" onClick={handleAddCourseButton} >Add Course</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default AddCourse;
