import React from 'react';
import { Button, Container} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  let link = ''
  if (!user) {
    link = '/login';
  }
  else if (user && user.userType == 'student') {
    link = '/home'; // Redirect to home page
  }
  else if (user && user.userType == 'lecturer') {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

    link = `/courses/${currentYear}/${semester}`; // Redirect to courses page
  }
  else if (user && user.userType == 'admin') {
    link = '/admin'; // Redirect to home page
  }

  return (
    <Container className="justify-content-center container-not-found">
      <h1 className="text-center">404 - Page Not Found</h1>
      <p className="text-center">Oops! The page you are looking for does not exist.</p>
      <div className="d-flex justify-content-center">
        <Link to={link}>
          <Button variant="secondary">Go Back</Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
