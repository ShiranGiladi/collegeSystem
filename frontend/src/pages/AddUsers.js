import { Button, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewUsers = () => {
  const [userType, setUserType] = useState('Student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idUser, setIdUser] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.userType !== 'admin') {
      navigate('/PageNotFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user])

  const handleAddUserBtn = async () => {
    const response = await fetch('/api/admin/addNewUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userType, fullName, email, phone, idUser, username, password }),
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
    <section className="add-users">
      <h1 className="display-5">Add New User</h1>
      <Container className="container-new-user">
        <div className='user-type'>
          <label className="form-label label-user-type">User Type:</label>
          <select className="form-select" aria-label="Default select example" value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>
        <div className='container-all-info'>
          <div className='left-side-info'>
            <div>
              <label className="form-label label-info">Full Name:</label>
              <input className="form-control" placeholder="e.g. John Smith" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Email Address:</label>
              <input className="form-control" placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Phone Number:</label>
              <input className="form-control" placeholder="e.g. 1111111111" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
          </div>
          <div>
            <div>
              <label className="form-label label-info">User's ID:</label>
              <input className="form-control" placeholder="e.g. 123456789" value={idUser} onChange={(e) => setIdUser(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Username:</label>
              <input className="form-control" placeholder="e.g. student1" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>

            <div>
              <label className="form-label label-info">Password:</label>
              <input className="form-control" placeholder="e.g. password1" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>         
          </div>          
        </div>       
        <Button type="submit" onClick={handleAddUserBtn} className="btn-secondary submit-new-user">Add User</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>
      <Link to={link}>
        <Button className="btn-secondary back-btn">Back</Button>
      </Link>
    </section>
  );
};

export default NewUsers;
