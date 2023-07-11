import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

const btnColor = ['rgba(255, 99, 132, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 205, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(201, 203, 207, 0.4)'];
const borderColor = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

function MyCoursesPage() {
  const { year, semester } = useParams();
  const [courseDetails, setCourseDetails] = useState(null)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || user.userType === 'admin') {
        navigate('/PageNotFound'); // Redirect the user to 404 page
        return;
      }
      
      let response, json;
      if(user.userType === 'student') {
        response = await fetch(`/api/course/${user.username}/${year}/${semester}`);
        json = await response.json();
      }
      else { //user.userType == 'lecturer'
        response = await fetch(`/api/lecturer/${user.username}`);
        json = await response.json();
      }
      
      if(response.ok) {
        setCourseDetails(json)
      }

      if(!response.ok) {
        setError(json.error)
      }
    }

    fetchCourses()
  }, [navigate, user, semester, year])

  const displayCourses = () => {
    if (courseDetails === null) {
      return null;
    }

    return courseDetails.map((course, index) => (
      <button
        key={index}
        onClick={() => handleDisplayClick(course)}
        type="button"
        className="btn col-6 col-md-4"
        style={{ backgroundColor: btnColor[index % btnColor.length], borderColor: borderColor[index % borderColor.length] }}>
        <div>{course.name}</div>
        <div style={{ fontSize: '16px' }}>{'('+ course.code + ')'}</div>
      </button>
    ));
  }

  const handleDisplayClick = (course) => {
    if(user.userType === 'student') {
      navigate(`/grades/${year}/${semester}/${course.name}/${course.code}`);
    }
    else { //user.userType == 'lecturer'
      navigate(`/grades-teachers/${course.name}/${course.code}`);
    }
  };

  let link = '/home'; // Redirect to home page
  
  return (
    <section className='courses'>
      <h1 className="display-5">My Courses - {semester} {year}</h1>

      <div className="container container-courses text-center">
        <div className="row">
          {courseDetails && displayCourses()}
          {error && (
            <div className="error-text">
              <div>{error}</div>
              <Link to={link}>
                <Button variant='secondary' className='btnGoBack'>Go Back</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MyCoursesPage;
