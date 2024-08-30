import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

/**
 * GoogleOAuth component that handles Google OAuth authentication.
 * 
 * This component provides Google login functionality using `@react-oauth/google`.
 * It manages user authentication state, sends the login token to the server, and
 * navigates to the dashboards page upon successful login.
 * 
 * @component
 * @returns {JSX.Element} The rendered GoogleOAuth component with login functionality.
 */
const GoogleOAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Login Success: ', credentialResponse.credential);
    console.log('Post UrL: ', `https://${import.meta.env.VITE_BACKEND_URL}/api/auth/google/`);
    
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/api/auth/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Convert the base64 image to a data URL
        if (data.picture) {
          data.picture = `data:image/jpeg;base64,${data.picture}`;
        }

        setUser(data);
        navigate('/dashboards', { state: { user: data } }); // Navigate to the dashboards page
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
