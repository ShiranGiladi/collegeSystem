import React from 'react';
import {Link} from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MortarboardFill } from "react-bootstrap-icons";
import { useLogout } from '../hooks/useLogout'

const NavigationAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const { logout } = useLogout()
  const handleLogOutClick = () => {
    logout()
  }

  let homeLink = '/admin'

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
            <Nav.Link><Link to="/login" className="navbarLinks" onClick={handleLogOutClick}>Log Out</Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationAdmin;
