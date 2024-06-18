import React, { useState } from 'react'
import showPass from '../assests/eye-regular.svg'
import hidePass from '../assests/eye-slash-solid.svg'

function Input({
    handleChange, value, labelText, labelFor, id, name, type, isRequired=false, placeholder, customClass
}) {
    const fixedInputClass=' rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
    const [showPassword, setShowPassword] = useState(false)
    
    const togglePasswordVisibility = () => {
      setShowPassword((state) => !state)
    }

  return (
    <div className='my-5 relative'>
        <label htmlFor={labelFor} className='sr-only'>
            {labelText}
        </label>
        <input
        action = ''
        onChange={handleChange} 
        value={value}
        id={id}
        name={name}
        type={showPassword ? 'text' : type}
        required={isRequired}
        className={`${fixedInputClass} ${customClass}`}
        placeholder={placeholder}
        />

        {
          type === 'password' && (
            <button
            type='button'
            className=' absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10'
            onClick={togglePasswordVisibility}
            >
              <img src={showPassword ? showPass : hidePass} alt="" className={`h-5 w-5 ${showPassword ? 'opacity-100' : 'opacity-50'}`}/>
            </button>
          )
        }
    </div>
  )
}

export default Input