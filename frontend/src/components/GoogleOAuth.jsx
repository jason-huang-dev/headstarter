import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import GoogleOAuth from './GoogleOAuth';

function HandleRedirect() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      window.location.href = '/'; // Redirect to home page
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <Route exact path="/" component={GoogleOAuth} />
      <Route path="/oauth-redirect" component={HandleRedirect} />
    </Router>
  );
}

export default App;