import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user])

  const handleAddAdminButton = async () => {
    const response = await fetch('/api/admin/addNewAdmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();
    if(response.ok) {
      setMsg(json.message);
    }
    if(!response.ok) {
      setMsg(json.error);
    }
  };

  let link = '/admin';

  return (
    <section className="add-course">
      <h1 className="display-5">Add Another Admin</h1>
      <Container className='container-add-course'>

        <div className="label-input-div">
            <label className="form-label label-new-admin">Admin Username:</label>
            <input className="form-control" placeholder="e.g. Admin2" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className="label-input-div">
            <label className="form-label label-new-admin">Admin Password:</label>
            <input className="form-control" placeholder="e.g. Password2" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <Button className="btn-secondary add-btn" onClick={handleAddAdminButton}>Add Admin</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default AddAdmin;
