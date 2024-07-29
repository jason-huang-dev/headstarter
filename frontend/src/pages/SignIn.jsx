import React from 'react';
import GoogleOAuth from '../components/GoogleOAuth';
import Footer from '../components/Footer';
import iconsite from '../assets/iconsite.png';

function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={iconsite} alt="Logo" className="h-20 w-20" /> 
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Sign in with Google</h2>
        <p className="text-center text-gray-600 mb-6">
          to continue to your [ProjectName] account.
        </p>
        <GoogleOAuth />
       
      </div>
      <Footer />
  
    </div>
  );
}

export default SignIn;
