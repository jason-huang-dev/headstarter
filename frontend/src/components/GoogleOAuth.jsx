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
      <div className="flex justify-center">
        {user ? (
          <div className="text-center">
            <h2>Welcome, {user.username}</h2>
            <img className="profile-icon mt-4 rounded-full" src={user.picture} alt="Profile" />
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};


export default GoogleOAuth;
