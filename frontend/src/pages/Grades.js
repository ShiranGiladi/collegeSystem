import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const GradesPage = () => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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
      const response = await fetch(`/api/course/${user.username}/${year}/${semester}/${courseName}?page=${currentPage}&limit=${rowsPerPage}`);
      const json = await response.json();
      if (response.ok) {
        setGrades(json);
      } else {
        setError(json.error);
      }
    };

    fetchGrades();
  }, [currentPage]);

  const handleTableChange = (type, { sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setCurrentPage(1); // Reset the current page to the first page
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Task Name',
      sort: true,
    },
    {
      dataField: 'type',
      text: 'Task Type',
      sort: true,
    },
    {
      dataField: 'dueDate',
      text: 'Due Date',
      sort: true,
    },
    {
      dataField: 'grade',
      text: 'Grade',
      sort: true,
    },
    {
      dataField: 'percentage',
      text: 'Percent',
      sort: true,
    },
    {
      dataField: 'statsLink',
      text: 'Stats',
      formatter: (cellContent, row) => (
        <Button onClick={() => navigate(`/stats/${year}/${semester}/${courseName}/${courseCode}/${row.name}`)} variant="secondary">View Stats</Button>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayGrades = grades.slice(startIndex, endIndex);

  return (
    <section className='grades'>
      <h1 className="display-5">Grades for {courseName} Course ({courseCode})</h1>
      <BootstrapTable
        classes='custom-table'
        keyField="assignmentName"
        data={displayGrades}
        columns={columns}
        striped
        bordered
        hover
        responsive
        wrapperClasses="student-table"
        onTableChange={handleTableChange}
        defaultSortField={sortField}
        defaultSortOrder={sortOrder}
        sortIndicator
        bootstrap4
        noDataIndication="No grades available"
        headerClasses="table-header"
      />
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
      <Button onClick={() => navigate(`/courses/${year}/${semester}`)} className="btn-secondary back-btn">Back</Button>
    </section>
  );
};

export default GradesPage;


