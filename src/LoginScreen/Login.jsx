import React, {useState} from 'react'
import { loginFields } from '../formFields'
import Input from './Input'
import FormAction from '../components/formAction'
import FormExtra from '../components/formExtra'
import loginLogo from '../assests/right-from-bracket-solid.svg'
import { loginUser } from '../redux/userSlice'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const fields=loginFields
let fieldState = {}
fields.forEach(field=>fieldState[field.id]='')

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const[loginState, setLoginState] = useState(fieldState)

    const handleChange = (e) => {
        setLoginState({...loginState, [e.target.id]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = loginState
        
        try{
            axios.post('http://localhost:80/wp_api/login.php',{
                email, password
            }).then(function(response){

                if(response.data.success){
                    dispatch(loginUser());
                    navigate('/main')
                }else{
                    alert('Invalid email or password')
                }
            })
        }catch(error){
            console.error('Login failed:', error)
            alert('An error occurred during login, Please try again.')
        }

    }

    const validateForm = () => {
        if(!username || !password){
            alert('Email and Password are required')
            return false
        }
        return true
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