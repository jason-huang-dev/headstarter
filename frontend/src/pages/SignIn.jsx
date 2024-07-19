import { useState } from 'react'
import GoogleOAuth from '../components/GoogleOAuth'

function SignIn() {


  return (
    <>
      <h1>sign in with google</h1>
      <GoogleOAuth/>  
    </>
  )
}

export default SignIn