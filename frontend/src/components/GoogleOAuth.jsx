import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleOAuth = () => {
  const [user, setUser] = useState(null);

  // Parses and stores user profile info obtained from Google
  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    try {
      const response = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,  // Assuming the token is in `credentialResponse.credential`
        }),
      });

      const data = await response.json();
      console.log('Server Response:', data);

      // Assuming the server returns user profile info
      if (response.ok) {
        setUser(data);
      } else {
       console.error('Error from server:', data);
        setUser(null);
      }
    } catch (error) {
      console.error('Error sending POST request:', error);
      setUser(null);
    }
  };

  const handleLoginError = (error) => {
    console.error('Login Error:', error);
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_ID}>
      <div>
        <h1>Google OAuth Example</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.username}</h2>
            <img className='profile-icon' src={user.picture} alt="Profile" />
          </div>
        ) : (
          <div className='btn-wrap'>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuth;
