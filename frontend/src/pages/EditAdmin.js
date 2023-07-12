import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const EditAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const fetchdetails = async () => {
      if (!user || user.userType !== 'admin') {
        navigate('/PageNotFound'); // Redirect the user to 404 page
        return;
      }

      const response = await fetch(`${process.env.SERVER_URL}/api/admin/getAdminDetails/${user.username}`);
      const json = await response.json();
      
      if(response.ok) {
        setUsername(json.admin.username)
        setPassword(json.admin.password)
      }
      if(!response.ok) {
        setMsg(json.error);
      }
    }

    if (isInitialRender) {
      setIsInitialRender(false);
      fetchdetails();
    }

  }, [isInitialRender, navigate, user]);

  const handleSaveButton = async () => {
    const response = await fetch('https://college-system-pixh.onrender.com/api/admin/editAdminDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUsername: user.username, username, password }),
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
      <h1 className="display-5">Edit My Details</h1>
      <Container className='container-add-course'>

        <div className="label-input-div">
            <label className="form-label label-info">My Username:</label>
            <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>

        <div className="label-input-div">
            <label className="form-label label-info">My Password:</label>
            <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <Button className="btn-secondary add-btn" onClick={handleSaveButton}>Save Changes</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default EditAdmin;
