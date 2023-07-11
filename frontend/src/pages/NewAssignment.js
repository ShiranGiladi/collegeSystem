import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import 'flatpickr/dist/flatpickr.min.css';
import { useParams, useNavigate } from 'react-router-dom';

const NewAssignment = () => {
  const { courseName, courseCode } = useParams();
  const [msg, setMsg] = useState(null);
  const [type, setAssignmentType] = useState('HW');
  const [name, setAssignmentName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (!user || user.userType !== 'lecturer') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user])

  const handleSubmit = async () => {
    const response = await fetch('https://college-system-pixh.onrender.com/api/user/addNewTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseName, courseCode, name, dueDate, percentage, type }),
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
      <h1 className="display-5">Add New Assignment</h1>
      <Container className="container-new-task">
        <label className="form-label label-grades">Assignment Type:</label>
        <select className="form-select" aria-label="Default select example" value={type} onChange={(e) => setAssignmentType(e.target.value)} >
          <option value="HW">Homework</option>
          <option value="Lab">Lab</option>
        </select>

        <div className="mb-3">
          <label className="form-label label-grades">Assignment Name:</label>
          <input className="form-control" placeholder="e.g. Homework 1" value={name} onChange={(e) => setAssignmentName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label label-date">Percentage:</label>
          <input className="form-control" placeholder="e.g. 5%" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
        </div>

        <div>
          <label className="form-label label-date">Due Date:</label>
          <input type="date" className="form-control choose-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Button type="submit" onClick={handleSubmit} className="btn-secondary submit-task">Submit</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Button onClick={() => navigate(`/grades-teachers/${courseName}/${courseCode}`)} className="btn-secondary back-btn">Back</Button>
    </div>
  );
};

export default NewAssignment;
