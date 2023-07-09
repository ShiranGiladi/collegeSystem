import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import 'flatpickr/dist/flatpickr.min.css';

const UpdateAssignment = () => {
  const { courseName, courseCode } = useParams();
  const [type, setAssignmentType] = useState('');
  const [updateName, setAssignmentName] = useState('');
  const [previousName, setpreviousName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.userType !== 'lecturer') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }

    const rowData = JSON.parse(localStorage.getItem('rowData'));
    if (rowData) {
      setAssignmentType(rowData.type);
      setAssignmentName(rowData.name);
      setpreviousName(rowData.name);
      setPercentage(rowData.percentage);
      setDueDate(rowData.dueDate);
    }
  }, []);

  const handleUpdateClick = async () => {
    const response = await fetch('/api/user/updateTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseName, courseCode, previousName, updateName, dueDate, percentage, type }),
    });
    const json = await response.json();
    if(response.ok) {
      setMsg(json.message);
    }
    if(!response.ok) {
      setMsg(json.error);
    }
  };

  const handleDeleteClick = async () => {
    const response = await fetch(`/api/user/deleteTask/${courseName}/${courseCode}/${updateName}`, {
      method: 'DELETE'
    });
    const json = await response.json();
    
    if(response.ok) {
      setMsg(json.message);
    }
    if(!response.ok) {
      setMsg(json.error);
    }
  };

  return (
    <div className="new-task">
      <h1 className="display-5">Update Assignment Details</h1>
      <Container className="container-new-task">
        <label className="form-label label-grades">Assignment Type:</label>
        <select className="form-select" aria-label="Default select example" value={type} onChange={(e) => setAssignmentType(e.target.value)} >
          <option value="HW" selected={type === 'HW'} >Homework</option>
          <option value="Lab" selected={type === 'Lab'} >Lab</option>
        </select>

        <div className="mb-3">
          <label className="form-label label-grades">Assignment Name:</label>
          <input className="form-control" value={updateName} onChange={(e) => setAssignmentName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label label-date">Percentage:</label>
          <input className="form-control" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
        </div>

        <div>
          <label className="form-label label-date">Due Date:</label>
          <input type="date" className="form-control choose-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <Container className='update-dalete'>
          <Button onClick={handleUpdateClick} className="btn-secondary">Update</Button>
          <Button onClick={handleDeleteClick} className="btn-danger">Delete Task</Button>
        </Container>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Button onClick={() => navigate(`/grades-teachers/${courseName}/${courseCode}`)} className="btn-secondary back-btn">Back</Button>
    </div>
  );
};

export default UpdateAssignment;
