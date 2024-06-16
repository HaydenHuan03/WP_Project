import React from 'react'

function formExtra() {
  return (
    <div className='flex items-center justify-between'>
        <div className='flex items-center'>
            <input
             id='rememberme'
             name='rememberme'
             type='checkbox'
             className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
            />
            <label htmlFor="rememberme" className="ml-2 block text-sm text-gray-900">remember me</label>
        </div>

        <div className=' text-sm'>
            <a href="#" className='font-medium text-purple-600 hover:text-purple-500'>
                Forgot Password?
            </a>
        </div>
    </div> 
  )
}

export default formExtra