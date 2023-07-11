import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'react-bootstrap';

const TeachersGradesPage = () => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const navigate = useNavigate();

  const { courseName, courseCode } = useParams();
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || user.userType !== 'lecturer') {
        navigate('/PageNotFound'); // Redirect the user to 404 page
        return;
      }

      const response = await fetch(
        `https://college-system-pixh.onrender.com/api/lecturer/${user.username}/${courseName}/${courseCode}`
      );
      const json = await response.json();
      if (response.ok) {
        setTasks(json);
      }

      if (!response.ok) {
        setError(json.error);
      }
    };

    fetchCourses();
  }, [courseCode, courseName, navigate, user]);

  const handleTableChange = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleUpdateButtonClick = (row) => {
    localStorage.setItem('rowData', JSON.stringify(row));
    navigate(`/update/${courseName}/${courseCode}`);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const sortedTasks = [...tasks].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortField === 'percentage') {
      // Handle numeric fields
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    } else {
      // Handle string fields
      if (fieldA && fieldB) {
        return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      } else if (fieldA) {
        return -1;
      } else if (fieldB) {
        return 1;
      }
      return 0;
    }
  });
  const displayTasks = sortedTasks.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <section className="grades-teachers">
      <h1 className="display-5">Tasks for {courseName} Course ({courseCode})</h1>

      <Container className="container-grades-teacher">
        <Button
          onClick={() => navigate(`/new-assignment/${courseName}/${courseCode}`)}
          variant="secondary"
        >
          Add New Assignment
        </Button>
      </Container>

      <Table striped bordered hover responsive className="custom-table sortable teacher-table">
        <thead className="table-header">
          <tr>
            <th onClick={() => handleTableChange('name', sortOrder === 'asc' ? 'desc' : 'asc')}>
              <div>
                Task Name {sortField === 'name' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </div>
            </th>
            <th onClick={() => handleTableChange('type', sortOrder === 'asc' ? 'desc' : 'asc')}>
              <div>
                Task Type {sortField === 'type' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </div>
            </th>
            <th onClick={() => handleTableChange('dueDate', sortOrder === 'asc' ? 'desc' : 'asc')}>
              <div>
                Due Date {sortField === 'dueDate' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </div>
            </th>
            <th onClick={() => handleTableChange('percentage', sortOrder === 'asc' ? 'desc' : 'asc')}>
              <div>
                Percent {sortField === 'percentage' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </div>
            </th>
            <th>Update Details</th>
            <th>Upload Grades</th>
          </tr>
        </thead>
        <tbody>
          {displayTasks.map((task) => (
            <tr key={task.name}>
              <td>{task.name}</td>
              <td>{task.type}</td>
              <td>{task.dueDate}</td>
              <td>{task.percentage}</td>
              <td>
                <Button onClick={() => handleUpdateButtonClick(task)} variant="secondary">
                  Edit Task
                </Button>
              </td>
              <td>
                <Button
                  onClick={() =>
                    navigate(`/upload-grades/${courseName}/${courseCode}/${task.name}`)
                  }
                  variant="secondary"
                >
                  Edit Grade
                </Button>
              </td>
            </tr>
          ))}
          {displayTasks.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Container className="nextPrevButton">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="btn-secondary prevbtn"
        >
          Previous Page
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="btn-secondary"
        >
          Next Page
        </Button>
      </Container>
      {error && <div className="error-text">{error}</div>}
      <Button
        onClick={() => navigate(`/courses/${currentYear}/${semester}`)}
        className="btn-secondary back-btn"
      >
        Back
      </Button>
    </section>
  );
};

export default TeachersGradesPage;
