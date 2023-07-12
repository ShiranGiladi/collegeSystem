import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const DeleteCourse = () => {
  const [userId, setUserId] = useState('');
  const [showLecturerTable, setShowLecturerTable] = useState(false);
  const [showStudentTable, setShowStudentTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const [lecturers, setLecturers] = useState('');
  const [students, setStudents] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayLecturers = lecturers.slice(startIndex, endIndex);
  const displayStudents = students.slice(startIndex, endIndex);

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user]);

  const handleGoButtonClick = () => {
    const fetchCourse = async () => {
      const response = await fetch(`https://college-system-pixh.onrender.com/api/admin/getUserCourses/${userId}`);
      const json = await response.json();

      if (response.ok) {
        setMsg('');
        setErrorMsg('');
        if (json.userType === 'lecturer') {
          setShowLecturerTable(true);
          setShowStudentTable(false);
          setLecturers(json.courses);
        } else if (json.userType === 'student') {
          setShowLecturerTable(false);
          setShowStudentTable(true);
          setStudents(json.courses);
        }
      } else {
        setShowLecturerTable(false);
        setShowStudentTable(false);
        setErrorMsg(json.error);
        setMsg('');
      }
    };

    fetchCourse();
  };

  const handleDeleteClick = async (name, code, year = 2023, semester = 'Spring') => {
    const response = await fetch(`https://college-system-pixh.onrender.com/api/admin/deleteOneCourseForUser/${userId}/${name}/${code}/${year}/${semester}`, {
      method: 'DELETE',
    });
    const json = await response.json();

    if (response.ok) {
      setMsg(json.message);
      if (year === '') {
        setLecturers(prevLecturers => prevLecturers.filter(course => course.name !== name && course.code !== code));
      } else {
        setStudents(prevStudents => prevStudents.filter(course => course.name !== name && course.code !== code));
      }
    }
    if (!response.ok) {
      setMsg(json.error);
    }
  };

  const handleDeleteAllButtonClick = async () => {
    const response = await fetch(`https://college-system-pixh.onrender.com/api/admin/deleteAllCoursesForLecturer/${userId}`, {
      method: 'DELETE',
    });
    const json = await response.json();

    if (response.ok) {
      setMsg(json.message);
      setLecturers('');
    }
    if (!response.ok) {
      setMsg(json.error);
    }
  };

  // const columnsLecturer = [
  //   {
  //     dataField: 'name',
  //     text: 'Course Name',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'code',
  //     text: 'Course Code',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'deleteCourse',
  //     text: 'Delete Course',
  //     formatter: (cellContent, row) => (
  //       <Button onClick={() => handleDeleteClick(row.name, row.code, '', '')} variant="secondary">Delete</Button>
  //     ),
  //   },
  // ];

  // const columnsStudents = [
  //   {
  //     dataField: 'name',
  //     text: 'Course Name',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'code',
  //     text: 'Course Code',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'year',
  //     text: 'Year',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'semester',
  //     text: 'Semester',
  //     sort: true,
  //   },
  //   {
  //     dataField: 'deleteCourse',
  //     text: 'Delete Course',
  //     formatter: (cellContent, row) => (
  //       <Button onClick={() => handleDeleteClick(row.name, row.code, row.year, row.semester)} variant="secondary">Delete</Button>
  //     ),
  //   },
  // ];

  let link = '/admin';

  return (
    <section className="delete-course">
      <h1 className="display-5">Delete Course from User</h1>
      <Container className='container-delete-course'>
        <div className='user-ID'>
          <label className="form-label label-user-ID">User's ID:</label>
          <div className="input-group userID-input">
            <input className="form-control" placeholder="Enter User's ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Button className="btn-secondary" onClick={handleGoButtonClick}>Go</Button>
          </div>
        </div>
        {errorMsg && <div className="error-text">{errorMsg}</div>}

        {showLecturerTable && (
          <div className='delete-course-from-lecturer'>
            <Table striped bordered hover responsive className="custom-table">
              <thead className="table-header">
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Delete Course</th>
                </tr>
              </thead>
              <tbody>
                {displayLecturers.map((course) => (
                  <tr key={course.code}>
                    <td>{course.name}</td>
                    <td>{course.code}</td>
                    <td>
                      <Button onClick={() => handleDeleteClick(course.name, course.code, '', '')} variant="secondary">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Container className="nextPrevButton">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary prevbtn">Previous Page</Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={endIndex >= lecturers.length}
                className="btn-secondary">Next Page</Button>
            </Container>
            <Button className='btn-danger' onClick={handleDeleteAllButtonClick}>Delete All</Button>
          </div>
        )}

        {showStudentTable && (
          <div className='delete-course-from-student'>
            <Table striped bordered hover responsive className="custom-table">
              <thead className="table-header">
                <tr>
                  <th>Course Name</th>
                  <th>CourseCode</th>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>Delete Course</th>
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((course) => (
                  <tr key={course.code}>
                    <td>{course.name}</td>
                    <td>{course.code}</td>
                    <td>{course.year}</td>
                    <td>{course.semester}</td>
                    <td>
                      <Button onClick={() => handleDeleteClick(course.name, course.code, course.year, course.semester)} variant="secondary">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Container className="nextPrevButton">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary prevbtn">Previous Page</Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={endIndex >= students.length}
                className="btn-secondary">Next Page</Button>
            </Container>
          </div>
        )}
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default DeleteCourse;

