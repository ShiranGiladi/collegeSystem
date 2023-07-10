import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
// import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const TeachersGradesPage = () => {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
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
        `/api/lecturer/${user.username}/${courseName}/${courseCode}`
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
  }, []);

  const handleTableChange = (type, { sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
  };

  const handleUpdateButtonClick = (row) => {
    localStorage.setItem('rowData', JSON.stringify(row));
    navigate(`/update/${courseName}/${courseCode}`);
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
      dataField: 'percentage',
      text: 'Percent',
      sort: true,
    },
    {
      dataField: 'updateDetails',
      text: 'Update Details',
      formatter: (cellContent, row) => (
        <Button onClick={() => handleUpdateButtonClick(row)} variant="secondary">
          Edit Task
        </Button>
      ),
    },
    {
      dataField: 'uploadGrades',
      text: 'Upload Grades',
      formatter: (cellContent, row) => (
        <Button
          onClick={() =>
            navigate(`/upload-grades/${courseName}/${courseCode}/${row.name}`)
          }
          variant="secondary"
        >
          Edit Grade
        </Button>
      ),
    },
  ];

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  return (
    <section className="grades-teachers">
      <h1 className="display-5">Tasks for {courseName} Course ({courseCode})</h1>

      <Container className="container-grades-teacher">
        <Button
          onClick={() => navigate(`/new-assignment/${courseName}/${courseCode}`)}
          variant="secondary">Add New Assignment</Button>
      </Container>

      {/* <BootstrapTable
        classes='custom-table'
        keyField="assignmentName"
        data={tasks.slice(start, end) || []}
        columns={columns}
        striped
        bordered
        hover
        responsive
        wrapperClasses="sortable teacher-table"
        onTableChange={handleTableChange}
        defaultSortField={sortField}
        defaultSortOrder={sortOrder}
        sortIndicator
        bootstrap4
        noDataIndication="No tasks available"
        headerClasses="table-header"
      /> */}

      <Container className="nextPrevButton">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="btn-secondary prevbtn">Previous Page</Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="btn-secondary">Next Page</Button>
      </Container>

      <Button
        onClick={() => navigate(`/courses/${currentYear}/${semester}`)}
        className="btn-secondary back-btn">Back</Button>
    </section>
  );
};

export default TeachersGradesPage;
