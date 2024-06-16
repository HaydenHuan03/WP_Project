import React, {useState} from 'react'
import { loginFields } from '../../formFields'
import Input from '../components/Input'
import FormAction from '../components/formAction'
import FormExtra from '../components/formExtra'
import loginLogo from '../assests/right-from-bracket-solid.svg'

const fields=loginFields
let fieldState = {}
fields.forEach(field=>fieldState[field.id]='')

function Login() {
    const[loginState, setLoginState] = useState(fieldState)

    const handleChange = (e) => {
        setLoginState({...loginState, [e.target.id]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        authenticateUser();
    }

    const authenticateUser = () =>{

    }

  return (
    <div>
        <form className='mt-8 space-y-6'>
            <div className=' -space-y-px'>
                {
                    fields.map(field=>
                    <Input
                    key={field.id}
                    handleChange={handleChange}
                    value={loginState[field.id]}
                    labelText={field.labelText}
                    labelFor={field.labelFor}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    isRequired={field.isRequired}
                    placeholder={field.placeholder}
                    />)
                }
            </div>

            <FormExtra/>
            <FormAction logo={loginLogo} handleSubmit={handleSubmit} text='Login'/>
        </form>
    </div>
  )
}

export default Login