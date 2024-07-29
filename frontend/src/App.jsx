import SignIn from './pages/SignIn.jsx';
import Body from './pages/Body.jsx';
import Team from './pages/Team.jsx';
import WhenToMeet from './pages/WhenToMeet.jsx';
import Dashboards from './pages/Dashboards.jsx';

import { useRoutes, BrowserRouter as Router } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
    // Sets up routes
    let element = useRoutes([
      {
        path: "/signin",
        element:<SignIn/>
      },
      {
        path: "/",
        element:<Body/>
      },
      {
        path: "/team",
        element:<Team/>
      },
      {
        path: "/whentomeet",
        element:<WhenToMeet/>
      },
      {
        path: "/dashboards",
        element:<Dashboards/>
      }
    ]);

  return (
    <>
    <div className="page-wrapper">
    {element}
    </div>
    </>
  )
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

