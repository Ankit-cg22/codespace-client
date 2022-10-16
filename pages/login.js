import Navbar from '../components/Navbar'
import { useState , useEffect } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants';
import CircularLoader from '../components/CircularLoader';

export default function Home() {
  const router = useRouter();
  const API = axios.create( { baseURL : BACKEND_URL } )
  const [logging, setLogging] = useState(false)
  const [signUp , setSignUp] = useState(false)
  const [errorMessage , setErrorMessage] = useState()
  const [authData , setAuthData] = useState({
    name : "",
    email : "" ,
    password : ""
  })

  const handleInputChange = (e) => {
    setAuthData({...authData , [e.target.name]: e.target.value})
  }

  const handlLogInClick = (e) => {
    if(signUp) handleSignUp(e);
    else handleLogIn(e);
  }

  function handleSignUp(e){
    e.preventDefault();
    console.log(authData)
    API.post('/auth/register' ,
    authData ,
    {
        headers:{
            'Content-Type' : 'application/json'
        } 
    })
    .then(function(res){
        console.log(res.data)
        localStorage.setItem('token' , res.data.token)
        localStorage.setItem('user' , JSON.stringify(res.data.user))
        setAuthData({
        name : "",
        email : "" ,
        password : ""
        })
        router.push('/')
    })
    .catch(function(error){
        console.log(error.response.data.message)
        createErrorMessage(error.response.data.message)
    })
  }
  function handleLogIn(e){
    e.preventDefault();
    console.log(authData)
    API.post('/auth/login' ,
    authData ,
    {
        headers:{
            'Content-Type' : 'application/json'
        } 
    })
    .then(function(res){
        console.log(res.data)
        localStorage.setItem('token' , res.data.token)
        localStorage.setItem('user' , JSON.stringify(res.data.user))
        setAuthData({
            name : "",
            email : "" ,
            password : ""
        })
        router.push('/')
    })
    .catch(function(error){
        console.log(error.response.data.message)
        createErrorMessage(error.response.data.message)
    })
  }

  useEffect(() => {
    
    const token = localStorage.getItem('token')
    if(token === null) return ;
    API.get('/auth/isVerified' ,
    {
      headers:{
        token : token
      }
    }
    ).then(function(response){
      if(response.data.isVerified === false)return; 
      router.push('/');
      console.log(response.data.isVerified)
      console.log(response.data.user)
      localStorage.setItem('user' , JSON.stringify(response.data.user))
    })
    .catch(function(error){
      console.log(error.message)
    })


  }, [])

  function createErrorMessage(msg){
    setErrorMessage(msg)
    setTimeout(()=>{
      setErrorMessage("");
    },3000)
}

  return (
    <div className='h-[100vh] w-[100vw]  bg-gray-900'>
        <Navbar/>
        <div className='w-full h-[90%] flex justify-center items-center flex-col realtive'>
            {errorMessage && 
                <div className='w-[300px] p-[20px] bg-red-200 font-bold flex justify-center items-center rounded-[10px] absolute bottom-[5%] right-[1%] '>
                  {errorMessage} 
                </div>
            }
            <div className='login-form-container'>
                {signUp && 
                    <input placeholder='Name' name="name" type="text" className='max-w-[300px] w-[80%] md:w-[80%] mb-[20px] p-[10px] outline-none border-[2px] border-cyan-200 rounded-[5px]' onChange={(e)=>handleInputChange(e)} />
                }
                <input placeholder='Email' type="email" name="email" className='max-w-[300px] w-[80%] md:w-[80%] mb-[20px] p-[10px] outline-none border-[2px] border-cyan-200 rounded-[5px]' onChange={(e)=>handleInputChange(e)} />
                <input placeholder='Password' type="password" name="password" className='max-w-[300px] w-[80%] md:w-[80%] mb-[20px] p-[10px] outline-none border-[2px] border-cyan-200 rounded-[5px]' onChange={(e)=>   handleInputChange(e)} />
                <button className='home-button' onClick={(e) => handlLogInClick(e)}>
                {logging ? <CircularLoader/> 
                :
                    <>
                    {signUp ? "Sign Up" : "Log In"}
                    </>
                }
                </button>
                <div className='flex justify-between mt-[20px]  w-[60%] text-[0.8rem]'>

                    {signUp ?
                        <div className='text-white font-bold w-[60%]  flex justify-center items-center'> Already have account ?  </div>
                        :
                        <div className='text-white font-bold w-[60%]  flex justify-center items-center'> Do not have account ?  </div>
                    }   
                    <button className='login-button w-[40%]' onClick={()=>setSignUp(!signUp)}>
                        {signUp? "Log In" : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
