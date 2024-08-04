import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboards = () => {
  const location = useLocation();
  const user = location.state?.user; // Access user data from state

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