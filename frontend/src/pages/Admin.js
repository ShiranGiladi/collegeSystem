import React, { useEffect } from 'react';
import { Button, Container} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const btnColor = ['rgba(255, 99, 132, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 205, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(153, 102, 255, 0.4)'];
const borderColor = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'];

const AdminHome = () => {
  let link1 = '/add-users';
  let link2 = '/edit-users';
  let link3 = '/add-course';
  let link4 = '/delete-course';
  let link5 = '/add-admin';
  let link6 = '/edit-admin';

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [])

  return (
    <section className='AdminHome'>
      <h1 className="display-5">Home Page - Admin</h1>
      <Container className="btnAdmin">
        <Link to={link1}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[3], borderColor: borderColor[3] }}>Add New User</Button>
        </Link>
        <Link to={link2}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[4], borderColor: borderColor[4] }}>Edit User's Details</Button>
        </Link>
        <Link to={link3}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[5], borderColor: borderColor[5] }}>Add Course to User</Button>
        </Link>
        <Link to={link4}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[0], borderColor: borderColor[0] }}>Delete Course from User</Button>
        </Link>
        <Link to={link5}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[1], borderColor: borderColor[1] }}>Add Another Admin</Button>
        </Link>
        <Link to={link6}>
          <Button className='buttonsAdmin' style={{ backgroundColor: btnColor[2], borderColor: borderColor[2] }}>Edit My Details</Button>
        </Link>
      </Container>
    </section>
  );
};

export default AdminHome;
