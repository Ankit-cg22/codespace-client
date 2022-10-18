import React , {useState} from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants'

export default function SaveSnippetModal({open ,setOpen, code , language , createNotification}) {
    const [title , setTitle] = useState('')
    const API = axios.create( { baseURL : BACKEND_URL } )

    const handleSaveSnippentClick =() =>{
        const user = JSON.parse(localStorage.getItem('user'))
        const snippetData = { user_id : user.user_id , code : code ,lang:language , title:title}
        if(!title)
        {
            createNotification("Please enter a title")
            return;
        }

        // console.log(snippetData)
        setOpen(false)
        
        // API call 
        API.post(
            '/profile-page/save-snippet' ,
            snippetData 
        )
        .then(function(response){
            createNotification("Snippet saved!")
        })
    }

  return (
    <>
    {open ?
        <div className='h-full w-full absolute top-[0] bg-[rgba(0,0,0,0.5)]'> 
            <div className='login-form-container absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                <svg className="absolute right-[1%] top-[5%] cursor-pointer " fill="white" onClick={()=>setOpen(false)} height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.707,12.293a1,1,0,1,1-1.414,1.414L12,13.414,9.707,15.707a1,1,0,0,1-1.414-1.414L10.586,12,8.293,9.707A1,1,0,0,1,9.707,8.293L12,10.586l2.293-2.293a1,1,0,0,1,1.414,1.414L13.414,12Z"/></svg>
                <h1 className='text-white mb-[20px] text-[1.5rem] font-bold'>Save Code Snippet</h1>
                <input placeholder='Add a title' type="text" name="text" className='max-w-[300px] w-[80%] md:w-[80%] mb-[20px] p-[10px] outline-none border-[2px] border-cyan-200 rounded-[5px]' onChange={(e)=> setTitle(e.target.value)} />
                <button className='home-button' onClick={(e) => handleSaveSnippentClick(e)}>Save</button>
            </div>
        </div>
    :
        <></>
    }
    </>
  )
}   
