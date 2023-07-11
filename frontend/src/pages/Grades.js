import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const GradesPage = () => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const { year, semester, courseName, courseCode } = useParams();
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'student') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
    
    const fetchGrades = async () => {
      const response = await fetch(`https://college-system-pixh.onrender.com/api/course/${user.username}/${year}/${semester}/${courseName}?page=${currentPage}&limit=${rowsPerPage}`);
      const json = await response.json();
      if (response.ok) {
        setGrades(json);
      } else {
        setError(json.error);
      }
    };

    fetchGrades();
  }, [courseName, navigate, semester, user, year, currentPage]);

  const handleTableChange = (field) => {
    if (field === sortField) {
      // If already sorted by the same field, reverse the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Sort by a different field
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset the current page to the first page
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const sortedGrades = [...grades].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (sortField === 'grade' || sortField === 'percentage') {
      // Handle numeric fields
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    } else if (sortField === 'dueDate') {
      // Handle date fields
      const dateA = new Date(fieldA);
      const dateB = new Date(fieldB);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
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
  const displayGrades = sortedGrades.slice(startIndex, endIndex);

  return (
    <section className='grades'>
      <h1 className="display-5">Grades for {courseName} Course ({courseCode})</h1>

      <Table striped bordered hover responsive className="custom-table student-table">
        <thead className="table-header">
          <tr>
            <th onClick={() => handleTableChange('name')}>
              Task Name {sortField === 'name' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleTableChange('type')}>
              Task Type {sortField === 'type' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleTableChange('dueDate')}>
              Due Date {sortField === 'dueDate' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleTableChange('grade')}>
              Grade {sortField === 'grade' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th onClick={() => handleTableChange('percentage')}>
              Percent {sortField === 'percentage' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th>Stats</th>
          </tr>
        </thead>
        <tbody>
          {displayGrades.map((grade) => (
            <tr key={grade.name}>
              <td>{grade.name}</td>
              <td>{grade.type}</td>
              <td>{grade.dueDate}</td>
              <td>{grade.grade}</td>
              <td>{grade.percentage}</td>
              <td>
                <Button onClick={() => navigate(`/stats/${year}/${semester}/${courseName}/${courseCode}/${grade.name}`)} variant="secondary">View Stats</Button>
              </td>
            </tr>
          ))}
          {displayGrades.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No grades available</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Container className="nextPrevButton">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-secondary prevbtn">Previous Page</Button>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={endIndex >= grades.length}
          className="btn-secondary">Next Page</Button>
      </Container>
      {error && <div className="error-text">{error}</div>}
      <Button onClick={() => navigate(`/courses/${year}/${semester}`)} className="btn-secondary back-btn">Back</Button>
    </section>
  );
};

export default GradesPage;
