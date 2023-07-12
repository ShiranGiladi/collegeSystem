import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import { ThemeContext } from '../App'; 
import { Sun, Moon } from 'react-bootstrap-icons';

function Switch() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Form>
      <div className="d-flex align-items-center">
        <Sun className="icons-switch sun" size={20} />
        <Form.Check
          type="switch"
          id="custom-switch"
          checked={theme === 'dark'}
          onChange={toggleTheme}
        />
        <Moon className="icons-switch" size={15} />
      </div>
    </Form>
  );
}

export default Switch;
