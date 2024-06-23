import React, { useState } from 'react'
import { signupFields } from '../formFields'
import FormAction from '../components/formAction'
import Input from './Input'
import SignupLogo from '../assests/user-plus-solid.svg'
import { useNavigate } from 'react-router'
import axios from 'axios'


function Signup() {
    const fields=signupFields;
    let fieldsState={};
    fields.forEach(field=>fieldsState[field.id]='')
    const navigate = useNavigate();
    const [signupState, setSignupState] = useState(fieldsState);
    const [emailValid, setEmailValid] = useState(true);

    const handleChange = (e) => {setSignupState(
        {...signupState, [e.target.id]:e.target.value}
    )
        if(e.target.id === 'email'){
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            setEmailValid(regex.test(e.target.value));
        }
    }

    const handleSubmit= (e) => {
        e.preventDefault()

        if(!emailValid){
            alert('Please enter a valid email address');
            return
        }

        if(signupState.password !== signupState.confirmPassword){
            alert('Password are not the same!')
            return
        }

        try{
            axios.post('http://localhost:80/wp_api/signup.php', {
               email : signupState.email,
               password : signupState.password
            }).then(function(response){
            alert('Sign up successfully')
            console.log(response)
            navigate('/')                
            })
        }catch (error){
            console.error('Registration failed:', error);
            console.log(error.response);
        }
    }

  return (
    <div>
        <form className=' mt-8 space-y-6' onSubmit={handleSubmit}>
            <div className=''>
                {
                    fields.map(field=>
                      <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                    )
                }
                <FormAction logo={SignupLogo} handleSubmit={handleSubmit} text='Signup'/>
            </div>
        </form>
    </div>
  )
}

export default Signup