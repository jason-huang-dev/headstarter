import React from 'react';
import { useLocation } from 'react-router-dom';
import { SideBar } from '../components/dashboard';

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

  return (
    <div>
      <SideBar user={user} />
    </div>
  ); 
};

export default Dashboards;
