import React, { useState , useEffect } from 'react'
import Editor from '@monaco-editor/react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants';
import CircularLoader from './CircularLoader';

export default function CodeSnippetModal({open , setOpen , snippet , setSavedSnippets , savedSnippets , createNotification}) {
    const API = axios.create( { baseURL : BACKEND_URL } )
    const [saving , setSaving] = useState(false)
    const [code , setCode] = useState(snippet.code);    

    const handleUpdateSnippet = () =>{
        // console.log(code)
        // console.log(snippet.snippet_id)
        setSaving(true)
        API.put(`/profile-page/update-snippet/${snippet.snippet_id}` , {code:code})
        .then(function(response){
            // console.log(response)
            const updatedSnippet = response.data.snippet 
            // console.log(updatedSnippet)
            const newSnippets = savedSnippets.map((ss) =>{
                if(ss.snippet_id ===snippet.snippet_id) return updatedSnippet
                return ss ;
            })
            // console.log(newSnippets)
            setSavedSnippets(newSnippets)
            createNotification("Snippet updated ")
            setSaving(false)

        })
        .catch(function(error){
            console.log(error)
            setSaving(false)
        })
      }
    
  return (
    <>
        {open ?
            <div className='h-full w-full absolute top-[0] bg-[rgba(0,0,0,0.5)]'> 
                <div className='code-snippet-modal-container absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                    <div className='flex justify-center items-center relative w-full mb-[10px]'>
                        <h1 className='text-white font-bold'>{snippet.title}</h1>
                        <svg className="absolute right-[1%] cursor-pointer" fill="white" onClick={()=>setOpen(false)} height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.707,12.293a1,1,0,1,1-1.414,1.414L12,13.414,9.707,15.707a1,1,0,0,1-1.414-1.414L10.586,12,8.293,9.707A1,1,0,0,1,9.707,8.293L12,10.586l2.293-2.293a1,1,0,0,1,1.414,1.414L13.414,12Z"/></svg>
                    </div>
                    <Editor
                        height="350px"
                        language = {snippet.lang}
                        value={snippet.code}
                        theme = "vs-dark" 
                        onChange={val => setCode(val)}
                    />
                    <div className='bg-cyan-200 p-[5px] rounded-[5px] mx-[10px] text-black font-bold cursor-pointer mt-[10px] px-[15px] ' onClick={handleUpdateSnippet}>
                        {saving ? <CircularLoader/> : "Save"}
                    </div>
                </div>
                
            </div>
        :
            <></>
        }
    </>
  )
}
