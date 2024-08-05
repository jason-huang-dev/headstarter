import React from 'react';
import { useLocation } from 'react-router-dom';
import { SideBar, CalendarOverview } from '../components/dashboard';

/**
 * Dashboards component that renders the dashboard with a SideBar.
 * 
 * This component uses `useLocation` from `react-router-dom` to access user data
 * from the state passed through the location object. It then renders the `SideBar`
 * component, passing the user data as a prop.
 * 
 * @component
 * @returns {JSX.Element} The rendered Dashboards component.
 * @workers Jason
 */
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
    <div className="flex h-screen">
    <SideBar user={user}>
  
    </SideBar>
    <div className="flex-grow h-full">
      <CalendarOverview />
    </div>
  </div>
  ); 
};

export default Dashboards;
