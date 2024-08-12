import { SignIn, Body, Team, WhenToMeet, Dashboards} from './pages';
import { useRoutes, BrowserRouter as Router } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './App.css'

/**
 * App component that sets up the routes for the application.
 * 
 * This component uses `useRoutes` from `react-router-dom` to define the routing
 * configuration for the application, associating each path with a specific component.
 * 
 * @component
 * @returns {JSX.Element} The routes rendered based on the current URL path.
 */
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
  );
}

/**
 * AppWithRouter component that wraps the App component with a Router.
 * 
 * This component uses `BrowserRouter` from `react-router-dom` to enable client-side routing
 * for the application.
 * 
 * @component
 * @returns {JSX.Element} The App component wrapped with a Router.
 */
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
