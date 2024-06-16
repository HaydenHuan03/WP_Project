import React from 'react'
import SignUpHeader from './UserHeader'
import Signup from './Signup'

function SignupPage() {
  return (
    <div className=' min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
      <SignUpHeader
      heading={"Create your own account"}
      paragraph={"Already have an account?"}
      linkName={"Login"}
      linkUrl='/'
      />
      <Signup/>        
      </div>
    </div>
  )
}

export default SignupPage