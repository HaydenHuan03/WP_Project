import React, {useState} from 'react'
import { loginFields } from '../../formFields'
import Input from '../components/Input'

function Login() {
    const fields=loginFields;
    let fieldState = {}
    fields.forEach(field=>fieldState[field.id]='')

    const[loginState, setLoginState] = useState(fieldState)

    const handleChange = (e) => {
        setLoginState({...loginState, [e.target.id]:e.target.value})
    }

  return (
    <div>
        <form className='mt-8 space-y-6'>
            <div className=' -space-y-px'>
                {
                    fields.map(field=><Input
                    key={field.id}
                    handleChange={handleChange}
                    value={loginState[field.id]}
                    labelText={field.labelText}
                    labelFor={field.labelFor}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    isRequired={field.isRequired}
                    placeholeder={field.placeholder}
                    />)
                }
            </div>
        </form>
    </div>
  )
}

export default Login