import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import 'flatpickr/dist/flatpickr.min.css';
// import { Display } from 'react-bootstrap-icons';

const UploadGrades = () => {
  const [studentId, setStudentId] = useState('');
  const { courseName, courseCode, name } = useParams();
  const [msg, setMsg] = useState(null);
  const [msgUploadFile, setMsgUploadFile] = useState(null);
  const [grade, setGrade] = useState('0');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    if (!user || user.userType !== 'lecturer') {
      navigate('/PageToFound'); // Redirect the user to 404 page
      return;
    }
  }, [navigate, user])

  const handleGoButtonClick = async () => {
    const response = await fetch(`/api/lecturer/studentGrade/${courseName}/${courseCode}/${name}/${studentId}`);
    const json = await response.json();
    if (response.ok) {
      setGrade(json);
      setMsg('')
    }
    if (!response.ok) {
      setMsg(json.error);
    }
  };

  const handleSubmitButtonClick = async () => {
    const response = await fetch('/api/lecturer/uploadGradeForOneStudent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseName, courseCode, taskName: name, userId: studentId, newGrade: grade }),
    });
    const json = await response.json();
    
    if(response.ok) {
      setMsg(json.message);
    }
    if(!response.ok) {
      setMsg(json.error);
    }
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMsgUploadFile('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`/api/lecturer/uploadExcelFile/${courseName}/${courseCode}/${name}/upload`, {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      
      if (response.ok) {
        setMsgUploadFile(json.message)
      } 
      if(!response.ok) {
        setMsgUploadFile(json.error)
        // console.error('File upload failed.');
      }
    } catch (error) {
      console.error('An error occurred during file upload.', error);
    }
  };
  
  return (
    <div className="new-task">
      <h1 className="display-5">Upload Grades</h1>
      <Container className="container-new-task">
        <label className="form-label label-grades">Upload grades for many students:</label>
        <div className="input-group">
          <input type="file" className="form-control" id="gradesMany" aria-describedby="uploadButtonMany" aria-label="Upload" onChange={handleFileChange}/>
          <Button className="btn-secondary" id="uploadButtonMany" onClick={handleUpload}>Upload</Button>
        </div>
        {msgUploadFile && <div className="error-text file-error">{msgUploadFile}</div>}

        <label id="gradesOneLabel">____________________</label>
        
        <label className="form-label label-grades">Upload grade for one student:</label>
        <div className="input-group">
          <input className="form-control" id="gradesOne" placeholder="Enter student ID" onChange={(e) => setStudentId(e.target.value)} />
          <Button onClick={handleGoButtonClick} className="btn-secondary" id="uploadButtonOne">Go</Button>
        </div>
        <input className="form-control" id="oldGrade" value={grade}onChange={(e) => setGrade(e.target.value)} />

        <Button type="submit" onClick={handleSubmitButtonClick} className="btn-secondary submit-task">Submit</Button>
        {msg && <div className="error-text">{msg}</div>}
      </Container>

      <Button onClick={() => navigate(`/grades-teachers/${courseName}/${courseCode}`)} className="btn-secondary back-btn">Back</Button>
    </div>
  );
};

export default UploadGrades;
