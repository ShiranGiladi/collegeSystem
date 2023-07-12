import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));  
  useEffect(() => {
    if (!user || user.userType === 'admin') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }
  }, [])

  return (
    <Container className="settings mt-4">
      <h1 className="display-5">Settings</h1>

      {/* Notification Preferences */}
      <div className="custom-container p-4">
        <h3 className="title">Notification Preferences</h3>
        <div className="row">
          <div className="col-6">
            <h6><br /></h6>
            <label className="form-check-label">Notify me when a new assignment is posted</label>
            <br />
            <label className="form-check-label">Notify me when a new grade is posted</label>
            <br />
            <label className="form-check-label">Notify me when there is an update of an existing assignment</label>
          </div>
          <div className="col-3">
            <h6 className="title">By Email</h6>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
          </div>
          <div className="col-3">
            <h6 className="title">By Phone</h6>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label"></label>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <Button className="btn-secondary" onClick={() => navigate(`/settings`)}>Update Preferences</Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="custom-container p-4 mt-4">
        <h3 className="title">Contact Us For Help</h3>
        <Container className="help-container">
          <form>
            <div className="form-group">
              <label className="title">Name</label>
              <input className="form-control" placeholder="Enter your name" />
            </div>
            <div className="form-group">
              <label className="title">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label className="title">Message</label>
              <textarea className="form-control" rows="5" placeholder="Enter your message"></textarea>
            </div>
            <Button type="submit" className="btn-secondary submit-help" onClick={() => navigate(`/settings`)}>Submit</Button>
          </form>
        </Container>
      </div>
      <br />
    </Container>
  );
}

export default SettingsPage;
