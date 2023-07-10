import React from 'react';
import {Link} from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MortarboardFill } from "react-bootstrap-icons";
import { useLogout } from '../hooks/useLogout'

const Navigation = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { logout } = useLogout()
  const handleLogOutClick = () => {
    logout()
  }

  let homeLink = ''
  if (user && user.userType === 'student') {
    homeLink = '/home'; // Redirect to home page
  }
  if (user && user.userType === 'lecturer') {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

    homeLink = `/courses/${currentYear}/${semester}`; // Redirect to courses page
  }

  return (
    <Navbar expand="md">
      <Container>
        <Navbar.Brand >
          <Link to={homeLink} className="mainHeader">
            <span className="fw-bold h3">
              <MortarboardFill className="grad" />
              Braude College
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end align-center">
          <Nav>
            <Nav.Link><Link to={homeLink} className="navbarLinks">Home Page</Link></Nav.Link>
            <Nav.Link><Link to="/profile" className="navbarLinks">My Profile</Link></Nav.Link>
            <Nav.Link><Link to="/settings" className="navbarLinks">Settings</Link></Nav.Link>
            <Nav.Link><Link to="/login" className="navbarLinks" onClick={handleLogOutClick}>Log Out</Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
