import React, { useState, useEffect } from 'react';
import blankProfileImage from '../images/blank-profile.JPG';
import { BsCheck2, BsX, BsPencil } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isEmailEditable, setEmailEditable] = useState(false);
  const [isPhoneEditable, setPhoneEditable] = useState(false);
  const [editableEmail, setEditableEmail] = useState('');
  const [editablePhone, setEditablePhone] = useState('');
  const [previousEmail, setPreviousEmail] = useState('');
  const [previousPhone, setPreviousPhone] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const [msg, setMsg] = useState(null)
  const [details, setDetails] = useState({ email: '', phone: '' })
  const navigate = useNavigate();
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (!user || user.userType === 'admin') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }
    
    const fetchProfileDetails = async () => {
      const response = await fetch(`https://college-system-pixh.onrender.com/api/user/profileDetails/${user.username}`);
      const json = await response.json();
      if(response.ok) {
        setDetails(json)
        setEditableEmail(json.email)
        setPreviousEmail(json.email)
        setEditablePhone(json.phone)
        setPreviousPhone(json.phone)
      }

      if(!response.ok) {
        setMsg(json.error)
      }
    }

    if (isInitialRender) {
      setIsInitialRender(false);
      fetchProfileDetails();
    }

  }, [isInitialRender, navigate, user])

  const handleEmailEdit = async () => {
    if (isEmailEditable) {
      // Save changes here (e.g., update the email value in the database)
      const response = await fetch('https://college-system-pixh.onrender.com/api/user/profileDetails/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: user.username, detailToUpdate: editableEmail, whatToUpdate: 'email'})
      })
      const json = await response.json()

      if(response.ok) {
        setPreviousEmail(editableEmail);
        setMsg(json.message)
      }
      if(!response.ok) {
        setMsg(json.error)
      }
    }
    setEmailEditable(!isEmailEditable);
  };
  
  const handlePhoneEdit = async () => {
    if (isPhoneEditable) {
      // Save changes here (e.g., update the phone value in the database)
      const response = await fetch('https://college-system-pixh.onrender.com/api/user/profileDetails/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: user.username, detailToUpdate: editablePhone, whatToUpdate: 'phone'})
      })
      const json = await response.json()

      if(response.ok) {
        setPreviousPhone(editablePhone);
        setMsg(json.message)
      }
      if(!response.ok) {
        setMsg(json.error)
      }
    }
    setPhoneEditable(!isPhoneEditable);
  };
  
  const handleEmailChange = (e) => {
    setEditableEmail(e.target.value);
  };
  
  const handlePhoneChange = (e) => {
    setEditablePhone(e.target.value);
  };
  
  const handleEmailCancel = () => {
    setEditableEmail(previousEmail);
    setEmailEditable(false);
  };
  
  const handlePhoneCancel = () => {
    setEditablePhone(previousPhone);
    setPhoneEditable(false);
  };

  return (
    <div className="profile">
      <section>
        <div className="container container-profile">
          <div className="photo-container">
            <img src={blankProfileImage} className="profile-photo" alt="" />
          </div>
          <div className="info-container">
            <h4 className="student-name title">{details.name}</h4>
            <div className="input-container">
              <h6 className="title">Email Address:</h6>
              <div className="input-group">
                <input
                  type="email"
                  className={`form-control bg-transparent ${isEmailEditable ? '' : 'disabled'}`}
                  value={editableEmail}
                  onChange={handleEmailChange}
                  disabled={!isEmailEditable}
                />
                {isEmailEditable ? (
                  <>
                    <BsCheck2 className="check-icon" onClick={handleEmailEdit} />
                    <BsX className="cancel-icon" onClick={handleEmailCancel} />
                  </>
                ) : (
                  <BsPencil className="pencil-icon" onClick={handleEmailEdit} />
                )}
              </div>
            </div>
            <div className="input-container">
              <h6 className="title">Phone Number:</h6>
              <div className="input-group">
                <input
                  type="tel"
                  className={`form-control bg-transparent ${isPhoneEditable ? '' : 'disabled'}`}
                  value={editablePhone}
                  onChange={handlePhoneChange}
                  disabled={!isPhoneEditable}
                />
                {isPhoneEditable ? (
                  <>
                    <BsCheck2 className="check-icon" onClick={handlePhoneEdit} />
                    <BsX className="cancel-icon" onClick={handlePhoneCancel} />
                  </>
                ) : (
                  <BsPencil className="pencil-icon" onClick={handlePhoneEdit} />
                )}
              </div>
            </div>{msg && (<div>{msg}</div>)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
