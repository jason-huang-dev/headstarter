import React from 'react';
import { useLocation } from 'react-router-dom';
import { Drawer } from '../components/dashboard';

/**
 * Dashboards component that renders the dashboard with a drawer/sidebar.
 * 
 * This component uses `useLocation` from `react-router-dom` to access user data
 * from the state passed through the location object. It then renders the `Drawer`
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
      <Drawer user={user} />
    </div>
  );
};

export default Dashboards;
