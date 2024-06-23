import React, {useState, useEffect} from 'react'
import { loginFields } from '../formFields'
import Input from './Input'
import FormAction from '../components/formAction'
import loginLogo from '../assests/right-from-bracket-solid.svg'
import { loginUser } from '../redux/userSlice'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { fetchBoards } from '../redux/boardSlice'
import Cookies from 'js-cookie'

const fields=loginFields
let fieldState = {}
fields.forEach(field=>fieldState[field.id]='')

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const[loginState, setLoginState] = useState(fieldState)
    const[rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        // Check for the cookie when the component mounts
        const userCookie = Cookies.get('user_login')
        if (userCookie) {
            // If the cookie exists, fetch the user data
            fetchUserData(userCookie)
        }
    }, [])

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:80/wp_api/get_user.php?id=${userId}`)
            if (response.data.success) {
                setLoginState(prevState => ({
                    ...prevState,
                    email: response.data.user.email
                }))
                setRememberMe(true)
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error)
        }
    }

    const handleChange = (e) => {
        setLoginState({...loginState, [e.target.id]:e.target.value})
    }

    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = loginState
        if(!validateForm()){
            return
        }
        
        try{
            axios.post('http://localhost:80/wp_api/login.php',{
                email, password, rememberMe
            }).then(function(response){
                console.log(response.data)
                if(response.data.success){
                    dispatch(loginUser(response.data.user));

                    if(rememberMe){
                        Cookies.set('user_login', response.data.user.id, {expires: 30})
                    }
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('user_id', response.data.user.id);
                    dispatch(fetchBoards());
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
        if(!email || !password){
            alert('Email and Password are required')
            return false
        }
        return true
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

            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <input
                    id='rememberme'
                    name='rememberme'
                    type='checkbox'
                    checked={rememberMe}
                    onChange={handleRememberMe}
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

            <FormAction logo={loginLogo} handleSubmit={handleSubmit} text='Login'/>
        </form>
    </div>
  )
}

export default Login