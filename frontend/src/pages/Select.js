import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CourseSelection = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState('2023');
  const [semester, setSemester] = useState('Winter');

  const user = JSON.parse(localStorage.getItem('user'));  
  useEffect(() => {
    if (!user || user.userType !== 'student') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }
  }, [])

  const handleDisplayClick = () => {
    navigate(`/courses/${year}/${semester}`);
  };

  return (
    <section className='select'>
      <h1 className="display-5">Choose Courses to Display</h1> 

      <Container className="container-select">
        <Form.Group controlId="Year">
          <Form.Label>Year:</Form.Label>
          <Form.Select aria-label="Default select example" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="Semester">
          <Form.Label>Semester:</Form.Label>
          <Form.Select aria-label="Default select example" value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="Winter">1</option>
            <option value="Spring">2</option>
            <option value="Summer">Summer</option>
          </Form.Select>
        </Form.Group>
      </Container>

      <Button
        onClick={handleDisplayClick}
        className="btn-secondary btn-display"
      >
        Display
      </Button>

    </section>
  );
};

export default CourseSelection;
