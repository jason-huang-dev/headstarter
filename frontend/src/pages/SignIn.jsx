import React from 'react';
import {GoogleOAuth, Footer} from '../components';
import {iconsite} from '../assets/png';

function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="bg-white py-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <a href="/">
            <img src={iconsite} alt="Logo" className="h-20 w-20" />
          </a>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Sign in with Google</h2>
        <p className="text-center text-gray-600 mb-6">
          to continue to your TimeMesh account.
        </p>
        <GoogleOAuth />
       
      </div>
      <Footer />
  
    </div>
  );
}

export default SignIn;
