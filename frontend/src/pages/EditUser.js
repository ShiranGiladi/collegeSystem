import { Button, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EditUsers = () => {
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msgForEnterId, setMsgForEnterId] = useState(null);
  const [msgForUpdateOrDelete, setMsgForUpdateOrDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [])

  const handleGoButtonClick = async () => {
    const response = await fetch(`/api/admin/getUserDetails/${userId}`);
    const json = await response.json();
    if (response.ok) {
      setMsgForUpdateOrDelete('')
      setMsgForEnterId('')
      setFullName(json.userDetails.name)
      setEmail(json.userDetails.email)
      setPhone(json.userDetails.phone)
      setIdUser(json.userDetails.idUser)
      setUsername(json.userDetails.username)
      setPassword(json.userDetails.password)
    }
    if (!response.ok) {
      setMsgForUpdateOrDelete('')
      setMsgForEnterId(json.error);
      setFullName('')
      setEmail('')
      setPhone('')
      setIdUser('')
      setUsername('')
      setPassword('')
    }
  };

  const handleUpdateUserButton = async () => {
    const response = await fetch('/api/admin/updateUserDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fullName, email, phone, idUser, username, password }),
    });
    const json = await response.json();
    
    if(response.ok) {
      setMsgForUpdateOrDelete(json.message);
    }
    if(!response.ok) {
      setMsgForUpdateOrDelete(json.error);
    }
  };

  const handleDeleteUserButton = async () => {
    const response = await fetch(`/api/admin/deleteUser/${userId}`, {
      method: 'DELETE'
    });
    const json = await response.json();
    
    if(response.ok) {
      setMsgForUpdateOrDelete(json.message);
    }
    if(!response.ok) {
      setMsgForUpdateOrDelete(json.error);
    }
  };

  let link = '/admin';

  return (
    <section className="add-users">
      <h1 className="display-5">Edit User's Details</h1>
      <Container className="container-new-user">
        <div className='user-type'>
          <label className="form-label label-user-type">User's ID:</label>
          <div className="input-group userID-input">
            <input className="form-control" placeholder="Enter User's ID" value={userId} onChange={(e) => setUserId(e.target.value)}/>
            <Button onClick={handleGoButtonClick} className="btn-secondary">Go</Button>
          </div>
        </div>
        {msgForEnterId && <div className="error-text">{msgForEnterId}</div>}

        <div className='container-all-info'>
          <div className='left-side-info'>
            <div>
              <label className="form-label label-info">Full Name:</label>
              <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Email Address:</label>
              <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Phone Number:</label>
              <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
          </div>
          <div>
            <div>
              <label className="form-label label-info">User's ID:</label>
              <input className="form-control" value={idUser} onChange={(e) => setIdUser(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Username:</label>
              <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Password:</label>
              <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
          </div>          
        </div>
        <div className='update-dalete'>
          <Button onClick={handleUpdateUserButton} className="btn-secondary">Update User</Button>
          <Button onClick={handleDeleteUserButton} className='btn-danger'>Delete User</Button>
        </div>
        {msgForUpdateOrDelete && <div className="error-text">{msgForUpdateOrDelete}</div>}
      </Container>
      
      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default EditUsers;
