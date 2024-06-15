import React from 'react'
import LogInHeader from './LogInHeader'
import Login from './Login'

function LoginSignIn() {
  return (
    <div
    className=' min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'
    >
      <div
      className='max-w-md w-full space-y-8' 
      >
          <LogInHeader
          heading={"Login to your account"}
          paragraph={"Don't have an account yet? "}
          linkName={"Signup"}
          linkUrl='/signup'
          />  
          <Login/>
      </div>

    </div>
  )
}

export default LoginSignIn