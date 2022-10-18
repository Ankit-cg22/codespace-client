import React , {useState , useEffect} from 'react'
import {useRouter} from 'next/router' 
import { BACKEND_URL } from '../utils/constants'
import axios from 'axios'

export default function Navbar({roomId , handlePauseClick ,setMutedIncoming , mutedIncoming , paused }) {
  const router = useRouter()
  const [showCopied , setCopied] = useState(false)
  const [loggedIn,setLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState();
  const API = axios.create( { baseURL : BACKEND_URL } )

  const showCopy = () => {
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    } , 1500)
  }
  const handleCopyClick =()=>{
    navigator.clipboard.writeText(roomId)
    showCopy()
  }

  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setLoggedIn(false)
    setLoggedInUser({})
    router.push('/')
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
      localStorage.setItem('user' , JSON.stringify(response.data.user))
      setLoggedIn(true)
      setLoggedInUser(response.data.user)
    })
    .catch(function(error){
      console.log(error.message)
    })

  }, [])
  


  return (
    <div className='navbar-main flex justify-center items-center bg-gray-700 text-gray-300'>
        <div className='text-[2rem] font-bold cursor-pointer ' onClick={()=> router.push('/')} >
            CodeSpace
        </div>
        {roomId ? 
          <div className='flex justify-between items-center font-bold relative'>
            {showCopied && <div className='bg-cyan-200 p-[5px] rounded-[5px] text-black absolute right-[10%] bottom-[-120%] z-10'>Copied</div>}
            <button className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px] text-black' onClick={handlePauseClick}>
              {paused ?
                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6 9a1 1 0 0 1 1 1c0 1.42.242 2.947.969 4.088C8.648 15.156 9.819 16 12 16c2.181 0 3.352-.845 4.031-1.912C16.758 12.947 17 11.42 17 10a1 1 0 1 1 2 0c0 1.58-.258 3.553-1.281 5.162C16.648 16.844 14.819 18 12 18c-2.819 0-4.648-1.155-5.719-2.838C5.258 13.553 5 11.58 5 10a1 1 0 0 1 1-1z" fill="#000"/><path fillRule="evenodd" clipCule="evenodd" d="M12 16a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1zM9 5a3 3 0 1 1 6 0v1a1 1 0 1 1-2 0V5a1 1 0 1 0-2 0v5a1 1 0 1 1-2 0V5zM19.707 4.293a1 1 0 0 1 0 1.414l-14 14a1 1 0 0 1-1.414-1.414l14-14a1 1 0 0 1 1.414 0z" fill="#000"/></svg>
              : 
                <svg width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 20a5 5 0 0 0 5-5V7a5 5 0 0 0-10 0v8a5 5 0 0 0 5 5zM13 7a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0z"/><path d="M25 15a1 1 0 0 0-2 0 7 7 0 0 1-14 0 1 1 0 0 0-2 0 9 9 0 0 0 8 8.94V29a1 1 0 0 0 2 0v-5.06A9 9 0 0 0 25 15z"/></svg>
              }
              
            </button>
            <button className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px] text-black' onClick={()=>setMutedIncoming((p) => {return !p})}>
              {mutedIncoming ? 
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m21.29 1.29-3.43 3.44a2.52 2.52 0 0 0-3.8-1.3L8.7 7H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h.59l-4.3 4.29a1 1 0 0 0 1.42 1.42C9.05 16.36 8.29 17 8.7 17c5.7 3.8 5.73 4 6.76 4A2.54 2.54 0 0 0 18 18.46v-11l4.71-4.7a1 1 0 0 0-1.42-1.47zm-6.12 3.8a.55.55 0 0 1 .83.45v1l-6 6v-4zM6 15V9h2c0 6.81.53 6-2 6zm10 3.46a.55.55 0 0 1-.83.45L10 15.46c0-.1-.46.42 6-6.05z"/></svg>
                :
                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="high audio"><path d="M11.46 3c-1 0-1 .13-6.76 4H1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.7l5.36 3.57A2.54 2.54 0 0 0 14 18.46V5.54A2.54 2.54 0 0 0 11.46 3zM2 9h2v6H2zm10 9.46a.55.55 0 0 1-.83.45L6 15.46V8.54l5.17-3.45a.55.55 0 0 1 .83.45zM16.83 9.17a1 1 0 0 0-1.42 1.42 2 2 0 0 1 0 2.82 1 1 0 0 0 .71 1.71c1.38 0 3.04-3.62.71-5.95z"/><path d="M19 7.05a1 1 0 0 0-1.41 1.41 5 5 0 0 1 0 7.08 1 1 0 0 0 .7 1.7c1.61 0 4.8-6.05.71-10.19z"/><path d="M21.07 4.93a1 1 0 0 0-1.41 1.41 8 8 0 0 1 0 11.32 1 1 0 0 0 1.41 1.41 10 10 0 0 0 0-14.14z"/></g></svg>
              }
            </button>
            
            <button className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px] text-black' onClick={handleCopyClick}>Copy Room ID</button>
          </div>
        :
        <>
          {loggedIn ?
            <div className='w-[33%] md:w-[13%] flex justify-between'>
              <div className='navbar-link' onClick={()=>router.push('/profilePage')}>Profile</div>
              <div className='navbar-link' onClick={handleLogOut}>Log Out</div>
            </div>
          :
            <div className='navbar-link min-w-[10%] flex justify-center ' onClick={()=>router.push('/login')}>
              Login
            </div>
          }
        </>
        }
    </div>
  )
}
