import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navbar';
import NavigationAdmin from './components/NavbarAdmin';
import Switch from './components/Switch';
import Placeholder from './components/Placeholder';
import LoginForm from './pages/Login';
import CourseSelection from './pages/Select';
import MyCoursesPage from './pages/Courses';
import GradesPage from './pages/Grades';
import TeachersGradesPage from './pages/GradesTeachers';
import Stats from './pages/Stats';
import NewAssignment from './pages/NewAssignment';
import UpdateAssignment from './pages/UpdateTask';
import UploadGrades from './pages/UploadGrades';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import AdminHome from './pages/Admin';
import NewUsers from './pages/AddUsers'
import EditUsers from './pages/EditUser';
import AddCourse from './pages/AddCourse';
import DeleteCourse from './pages/DeleteCourse';
import AddAdmin from './pages/AddAdmin';
import EditAdmin from './pages/EditAdmin';
import NotFound from './pages/NotFound';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createContext, useState } from 'react';

export const ThemeContext = createContext(null);

function App() {  
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <BrowserRouter>
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/login" />}
              />
              
              <Route
                path='/login'
                element={
                  <div className="background-login"> 
                    <Placeholder />
                    <Switch className="switch-no-nav"/>
                    <LoginForm />
                  </div>
                }
              />

              <Route
                  exact path='/home'
                  element={
                    <div className="background background-select"> 
                      <Navigation />
                      <Switch />
                      <CourseSelection /> 
                    </div>
                  }
                />

              <Route
                exact path='/courses/:year/:semester'
                element={
                  <div className="background background-courses"> 
                    <Navigation />
                    <Switch />
                    <MyCoursesPage />
                  </div>
                }
              />

              <Route
                exact path='/grades/:year/:semester/:courseName/:courseCode'
                element={
                  <div className="background background-grades"> 
                    <Navigation />
                    <Switch />
                    <GradesPage />
                  </div>
                }
              />

              <Route
                exact path='/grades-teachers/:courseName/:courseCode'
                element={
                  <div className="background background-grades"> 
                    <Navigation />
                    <Switch />
                    <TeachersGradesPage />
                  </div>
                }
              />

              <Route
                exact path='/stats/:year/:semester/:courseName/:courseCode/:assignmentName'
                element={
                  <div className="background background-stats"> 
                    <Navigation />
                    <Switch />
                    <Stats />
                  </div>
                }
              />

              <Route
                exact path='/profile'
                element={
                  <div className="background-login"> 
                    <Navigation />
                    <Switch />
                    <Profile />
                  </div>
                }
              />

              <Route
                exact path='/settings'
                element={
                  <div className="background-settings"> 
                    <Navigation />
                    <Switch />
                    <SettingsPage />
                  </div>
                }
              />

              <Route
                exact path='/new-assignment/:courseName/:courseCode'
                element={
                  <div className="background background-select">  
                    <Navigation />
                    <Switch />
                    <NewAssignment />
                  </div>
                }
              />

              <Route
                exact path='/update/:courseName/:courseCode'
                element={
                  <div className="background background-select">  
                    <Navigation />
                    <Switch />
                    <UpdateAssignment />
                  </div>
                }
              />

              <Route
                exact path='/upload-grades/:courseName/:courseCode/:name'
                element={
                  <div className="background background-select">  
                    <Navigation />
                    <Switch />
                    <UploadGrades />
                  </div>
                }
              />

              <Route
                exact path='/admin'
                element={
                  <div className="background background-courses">  
                    <NavigationAdmin />
                    <Switch />
                    <AdminHome />
                  </div>
                }
              />

              <Route
                exact path='/add-users'
                element={
                  <div className="background background-select">  
                    <NavigationAdmin />
                    <Switch />
                    <NewUsers />
                  </div>
                }
              />

              <Route
                exact path='/edit-users'
                element={
                  <div className="background background-select">  
                    <NavigationAdmin />
                    <Switch />
                    <EditUsers />
                  </div>
                }
              />

              <Route
                exact path='/add-course'
                element={
                  <div className="background background-grades">  
                    <NavigationAdmin />
                    <Switch />
                    <AddCourse />
                  </div>
                }
              />

              <Route
                exact path='/delete-course'
                element={
                  <div className="background background-grades">  
                    <NavigationAdmin />
                    <Switch />
                    <DeleteCourse />
                  </div>
                }
              />

              <Route
                exact path='/add-admin'
                element={
                  <div className="background background-stats">  
                    <NavigationAdmin />
                    <Switch />
                    <AddAdmin />
                  </div>
                }
              />

              <Route
                exact path='/edit-admin'
                element={
                  <div className="background background-stats">  
                    <NavigationAdmin />
                    <Switch />
                    <EditAdmin />
                  </div>
                }
              />

              <Route
              exact path='*'
              element={
                <div className="background-not-found">
                  <Placeholder />
                  <Switch />
                  <NotFound />
                </div>
              }
            />
          
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;