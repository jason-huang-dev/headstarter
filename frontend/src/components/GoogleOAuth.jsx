import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleOAuth = () => {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    setUser(credentialResponse); // You might want to parse and use the profile info here.
  };

  const handleLoginError = (error) => {
    console.error('Login Error:', error);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_ID}>
      <div>
        <h1>Google OAuth Example</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.name}</h2>
            <img src={user.picture} alt="Profile" />
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
