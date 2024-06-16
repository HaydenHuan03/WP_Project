import React from 'react'
import {Link} from 'react-router-dom'

function UserHeader({heading, paragraph, linkName, linkUrl="#"}) {
  return (
    <div className='mb-10 select-none'>
        <div className=' flex justify-center'>
            <img 
            className='h-30 w-20'
            src="https://masterbundles.com/wp-content/uploads/2022/11/lollipop-314.jpg"
            alt="" />
        </div>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {heading}
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
            {paragraph} {' '}
            <Link
            to={linkUrl} className=' font-medium text-[#635fc7] hover:text-[#635fc7]'
            >
                {linkName}
            </Link>
        </p>
    </div>
  )
}

export default UserHeader