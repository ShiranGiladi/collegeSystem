import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { MortarboardFill, ExclamationCircle } from "react-bootstrap-icons";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLogin } from '../hooks/useLogin'
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App'; 

const LoginForm = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  /** forgot password */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const {login, isLoading, error} = useLogin()

  /** login button */
  const visitPage = async (e) => {
    const username = document.querySelector('.username').value.trim();
    const password = document.querySelector('.password').value.trim();

    e.preventDefault()

    await login(username, password)
    
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userType == 'student') {
      navigate('/home') // Redirect to home page
    }
    if (user && user.userType == 'lecturer') {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const semester = currentMonth >= 10 && currentMonth <= 2 ? 'Winter' : currentMonth >= 3 && currentMonth <= 7 ? 'Spring' : 'Summer';

      navigate(`/courses/${currentYear}/${semester}`) // Redirect to courses page
    }
    if (user && user.userType == 'admin') {
      navigate(`/admin`) // Redirect to admin page
    }
  }

  /** eye icon */
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  /** check theme (light or dark) */
  const { theme } = useContext(ThemeContext);

  return (
    <section className="login container-login forms">
      <h1 className="display-6">
        <MortarboardFill className="grad"/>
        Braude College
      </h1>

      <div className="form login">
        <div className="form-content">
          <form action="#">
            <div className="field input-field">
              <input
                type="text"
                className="form-control input username"
                placeholder="Username"       
              />
            </div>
            <div className="field input-field">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control password"
                placeholder="Password"
              />
              <EyeIcon onClick={handleTogglePassword} passwordVisible={passwordVisible} />
            </div>

            <div className="form-link">
              <Link className="link" onClick={handleShow}>Forgot Password?</Link>
            </div>

            <div className="field button-field">
              <Button onClick={visitPage} className="btn-secondary login-btn">Login</Button>
            </div>
            {error && (
              <div className="error-text">
                <ExclamationCircle className="error-icon" size={16} />
                {error}
               </div>
            )}
          </form>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton style={theme === 'dark' ? { backgroundColor: '#214468', color: '#fff' } : {}}>
          <Modal.Title>Forgot your password?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={theme === 'dark' ? { backgroundColor: '#214468', color: '#fff' } : {}}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Please enter the email address you'd like your password reset information sent to.
              </Form.Label>
              <Form.Label>Email address:</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" autoFocus style={theme === 'dark' ? { backgroundColor: '#607287', color: 'white', borderColor: '#0E2A47' } : {}}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={theme === 'dark' ? { backgroundColor: '#214468', color: '#fff' } : {}}>
          <Button className="btn-secondary" onClick={handleClose} style={theme === 'dark' ? { backgroundColor: '#E9CCDB', borderColor: '#E9CCDB', color: '#0E2A47' } : {}}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>

    </section>
  );
};


const EyeIcon = ({ onClick, passwordVisible }) => {
  const eyeIconClassName = passwordVisible ? 'bi-eye' : 'bi-eye-slash';

  const handleClick = () => {
    onClick();
  };

  /** check theme (light or dark) */
  const { theme } = useContext(ThemeContext);

  const eyeIconStyle = {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    color: theme === 'dark' ? '#fff' : '#6c757d',
    padding: '5px',
    display: 'block'
  };

  return (
    <div>
      <i className={`bi ${eyeIconClassName}`} onClick={handleClick} style={eyeIconStyle}></i>
    </div>
  );
};

export default LoginForm
