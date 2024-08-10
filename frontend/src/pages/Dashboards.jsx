import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboards = () => {
  const location = useLocation();
  const user = location.state?.user; // Access user data from state

  const createCalendar = async (token, title, description) =>{
    console.log(token)
    const response = await fetch('http://localhost:8000/api/calendars/', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        title: title, 
        description: description,
      })
    });

    const data = await response.json();
    return data;
  }

  createCalendar(user.token, "Test", "Test Discription")
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

  return (
    <div>
      <h1>Dashboards</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <img className='profile-icon' src={user.picture} alt="Profile" />
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Dashboards;
